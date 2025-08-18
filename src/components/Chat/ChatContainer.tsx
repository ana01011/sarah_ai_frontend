import React, { useState, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../hooks/useChat';

export const ChatContainer: React.FC = () => {
  const { currentTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(chatTitle);

  const {
    currentChat,
    isStreaming,
    isLoading,
    error,
    sendMessage,
    stopStreaming,
    clearError
  } = useChat();

  useEffect(() => {
    if (currentChat.length > 0) {
      const firstMessage = currentChat[0];
      const title = firstMessage.content.slice(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
      setChatTitle(title);
      setEditTitle(title);
    }
  }, [currentChat]);

  const handleTitleEdit = () => {
    if (editTitle.trim() && editTitle !== chatTitle) {
      setChatTitle(editTitle.trim());
    }
    setIsEditingTitle(false);
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(chatTitle);
      setIsEditingTitle(false);
    }
  };

  const handleExport = () => {
    const chatData = {
      title: chatTitle,
      messages: currentChat,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b backdrop-blur-md"
        style={{
          backgroundColor: currentTheme.colors.surface + '80',
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleEdit}
              onKeyDown={handleKeyDown}
              className="text-lg font-semibold bg-transparent border-none outline-none w-full"
              style={{ color: currentTheme.colors.text }}
              autoFocus
            />
          ) : (
            <h1 
              className="text-lg font-semibold truncate cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: currentTheme.colors.text }}
              onClick={() => setIsEditingTitle(true)}
            >
              {chatTitle}
            </h1>
          )}
          
          {currentChat.length > 0 && (
            <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              {currentChat.length} message{currentChat.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ backgroundColor: currentTheme.colors.surface + '60' }}
          >
            <MoreVertical className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
          </button>

          {showMenu && (
            <div
              className="absolute top-full right-0 mt-2 min-w-[160px] backdrop-blur-md border rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: currentTheme.colors.surface + 'f0',
                borderColor: currentTheme.colors.border
              }}
            >
              <button
                onClick={() => {
                  setIsEditingTitle(true);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center space-x-2 transition-colors"
                style={{ color: currentTheme.colors.text }}
              >
                <Edit2 className="w-3 h-3" />
                <span>Rename Chat</span>
              </button>
              
              <button
                onClick={handleExport}
                className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center space-x-2 transition-colors"
                style={{ color: currentTheme.colors.text }}
                disabled={currentChat.length === 0}
              >
                <Download className="w-3 h-3" />
                <span>Export Chat</span>
              </button>
              
              <hr className="my-1" style={{ borderColor: currentTheme.colors.border }} />
              
              <button
                onClick={() => {
                  // Handle delete chat
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-red-500/20 flex items-center space-x-2 transition-colors"
                style={{ color: currentTheme.colors.error }}
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div 
          className="mx-4 mt-4 p-3 rounded-lg border flex items-center justify-between"
          style={{
            backgroundColor: currentTheme.colors.error + '20',
            borderColor: currentTheme.colors.error + '50',
            color: currentTheme.colors.error
          }}
        >
          <span className="text-sm">{error}</span>
          <button
            onClick={clearError}
            className="text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages */}
      <MessageList messages={currentChat} isLoading={isLoading} />

      {/* Input */}
      <MessageInput
        onSendMessage={sendMessage}
        onStopStreaming={stopStreaming}
        isStreaming={isStreaming}
        disabled={isLoading}
      />
    </div>
  );
};