import React, { useState } from 'react';
import { Plus, Menu, X, Search } from 'lucide-react';
import { ChatHistory } from '../../types/Chat';
import { UserProfile } from './UserProfile';
import { ChatHistoryList } from './ChatHistoryList';
import { ThemeToggle } from '../Common/ThemeToggle';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  onNewChat: () => void;
  onLoadChat: (chat: ChatHistory) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  chatHistory,
  currentChatId,
  onNewChat,
  onLoadChat,
  onDeleteChat,
  onRenameChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <X className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {!isCollapsed && (
            <button
              onClick={onNewChat}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Chat</span>
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* User Profile */}
          <UserProfile />

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat History */}
          <ChatHistoryList
            chatHistory={filteredHistory}
            currentChatId={currentChatId}
            onLoadChat={onLoadChat}
            onDeleteChat={onDeleteChat}
            onRenameChat={onRenameChat}
            searchTerm={searchTerm}
            onNewChat={onNewChat}
          />

          {/* Theme Toggle */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            <ThemeToggle />
          </div>
        </>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="flex flex-col items-center space-y-4 p-4">
          <button
            onClick={onNewChat}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-110"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};