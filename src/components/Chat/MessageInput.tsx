import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, agentRole?: string) => void;
  onStopStreaming: () => void;
  isStreaming: boolean;
  disabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled
}) => {
  const [message, setMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const agents = [
    { id: '', name: 'General AI' },
    { id: 'ceo', name: 'CEO Assistant' },
    { id: 'cto', name: 'CTO Assistant' },
    { id: 'cfo', name: 'CFO Assistant' },
    { id: 'cmo', name: 'CMO Assistant' },
    { id: 'coo', name: 'COO Assistant' }
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    onSendMessage(message.trim(), selectedAgent || undefined);
    setMessage('');
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
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Agent Selector */}
      <div className="mb-3">
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={disabled}
            className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '52px', maxHeight: '200px' }}
          />
          
          <button
            type="button"
            className="absolute right-3 top-3 p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        {isStreaming ? (
          <button
            type="button"
            onClick={handleStop}
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            title="Stop generation"
          >
            <Square className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </form>

      <div className="mt-2 text-xs text-gray-500 text-center">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Shift + Enter</kbd> for new line
      </div>
    </div>
  );
};