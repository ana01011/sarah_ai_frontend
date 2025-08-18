import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../hooks/useChat';

interface ChatContainerProps {
  chatId?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ chatId }) => {
  const { messages, isStreaming, streamMessage, stopStreaming } = useChat();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-900 p-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Sarah AI Chat
        </h1>
      </div>
      
      <MessageList messages={messages} isStreaming={isStreaming} />
      
      <MessageInput 
        onSendMessage={streamMessage}
        isStreaming={isStreaming}
        onStopStreaming={stopStreaming}
      />
    </div>
  );
};