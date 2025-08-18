import { useState, useCallback, useRef } from 'react';
import { Message, ChatHistory } from '../types/Chat';
import { StreamingService } from '../services/streaming';
import { ChatHistoryService } from '../services/chatHistory';

export const useChat = () => {
  const [currentChat, setCurrentChat] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const streamingService = StreamingService.getInstance();
  const historyService = ChatHistoryService.getInstance();
  const currentStreamingMessageRef = useRef<string>('');

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming || !content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setCurrentChat(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);
    currentStreamingMessageRef.current = '';

    // Create AI message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true
    };

    setCurrentChat(prev => [...prev, aiMessage]);

    try {
      await streamingService.streamChat(
        content,
        (token: string) => {
          currentStreamingMessageRef.current += token;
          setCurrentChat(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: currentStreamingMessageRef.current }
                : msg
            )
          );
        },
        () => {
          setCurrentChat(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          setIsStreaming(false);
          
          // Auto-save to history
          const updatedMessages = [...currentChat, userMessage, {
            ...aiMessage,
            content: currentStreamingMessageRef.current,
            isStreaming: false
          }];
          
          if (updatedMessages.length >= 2) {
            historyService.saveToHistory(updatedMessages).catch(console.error);
          }
        },
        (error: string) => {
          setError(error);
          setIsStreaming(false);
          setCurrentChat(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: 'Error: ' + error, isStreaming: false, error }
                : msg
            )
          );
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      setIsStreaming(false);
    }
  }, [isStreaming, currentChat]);

  const stopStreaming = useCallback(() => {
    streamingService.stopStreaming();
    setIsStreaming(false);
  }, []);

  const newChat = useCallback(() => {
    setCurrentChat([]);
    setCurrentChatId(null);
    setError(null);
  }, []);

  const loadChat = useCallback((chat: ChatHistory) => {
    setCurrentChat(chat.messages);
    setCurrentChatId(chat.id);
    setError(null);
  }, []);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const history = await historyService.loadHistory();
      setChatHistory(history);
    } catch (err) {
      setError('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      await historyService.deleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      if (currentChatId === chatId) {
        newChat();
      }
    } catch (err) {
      setError('Failed to delete chat');
    }
  }, [currentChatId, newChat]);

  const renameChat = useCallback(async (chatId: string, newTitle: string) => {
    try {
      await historyService.renameChat(chatId, newTitle);
      setChatHistory(prev => 
        prev.map(chat => 
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        )
      );
    } catch (err) {
      setError('Failed to rename chat');
    }
  }, []);

  return {
    currentChat,
    chatHistory,
    isStreaming,
    isLoading,
    error,
    currentChatId,
    sendMessage,
    stopStreaming,
    newChat,
    loadChat,
    loadHistory,
    deleteChat,
    renameChat,
    clearError: () => setError(null)
  };
};