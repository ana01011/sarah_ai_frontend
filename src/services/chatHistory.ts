import { ChatHistory, Message } from '../types/Chat';

export class ChatHistoryService {
  private static instance: ChatHistoryService;
  private API_BASE_URL = import.meta.env.VITE_API_URL || 'http://147.93.102.165:8000';

  static getInstance(): ChatHistoryService {
    if (!ChatHistoryService.instance) {
      ChatHistoryService.instance = new ChatHistoryService();
    }
    return ChatHistoryService.instance;
  }

  async saveToHistory(messages: Message[], title?: string, chatId?: string): Promise<string> {
    try {
      const chatTitle = title || messages[0]?.content.slice(0, 50) + '...' || 'New Chat';
      const preview = messages[messages.length - 1]?.content.slice(0, 100) + '...' || '';

      const response = await fetch(`${this.API_BASE_URL}/api/history/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id: chatId || Date.now().toString(),
          title: chatTitle,
          messages: messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString()
          })),
          preview,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save chat: ${response.status}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error saving chat:', error);
      throw error;
    }
  }

  async loadHistory(): Promise<ChatHistory[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load history: ${response.status}`);
      }

      const data = await response.json();
      return data.map((chat: any) => ({
        ...chat,
        timestamp: new Date(chat.timestamp),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/history/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete chat: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  async renameChat(chatId: string, newTitle: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/history/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) {
        throw new Error(`Failed to rename chat: ${response.status}`);
      }
    } catch (error) {
      console.error('Error renaming chat:', error);
      throw error;
    }
  }

  exportAsJSON(chat: ChatHistory): void {
    const dataStr = JSON.stringify(chat, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chat.title.replace(/[^a-z0-9]/gi, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  exportAsMarkdown(chat: ChatHistory): void {
    let markdown = `# ${chat.title}\n\n`;
    markdown += `*Exported on ${new Date().toLocaleDateString()}*\n\n`;

    chat.messages.forEach(message => {
      const sender = message.sender === 'user' ? 'You' : 'Sarah AI';
      const timestamp = message.timestamp.toLocaleString();
      markdown += `## ${sender} - ${timestamp}\n\n`;
      markdown += `${message.content}\n\n---\n\n`;
    });

    const dataBlob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chat.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }
}