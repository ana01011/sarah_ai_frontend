import { useState, useEffect } from 'react';
import { ChatHistory } from '../types/User';

export const useHistory = () => {
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setHistory(prev => prev.filter(chat => chat.id !== chatId));
      }
    } catch (error) {
      console.error('Delete chat error:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return {
    history,
    isLoading,
    loadHistory,
    deleteChat
  };
};