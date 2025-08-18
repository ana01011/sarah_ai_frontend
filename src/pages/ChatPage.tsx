import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ChatContainer } from '../components/Chat/ChatContainer';
import { useChat } from '../hooks/useChat';

export const ChatPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    chatHistory,
    currentChatId,
    newChat,
    loadChat,
    loadHistory,
    deleteChat,
    renameChat
  } = useChat();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey)) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            newChat();
            break;
          case '/':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
          case ',':
            e.preventDefault();
            // Open settings
            break;
        }
      }
      
      if (e.key === 'Escape') {
        // Stop generation if streaming
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarCollapsed, newChat]);

  return (
    <div 
      className="h-screen flex overflow-hidden transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-5">
        <div 
          className="absolute top-0 left-0 w-[32rem] h-[32rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[30rem] h-[30rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`relative z-50 ${isMobile && sidebarCollapsed ? 'hidden' : ''}`}>
        <Sidebar
          isCollapsed={sidebarCollapsed && !isMobile}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onNewChat={newChat}
          onLoadChat={loadChat}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
          onLoadHistory={loadHistory}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative z-10">
        <ChatContainer />
      </div>
    </div>
  );
};