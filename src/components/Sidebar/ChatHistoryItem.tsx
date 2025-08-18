import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Download, FileText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChatHistory } from '../../types/Chat';
import { formatDistanceToNow } from 'date-fns';
import { ChatHistoryService } from '../../services/chatHistory';

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
  const { currentTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  const historyService = ChatHistoryService.getInstance();

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

  const handleExportJSON = () => {
    historyService.exportAsJSON(chat);
    setShowMenu(false);
  };

  const handleExportMarkdown = () => {
    historyService.exportAsMarkdown(chat);
    setShowMenu(false);
  };

  return (
    <div
      className={`relative group p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
        isActive ? 'ring-1' : ''
      }`}
      style={{
        backgroundColor: isActive 
          ? currentTheme.colors.primary + '20'
          : 'transparent',
        ringColor: isActive ? currentTheme.colors.primary + '50' : 'transparent'
      }}
      onMouseEnter={() => !isEditing && setShowMenu(false)}
    >
      <div onClick={!isEditing ? onClick : undefined} className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-sm font-medium"
            style={{ color: currentTheme.colors.text }}
            autoFocus
          />
        ) : (
          <h4 
            className="text-sm font-medium truncate mb-1"
            style={{ color: currentTheme.colors.text }}
          >
            {chat.title}
          </h4>
        )}
        
        <p 
          className="text-xs truncate mb-1"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          {chat.preview}
        </p>
        
        <p 
          className="text-xs"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
        </p>
      </div>

      {/* Menu Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={`absolute top-2 right-2 p-1 rounded transition-all duration-200 hover:scale-110 ${
          showMenu || isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{ backgroundColor: currentTheme.colors.surface + '60' }}
      >
        <MoreVertical className="w-3 h-3" style={{ color: currentTheme.colors.textSecondary }} />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          className="absolute top-8 right-2 z-50 min-w-[160px] backdrop-blur-md border rounded-lg shadow-lg py-1"
          style={{
            backgroundColor: currentTheme.colors.surface + 'f0',
            borderColor: currentTheme.colors.border
          }}
        >
          <button
            onClick={() => {
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center space-x-2 transition-colors"
            style={{ color: currentTheme.colors.text }}
          >
            <Edit2 className="w-3 h-3" />
            <span>Rename</span>
          </button>
          
          <button
            onClick={handleExportJSON}
            className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center space-x-2 transition-colors"
            style={{ color: currentTheme.colors.text }}
          >
            <Download className="w-3 h-3" />
            <span>Export JSON</span>
          </button>
          
          <button
            onClick={handleExportMarkdown}
            className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center space-x-2 transition-colors"
            style={{ color: currentTheme.colors.text }}
          >
            <FileText className="w-3 h-3" />
            <span>Export Markdown</span>
          </button>
          
          <hr className="my-1" style={{ borderColor: currentTheme.colors.border }} />
          
          <button
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-500/20 flex items-center space-x-2 transition-colors"
            style={{ color: currentTheme.colors.error }}
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};