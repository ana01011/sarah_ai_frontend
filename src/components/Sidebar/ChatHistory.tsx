import React from 'react';
import { ChatHistoryItem } from './ChatHistoryItem';
import { useHistory } from '../../hooks/useHistory';
import { ChatHistory as ChatHistoryType } from '../../types/User';

interface ChatHistoryProps {
  activeChatId?: string;
  onSelectChat: (chat: ChatHistoryType) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ activeChatId, onSelectChat }) => {
  const { history, isLoading, deleteChat } = useHistory();

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {history.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p className="text-sm">No chat history yet</p>
          <p className="text-xs mt-1">Start a conversation to see it here</p>
        </div>
      ) : (
        history.map((chat) => (
          <ChatHistoryItem
            key={chat.id}
            chat={chat}
            isActive={activeChatId === chat.id}
            onSelect={onSelectChat}
            onDelete={deleteChat}
          />
        ))
      )}
    </div>
  );
};