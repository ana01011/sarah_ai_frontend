import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { StreamingIndicator } from './StreamingIndicator';
import { Message as MessageType } from '../../types/Chat';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Sarah AI</h3>
            <p className="text-gray-600 mb-4">
              I'm your advanced AI assistant. Ask me anything about technology, business strategy, or get help with your projects.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "What's our system performance?",
                "Analyze market trends",
                "Generate a report",
                "Help with coding"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {isLoading && <StreamingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};