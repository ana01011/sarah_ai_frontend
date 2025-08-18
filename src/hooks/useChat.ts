import { useState, useCallback } from 'react';
import { ChatMessage } from '../types/User';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const streamMessage = async (message: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    
    let fullResponse = '';
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message, 
          stream: true,
          max_tokens: 500 
        })
      });

      if (!response.ok) {
        throw new Error('Stream failed');
      }

      // Add AI message placeholder
      const aiMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: '', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMessage]);

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
                  setMessages(prev => {
                    const updated = [...prev];
                    if (updated.length > 0) {
                      updated[updated.length - 1].content = fullResponse;
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
      }
    } catch (error) {
      console.error('Streaming error:', error);
      // Fallback to regular chat
      await sendRegularMessage(message);
    } finally {
      setIsStreaming(false);
      // Auto-save to history
      await saveToHistory();
    }
  };

  const sendRegularMessage = async (message: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message,
          max_tokens: 500 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  const saveToHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token || messages.length === 0) return;

    const title = messages[0]?.content.slice(0, 30) || 'New Chat';
    const chatId = currentChatId || Date.now().toString();
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/history/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: chatId,
          title,
          messages,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!currentChatId) {
        setCurrentChatId(chatId);
      }
    } catch (error) {
      console.error('Save history error:', error);
    }
  };

  const newChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
  }, []);

  const loadChat = useCallback((chatHistory: any) => {
    setMessages(chatHistory.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })));
    setCurrentChatId(chatHistory.id);
  }, []);

  const stopStreaming = () => {
    setIsStreaming(false);
  };

  return {
    messages,
    isStreaming,
    currentChatId,
    streamMessage,
    newChat,
    loadChat,
    stopStreaming
  };
};