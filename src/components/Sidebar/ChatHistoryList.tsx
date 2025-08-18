import React from 'react';
import { History } from 'lucide-react';
import { ChatHistory } from '../../types/Chat';
import { ChatHistoryItem } from './ChatHistoryItem';

interface ChatHistoryListProps {
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  onLoadChat: (chat: ChatHistory) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  searchTerm: string;
  onNewChat: () => void;
}

export const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  chatHistory,
  currentChatId,
  onLoadChat,
  onDeleteChat,
  onRenameChat,
  searchTerm,
  onNewChat
}) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">Recent Chats</h3>
        </div>
        
        {chatHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 mb-2">
              {searchTerm ? 'No chats found' : 'No chat history yet'}
            </p>
            {!searchTerm && (
              <button
                onClick={onNewChat}
                className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
              >
                Start your first conversation
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                chat={chat}
                isActive={currentChatId === chat.id}
                onClick={() => onLoadChat(chat)}
                onDelete={() => onDeleteChat(chat.id)}
                onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};