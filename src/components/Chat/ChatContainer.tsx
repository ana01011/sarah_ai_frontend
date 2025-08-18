import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../hooks/useChat';

export const ChatContainer: React.FC = () => {
  const {
    currentChat,
    isStreaming,
    isLoading,
    error,
    sendMessage,
    stopStreaming,
    clearError
  } = useChat();

  return (
    <div className="flex flex-col h-full">
      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-700">
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