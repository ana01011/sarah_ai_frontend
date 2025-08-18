import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ChatHistory } from '../../types/Chat';

interface ChatHistoryItemProps {
  chat: ChatHistory;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  chat,
  isActive,
  onClick,
  onDelete,
  onRename
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);

  const formatDate = (date: Date) => {
    try {
      return format(date, 'MMM d');
    } catch {
      return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(chat.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
        isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'
      }`}
      onClick={!isEditing ? onClick : undefined}
    >
      <div className="flex items-start space-x-3">
        <MessageCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
          isActive ? 'text-blue-500' : 'text-gray-400'
        }`} />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <h4 className={`text-sm font-medium truncate ${
              isActive ? 'text-blue-700' : 'text-gray-800'
            }`}>
              {chat.title}
            </h4>
          )}
          
          <p className="text-xs text-gray-500 truncate mt-1">
            {chat.preview}
          </p>
          
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(chat.timestamp)}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all duration-200"
          >
            <MoreVertical className="w-3 h-3 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 transition-colors text-gray-700"
              >
                <Edit2 className="w-3 h-3" />
                <span>Rename</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center space-x-2 transition-colors text-red-600"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};