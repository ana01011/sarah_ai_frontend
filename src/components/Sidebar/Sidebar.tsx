import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChatHistory } from '../../types/Chat';

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

  return (
    <div 
      className={`h-full border-r transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
      style={{
        backgroundColor: currentTheme.colors.surface + '80',
        borderColor: currentTheme.colors.border
      }}
    >
      <div className="p-4">
        <button
          onClick={onToggle}
          className="w-full p-2 rounded-lg transition-colors"
          style={{
            backgroundColor: currentTheme.colors.primary + '20',
            color: currentTheme.colors.text
          }}
        >
          {isCollapsed ? '→' : '←'}
        </button>
        
        {!isCollapsed && (
          <div className="mt-4">
            <button
              onClick={onNewChat}
              className="w-full p-3 rounded-lg mb-4 transition-colors"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.text
              }}
            >
              New Chat
            </button>
            
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onLoadChat(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id ? 'bg-opacity-50' : ''
                  }`}
                  style={{
                    backgroundColor: currentChatId === chat.id 
                      ? currentTheme.colors.primary + '30'
                      : currentTheme.colors.surface + '40',
                    color: currentTheme.colors.text
                  }}
                >
                  <div className="text-sm font-medium truncate">
                    {chat.title}
                  </div>
                  <div className="text-xs opacity-70 truncate">
                    {chat.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};