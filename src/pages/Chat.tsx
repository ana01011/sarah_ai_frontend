import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ChatContainer } from '../components/Chat/ChatContainer';
import { useChat } from '../hooks/useChat';
import { ChatHistory } from '../types/User';

export const ChatPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentChatId, newChat, loadChat } = useChat();

  const handleNewChat = () => {
    newChat();
    setSidebarOpen(false);
  };

  const handleSelectChat = (chat: ChatHistory) => {
    loadChat(chat);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        activeChatId={currentChatId}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <ChatContainer chatId={currentChatId} />
      </div>
    </div>
  );
};