import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, Paperclip } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onStopStreaming: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled = false
}) => {
  const { currentTheme } = useTheme();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isStreaming && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current && !message) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message]);

  const characterCount = message.length;
  const maxCharacters = 4000;

  return (
    <div 
      className="border-t backdrop-blur-md"
      style={{ 
        backgroundColor: currentTheme.colors.surface + '95',
        borderColor: currentTheme.colors.border
      }}
    >
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div 
            className="relative border rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-2"
            style={{ 
              backgroundColor: currentTheme.colors.background,
              borderColor: currentTheme.colors.border,
              '--tw-ring-color': currentTheme.colors.primary + '50'
            } as React.CSSProperties}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              disabled={disabled}
              className="w-full resize-none border-0 bg-transparent px-4 py-3 pr-24 focus:outline-none focus:ring-0 min-h-[50px] max-h-[200px]"
              style={{ 
                color: currentTheme.colors.text,
                fontSize: '14px',
                lineHeight: '1.5'
              }}
              rows={1}
            />
            
            {/* Action buttons */}
            <div className="absolute right-2 bottom-2 flex items-center space-x-2">
              <button
                type="button"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-50 hover:opacity-100"
                style={{ color: currentTheme.colors.textSecondary }}
                title="Attach file (coming soon)"
                disabled
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ 
                    backgroundColor: currentTheme.colors.error,
                    color: 'white'
                  }}
                  title="Stop generation"
                >
                  <StopCircle className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!message.trim() || disabled}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ 
                    backgroundColor: message.trim() && !disabled ? currentTheme.colors.primary : currentTheme.colors.textSecondary + '50',
                    color: 'white'
                  }}
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Character counter and shortcuts */}
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              <span className="hidden sm:inline">Enter to send • Shift+Enter for new line</span>
              <span className="sm:hidden">Enter to send</span>
            </div>
            <div 
              className="text-xs"
              style={{ 
                color: characterCount > maxCharacters * 0.9 
                  ? currentTheme.colors.error 
                  : currentTheme.colors.textSecondary 
              }}
            >
              {characterCount}/{maxCharacters}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};