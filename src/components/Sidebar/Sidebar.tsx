import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Settings, 
  LogOut, 
  User, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  History
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChatHistoryItem } from './ChatHistoryItem';
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
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    onLoadHistory();
  }, [onLoadHistory]);

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Sidebar */}
      <div
        className={`relative flex flex-col border-r backdrop-blur-md transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-80'
        }`}
        style={{
          backgroundColor: currentTheme.colors.surface + '80',
          borderColor: currentTheme.colors.border
        }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: currentTheme.colors.border }}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: currentTheme.colors.primary + '20' }}
                >
                  <User className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: currentTheme.colors.text }}>
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs truncate" style={{ color: currentTheme.colors.textSecondary }}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={onToggle}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ backgroundColor: currentTheme.colors.surface + '60' }}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
              ) : (
                <ChevronLeft className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
              )}
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
              color: currentTheme.colors.text
            }}
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                style={{ color: currentTheme.colors.textSecondary }}
              />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none transition-all duration-200"
                style={{
                  backgroundColor: currentTheme.colors.background + '60',
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
              />
            </div>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <div className="px-4 pb-2">
              <div className="flex items-center space-x-2 mb-3">
                <History className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                <span className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>
                  Recent Chats
                </span>
              </div>
            </div>
          )}
          
          <div className="px-4 space-y-2">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((chat) => (
                <ChatHistoryItem
                  key={chat.id}
                  chat={chat}
                  isActive={currentChatId === chat.id}
                  onClick={() => onLoadChat(chat)}
                  onDelete={() => onDeleteChat(chat.id)}
                  onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                />
              ))
            ) : (
              !isCollapsed && (
                <div className="text-center py-8">
                  <MessageSquare 
                    className="w-8 h-8 mx-auto mb-2 opacity-50" 
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                  <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {searchQuery ? 'No chats found' : 'No chat history yet'}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundColor: currentTheme.colors.surface + '60' }}
            >
              <Settings className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
              {!isCollapsed && <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>Settings</span>}
            </button>
            
            <button
              onClick={logout}
              className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundColor: currentTheme.colors.error + '20' }}
            >
              <LogOut className="w-4 h-4" style={{ color: currentTheme.colors.error }} />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="w-full max-w-md mx-4 rounded-2xl p-6 border"
            style={{
              backgroundColor: currentTheme.colors.surface + 'f0',
              borderColor: currentTheme.colors.border
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
              Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                  Theme
                </label>
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  Use the theme selector in the main dashboard to change themes.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                  API Endpoint
                </label>
                <input
                  type="text"
                  value={import.meta.env.VITE_API_URL}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border opacity-50"
                  style={{
                    backgroundColor: currentTheme.colors.background + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: currentTheme.colors.surface + '60',
                  color: currentTheme.colors.text
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};