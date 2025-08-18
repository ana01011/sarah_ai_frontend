import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ChatContainer } from '../components/Chat/ChatContainer';
import { useChat } from '../hooks/useChat';
import { Logo } from '../components/Common/Logo';

export const ChatPage: React.FC = () => {
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
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

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
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarCollapsed, newChat]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
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
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <Logo size="sm" />
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {currentChatId ? 'Active Chat' : 'New Conversation'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <ChatContainer />
      </div>
    </div>
  );
};