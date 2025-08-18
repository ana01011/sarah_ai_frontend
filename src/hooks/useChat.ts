import { useState, useCallback } from 'react';
import { Message, ChatHistory } from '../types/Chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://147.93.102.165:8000';

export const useChat = () => {
  const [currentChat, setCurrentChat] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const streamMessage = async (message: string, agentRole?: string) => {
    setIsStreaming(true);
    setError(null);
    let fullResponse = '';
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    
    setCurrentChat(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sarah-token')}`
        },
        body: JSON.stringify({ 
          message,
          role: agentRole,
          stream: true,
          max_tokens: 500 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Add AI message placeholder
      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: '', 
        timestamp: new Date(),
        isStreaming: true,
        agentRole
      };
      
      setCurrentChat(prev => [...prev, aiMessage]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.token) {
                  fullResponse += data.token;
                  // Update last message with streaming content
                  setCurrentChat(prev => {
                    const updated = [...prev];
                    const lastMessage = updated[updated.length - 1];
                    if (lastMessage.role === 'assistant') {
                      updated[updated.length - 1] = {
                        ...lastMessage,
                        content: fullResponse,
                        isStreaming: true
                      };
                    }
                    return updated;
                  });
                }
              } catch (e) {
                console.error('Parse error:', e);
              }
            }
          }
        }
      } else {
        // Fallback for non-streaming response
        const data = await response.json();
        fullResponse = data.response || data.content || 'No response received';
        
        setCurrentChat(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          if (lastMessage.role === 'assistant') {
            updated[updated.length - 1] = {
              ...lastMessage,
              content: fullResponse,
              isStreaming: false
            };
          }
          return updated;
        });
      }

      // Mark streaming as complete
      setCurrentChat(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage.role === 'assistant') {
          updated[updated.length - 1] = {
            ...lastMessage,
            isStreaming: false
          };
        }
        return updated;
      });

    } catch (error) {
      console.error('Failed to get response:', error);
      setError(error instanceof Error ? error.message : 'Failed to get response');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setCurrentChat(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
      await saveToHistory();
    }
  };

  const saveToHistory = async () => {
    if (currentChat.length === 0) return;
    
    try {
      const title = currentChat[0]?.content.slice(0, 30) + '...' || 'New Chat';
      const preview = currentChat[0]?.content.slice(0, 100) || '';
      
      const chatData: ChatHistory = {
        id: currentChatId || Date.now().toString(),
        title,
        messages: currentChat,
        timestamp: new Date(),
        preview
      };

      await fetch(`${API_BASE_URL}/api/history/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sarah-token')}`
        },
        body: JSON.stringify(chatData)
      });

      // Update local history
      setChatHistory(prev => {
        const existing = prev.find(chat => chat.id === chatData.id);
        if (existing) {
          return prev.map(chat => chat.id === chatData.id ? chatData : chat);
        }
        return [chatData, ...prev];
      });

    } catch (error) {
      console.error('Failed to save chat history:', error);
      // Save locally as fallback
      const localHistory = JSON.parse(localStorage.getItem('sarah-chat-history') || '[]');
      const chatData = {
        id: currentChatId || Date.now().toString(),
        title: currentChat[0]?.content.slice(0, 30) + '...' || 'New Chat',
        messages: currentChat,
        timestamp: new Date(),
        preview: currentChat[0]?.content.slice(0, 100) || ''
      };
      
      const updatedHistory = [chatData, ...localHistory.filter((chat: any) => chat.id !== chatData.id)];
      localStorage.setItem('sarah-chat-history', JSON.stringify(updatedHistory));
      setChatHistory(updatedHistory);
    }
  };

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sarah-token')}`
        }
      });
      
      if (response.ok) {
        const history = await response.json();
        setChatHistory(history);
      } else {
        throw new Error('Failed to load from server');
      }
    } catch (error) {
      console.error('Failed to load chat history from server:', error);
      // Load from localStorage as fallback
      const localHistory = JSON.parse(localStorage.getItem('sarah-chat-history') || '[]');
      setChatHistory(localHistory);
    }
  }, []);

  const newChat = () => {
    setCurrentChat([]);
    setCurrentChatId(null);
    setError(null);
  };

  const loadChat = (chat: ChatHistory) => {
    setCurrentChat(chat.messages);
    setCurrentChatId(chat.id);
    setError(null);
  };

  const deleteChat = async (chatId: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/history/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sarah-token')}`
        }
      });
    } catch (error) {
      console.error('Failed to delete from server:', error);
    }
    
    // Remove from local state and storage
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    const localHistory = JSON.parse(localStorage.getItem('sarah-chat-history') || '[]');
    const updatedHistory = localHistory.filter((chat: any) => chat.id !== chatId);
    localStorage.setItem('sarah-chat-history', JSON.stringify(updatedHistory));
    
    if (currentChatId === chatId) {
      newChat();
    }
  };

  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/history/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sarah-token')}`
        },
        body: JSON.stringify({ title: newTitle })
      });
    } catch (error) {
      console.error('Failed to rename on server:', error);
    }
    
    // Update local state and storage
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
    
    const localHistory = JSON.parse(localStorage.getItem('sarah-chat-history') || '[]');
    const updatedHistory = localHistory.map((chat: any) => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    );
    localStorage.setItem('sarah-chat-history', JSON.stringify(updatedHistory));
  };

  const stopStreaming = () => {
    setIsStreaming(false);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    currentChat,
    chatHistory,
    isStreaming,
    isLoading,
    error,
    currentChatId,
    sendMessage: streamMessage,
    newChat,
    loadChat,
    loadHistory,
    deleteChat,
    renameChat,
    stopStreaming,
    clearError
  };
};