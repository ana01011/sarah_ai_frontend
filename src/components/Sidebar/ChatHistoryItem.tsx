import React, { useState } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { ChatHistory } from '../../types/User';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryItemProps {
  chat: ChatHistory;
  isActive: boolean;
  onSelect: (chat: ChatHistory) => void;
  onDelete: (chatId: string) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ 
  chat, 
  isActive, 
  onSelect, 
  onDelete 
}) => {
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(chat.id);
  };

  return (
    <div
      className={`
        p-3 rounded-lg cursor-pointer transition-colors relative group
        ${isActive 
          ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
      onClick={() => onSelect(chat)}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="flex items-start space-x-3">
        <MessageSquare className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {chat.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
          </p>
          {chat.messages.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
              {chat.messages[0].content.slice(0, 50)}...
            </p>
          )}
        </div>
      </div>
      
      {showDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};