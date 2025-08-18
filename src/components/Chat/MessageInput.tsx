import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, Keyboard } from 'lucide-react';
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
  const [showShortcuts, setShowShortcuts] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 4000;
  const charCount = message.length;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isStreaming && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStop = () => {
    onStopStreaming();
  };

  return (
    <div 
      className="border-t backdrop-blur-md p-4"
      style={{
        backgroundColor: currentTheme.colors.surface + '80',
        borderColor: currentTheme.colors.border
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? "AI is responding..." : "Type your message..."}
            disabled={disabled || isStreaming}
            maxLength={maxLength}
            className="w-full resize-none rounded-xl border px-4 py-3 pr-24 focus:outline-none transition-all duration-200 min-h-[50px] max-h-[200px]"
            style={{
              backgroundColor: currentTheme.colors.background + '60',
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
              e.currentTarget.style.backgroundColor = currentTheme.colors.background + '80';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = currentTheme.colors.border;
              e.currentTarget.style.backgroundColor = currentTheme.colors.background + '60';
            }}
          />
          
          <div className="absolute right-2 top-2 flex items-center space-x-2">
            <button
              type="button"
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 opacity-50 cursor-not-allowed"
              disabled
              title="File upload (coming soon)"
            >
              <Paperclip className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
            </button>
            
            {isStreaming ? (
              <button
                type="button"
                onClick={handleStop}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg"
                style={{
                  backgroundColor: currentTheme.colors.error + '20',
                  color: currentTheme.colors.error
                }}
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{
                  background: message.trim() && !disabled
                    ? `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    : currentTheme.colors.surface + '60',
                  color: currentTheme.colors.text
                }}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="flex items-center space-x-1 hover:underline transition-colors"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              <Keyboard className="w-3 h-3" />
              <span>Shortcuts</span>
            </button>
            
            {showShortcuts && (
              <div className="flex items-center space-x-3 text-xs">
                <span style={{ color: currentTheme.colors.textSecondary }}>
                  <kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: currentTheme.colors.surface + '60' }}>
                    Enter
                  </kbd> to send
                </span>
                <span style={{ color: currentTheme.colors.textSecondary }}>
                  <kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: currentTheme.colors.surface + '60' }}>
                    Shift+Enter
                  </kbd> for new line
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span 
              className={`text-xs ${charCount > maxLength * 0.9 ? 'font-bold' : ''}`}
              style={{ 
                color: charCount > maxLength * 0.9 
                  ? currentTheme.colors.warning 
                  : currentTheme.colors.textSecondary 
              }}
            >
              {charCount}/{maxLength}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};