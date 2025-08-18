import React, { useState } from 'react';
import { Copy, Check, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message as MessageType } from '../../types/Chat';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (date: Date) => {
    try {
      return format(date, 'HH:mm');
    } catch {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-[85%] sm:max-w-[75%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
        {/* Avatar for AI messages */}
        {message.role === 'assistant' && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Sarah AI</span>
            {message.agentRole && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {message.agentRole.toUpperCase()}
              </span>
            )}
          </div>
        )}
        
        <div
          className={`relative p-4 rounded-2xl transition-all duration-200 ${
            message.role === 'user'
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-white border border-gray-200 text-gray-800'
          } ${message.isStreaming ? 'animate-pulse' : ''}`}
        >
          {/* Message Content */}
          <div className="prose prose-sm max-w-none">
            {message.role === 'assistant' ? (
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative">
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg !mt-2 !mb-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                        <button
                          onClick={() => copyToClipboard(String(children))}
                          className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ) : (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          {/* Streaming indicator */}
          {message.isStreaming && (
            <div className="flex items-center space-x-2 mt-2 text-gray-500">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="text-xs">Thinking...</span>
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>

        {/* Message Actions */}
        {showActions && message.role === 'assistant' && !message.isStreaming && (
          <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => copyToClipboard(message.content)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Good response"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Poor response"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};