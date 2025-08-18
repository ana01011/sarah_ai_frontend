import React, { useState } from 'react';
import { Plus, Menu, X, Search, History } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChatHistory } from '../../types/Chat';
import { UserProfile } from './UserProfile';
import { ChatHistoryItem } from './ChatHistoryItem';
import { ThemeSelector } from '../ThemeSelector';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  onNewChat: () => void;
  onLoadChat: (chat: ChatHistory) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onLoadHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  chatHistory,
  currentChatId,
  onNewChat,
  onLoadChat,
  onDeleteChat,
  onRenameChat,
  onLoadHistory
}) => {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    onLoadHistory();
  }, [onLoadHistory]);

  return (
    <div 
      className={`h-full border-r transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
      style={{
        backgroundColor: currentTheme.colors.surface + '95',
        borderColor: currentTheme.colors.border
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: currentTheme.colors.border }}>
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ backgroundColor: currentTheme.colors.surface + '60' }}
          >
            {isCollapsed ? (
              <Menu className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
            ) : (
              <X className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
            )}
          </button>
          
          {!isCollapsed && (
            <button
              onClick={onNewChat}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                color: currentTheme.colors.text
              }}
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
          <div className="p-4 border-b" style={{ borderColor: currentTheme.colors.border }}>
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                style={{ color: currentTheme.colors.textSecondary }}
              />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none"
                style={{
                  backgroundColor: currentTheme.colors.background + '80',
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = currentTheme.colors.border;
                }}
              />
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <History className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
                  Recent Chats
                </h3>
              </div>
              
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {searchTerm ? 'No chats found' : 'No chat history yet'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={onNewChat}
                      className="mt-2 text-sm hover:underline"
                      style={{ color: currentTheme.colors.primary }}
                    >
                      Start your first conversation
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredHistory.map((chat) => (
                    <ChatHistoryItem
                      key={chat.id}
                      chat={chat}
                      isActive={currentChatId === chat.id}
                      onClick={() => onLoadChat(chat)}
                      onDelete={() => onDeleteChat(chat.id)}
                      onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="p-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex justify-center">
              <ThemeSelector />
            </div>
          </div>
        </>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="flex flex-col items-center space-y-4 p-4">
          <button
            onClick={onNewChat}
            className="p-3 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};