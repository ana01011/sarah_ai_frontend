import React, { useState } from 'react';
import { Copy, User, Bot, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Message as MessageType } from '../../types/Chat';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { currentTheme } = useTheme();
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const isUser = message.sender === 'user';

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      <div className={`flex items-start space-x-3 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isUser 
              ? currentTheme.colors.primary + '20'
              : currentTheme.colors.secondary + '20'
          }}
        >
          {isUser ? (
            <User className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
          ) : (
            <Bot className="w-4 h-4" style={{ color: currentTheme.colors.secondary }} />
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div
            className={`relative rounded-2xl px-4 py-3 transition-all duration-200 ${
              message.isStreaming ? 'animate-pulse' : ''
            }`}
            style={{
              backgroundColor: isUser 
                ? `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.primary}10)`
                : currentTheme.colors.surface + '60',
              borderColor: isUser 
                ? currentTheme.colors.primary + '30'
                : currentTheme.colors.border,
              border: '1px solid'
            }}
          >
            {/* Message Text */}
            <div className="prose prose-sm max-w-none" style={{ color: currentTheme.colors.text }}>
              {isUser ? (
                <p className="mb-0 whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg !mt-2 !mb-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code 
                          className="px-1 py-0.5 rounded text-sm"
                          style={{ backgroundColor: currentTheme.colors.surface + '40' }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content || (message.isStreaming ? '●' : '')}
                </ReactMarkdown>
              )}
            </div>

            {/* Streaming Indicator */}
            {message.isStreaming && (
              <div className="flex items-center space-x-1 mt-2">
                <div className="flex space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: currentTheme.colors.secondary }}
                  ></div>
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce delay-100"
                    style={{ backgroundColor: currentTheme.colors.secondary }}
                  ></div>
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce delay-200"
                    style={{ backgroundColor: currentTheme.colors.secondary }}
                  ></div>
                </div>
                <span className="text-xs ml-2" style={{ color: currentTheme.colors.textSecondary }}>
                  AI is typing...
                </span>
              </div>
            )}

            {/* Error Display */}
            {message.error && (
              <div 
                className="mt-2 p-2 rounded-lg text-sm"
                style={{
                  backgroundColor: currentTheme.colors.error + '20',
                  color: currentTheme.colors.error
                }}
              >
                Error: {message.error}
              </div>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                showTimestamp ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundColor: currentTheme.colors.surface + '80',
                color: currentTheme.colors.textSecondary
              }}
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3" style={{ color: currentTheme.colors.success }} />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Timestamp */}
          {showTimestamp && (
            <div 
              className={`text-xs mt-1 transition-opacity duration-200 ${isUser ? 'text-right' : 'text-left'}`}
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};