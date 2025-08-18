import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { Message as MessageType } from '../../types/Chat';
import { useTheme } from '../../contexts/ThemeContext';

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading = false }) => {
  const { currentTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: currentTheme.colors.primary + '20' }}
          >
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
            Start a conversation
          </h3>
          <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
            Ask me anything! I'm here to help with your questions and tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      style={{ backgroundColor: 'transparent' }}
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: currentTheme.colors.primary }}
            ></div>
            <div 
              className="w-2 h-2 rounded-full animate-bounce delay-100"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            ></div>
            <div 
              className="w-2 h-2 rounded-full animate-bounce delay-200"
              style={{ backgroundColor: currentTheme.colors.accent }}
            ></div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};