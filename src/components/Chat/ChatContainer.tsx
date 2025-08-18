import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Mic, MicOff, Paperclip, X, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  typing?: boolean;
}

interface ChatContainerProps {
  isIntegrated?: boolean;
  agentContext?: any;
  onClose?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ 
  isIntegrated = false, 
  agentContext,
  onClose 
}) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: agentContext 
        ? `Hello! I'm ${agentContext.name}, your ${agentContext.role}. How can I assist you today?`
        : "Hello! I'm Sarah, your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://147.93.102.165:8000/api/v1/chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          role: agentContext?.role || 'general'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error connecting to the AI service. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {!isIntegrated && (
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ 
            backgroundColor: currentTheme.colors.surface + '80',
            borderColor: currentTheme.colors.border 
          }}
        >
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
              {agentContext ? `${agentContext.name}` : 'Sarah AI'}
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-white/10"
            >
              <X className="w-5 h-5" style={{ color: currentTheme.colors.textSecondary }} />
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'ml-auto' 
                  : 'mr-auto'
              }`}
              style={{
                backgroundColor: message.sender === 'user' 
                  ? currentTheme.colors.primary + '20'
                  : currentTheme.colors.surface + '40',
                color: currentTheme.colors.text
              }}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span 
                className="text-xs mt-1 block opacity-70"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: currentTheme.colors.surface + '40' }}
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 animate-pulse" style={{ color: currentTheme.colors.primary }} />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ backgroundColor: currentTheme.colors.accent }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div 
        className="p-4 border-t"
        style={{ borderColor: currentTheme.colors.border }}
      >
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="w-full resize-none border rounded-lg px-4 py-3 focus:outline-none transition-colors"
              style={{
                backgroundColor: currentTheme.colors.surface + '60',
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            />
          </div>
          
          <button
            type="button"
            onClick={() => setIsListening(!isListening)}
            className="p-3 rounded-lg border transition-colors"
            style={{
              backgroundColor: isListening ? currentTheme.colors.error + '20' : currentTheme.colors.surface + '40',
              borderColor: currentTheme.colors.border,
              color: isListening ? currentTheme.colors.error : currentTheme.colors.textSecondary
            }}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-3 rounded-lg transition-colors disabled:opacity-50"
            style={{
              backgroundColor: !inputValue.trim() 
                ? currentTheme.colors.textSecondary + '60'
                : currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        <div className="mt-2 text-xs" style={{ color: currentTheme.colors.textSecondary }}>
          Press Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};