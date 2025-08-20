import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MessageCircle, 
  Send, 
  X, 
  Brain, 
  Zap, 
  Mic, 
  MicOff, 
  Paperclip, 
  MoreVertical,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Sparkles,
  Settings,
  Download,
  Share,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Image,
  FileText,
  Code,
  BarChart3,
  Lightbulb,
  Rocket,
  Shield,
  Star
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  typing?: boolean;
  attachments?: string[];
  reactions?: { type: string; count: number }[];
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  agentContext?: any;
  isIntegrated?: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ 
  isOpen, 
  onClose, 
  agentContext,
  isIntegrated = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: agentContext 
        ? `Hello! I'm ${agentContext.name}, your ${agentContext.role}. I specialize in ${agentContext.specialties.join(', ')}. How can I assist you with ${agentContext.department.toLowerCase()} matters today?`
        : "Hello! I'm Sarah, your advanced AI assistant. I can help you with system monitoring, data analysis, model optimization, code generation, and much more. What would you like to explore today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { currentTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest('.overflow-y-auto');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai') {
        scrollToBottom();
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const playSound = (type: 'send' | 'receive' | 'notification') => {
    if (!soundEnabled) return;
    console.log(`Playing ${type} sound`);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!inputValue.trim()) return;

    playSound('send');

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
      // Call your actual backend API
      const response = await fetch('http://147.93.102.165:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          agent_role: 'general',
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        reactions: [
          { type: '👍', count: 0 },
          { type: '❤️', count: 0 },
          { type: '🚀', count: 0 }
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      playSound('receive');

    } catch (error) {
      console.error('Failed to get response:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error connecting to the AI service. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      playSound('receive');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    playSound('notification');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    playSound('notification');
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const exportChat = () => {
    const chatData = JSON.stringify(messages, null, 2);
    const blob = new Blob([chatData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sarah-chat-export.json';
    a.click();
    playSound('notification');
  };

  const shareChat = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sarah AI Chat',
        text: 'Check out my conversation with Sarah AI!',
        url: window.location.href
      });
    }
    playSound('notification');
  };

  const addReaction = (messageId: string, reactionType: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.reactions) {
        return {
          ...msg,
          reactions: msg.reactions.map(reaction => 
            reaction.type === reactionType 
              ? { ...reaction, count: reaction.count + 1 }
              : reaction
          )
        };
      }
      return msg;
    }));
    playSound('notification');
  };

  if (!isOpen) return null;

  if (isIntegrated) {
    return (
      <div className="h-full flex flex-col bg-transparent relative">
        {/* Static Stars Background for Sidebar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute" style={{ left: '15%', top: '12%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.6 }}></div>
          <div className="absolute" style={{ left: '25%', top: '28%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.4 }}></div>
          <div className="absolute" style={{ left: '35%', top: '45%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.7 }}></div>
          <div className="absolute" style={{ left: '45%', top: '62%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.3 }}></div>
          <div className="absolute" style={{ left: '55%', top: '78%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.5 }}></div>
          <div className="absolute" style={{ left: '65%', top: '15%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.6 }}></div>
          <div className="absolute" style={{ left: '75%', top: '35%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.4 }}></div>
          <div className="absolute" style={{ left: '85%', top: '52%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.7 }}></div>
          <div className="absolute" style={{ left: '20%', top: '68%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.3 }}></div>
          <div className="absolute" style={{ left: '30%', top: '85%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.5 }}></div>
          <div className="absolute" style={{ left: '70%', top: '8%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.6 }}></div>
          <div className="absolute" style={{ left: '80%', top: '25%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.4 }}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b relative z-10"
             style={{ borderColor: currentTheme.colors.border }}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="w-6 h-6" 
                     style={{ color: currentTheme.colors.primary }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                   style={{ backgroundColor: currentTheme.colors.secondary }}></div>
            </div>
            <div>
              <h3 className="font-bold" style={{ color: currentTheme.colors.text }}>
                {agentContext ? `${agentContext.name}` : 'Sarah AI'}
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" 
                     style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                <span className="text-xs" style={{ color: currentTheme.colors.secondary }}>
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar relative z-10">
          {/* Static Stars Background for Chat */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute" style={{ left: '10%', top: '8%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.25 }}></div>
            <div className="absolute" style={{ left: '20%', top: '22%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.15 }}></div>
            <div className="absolute" style={{ left: '30%', top: '38%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.35 }}></div>
            <div className="absolute" style={{ left: '40%', top: '55%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.20 }}></div>
            <div className="absolute" style={{ left: '50%', top: '72%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.30 }}></div>
            <div className="absolute" style={{ left: '60%', top: '18%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.25 }}></div>
            <div className="absolute" style={{ left: '70%', top: '42%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.15 }}></div>
            <div className="absolute" style={{ left: '80%', top: '65%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.35 }}></div>
            <div className="absolute" style={{ left: '90%', top: '12%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.20 }}></div>
            <div className="absolute" style={{ left: '15%', top: '48%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.30 }}></div>
            <div className="absolute" style={{ left: '25%', top: '78%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.25 }}></div>
            <div className="absolute" style={{ left: '35%', top: '5%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.15 }}></div>
            <div className="absolute" style={{ left: '45%', top: '32%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.35 }}></div>
            <div className="absolute" style={{ left: '55%', top: '58%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.20 }}></div>
            <div className="absolute" style={{ left: '75%', top: '85%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.30 }}></div>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
            >
              <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className="p-3 sm:p-4 rounded-xl backdrop-blur-md border transition-all duration-300"
                  style={{
                    background: message.sender === 'user' 
                      ? `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`
                      : currentTheme.colors.surface + '40',
                    borderColor: message.sender === 'user' 
                      ? currentTheme.colors.primary + '40'
                      : currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                >
                  <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start relative z-10">
              <div className="border rounded-xl p-4 backdrop-blur-md"
                   style={{
                     backgroundColor: currentTheme.colors.surface + '40',
                     borderColor: currentTheme.colors.border
                   }}>
                <div className="flex items-center space-x-3">
                  <Brain className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
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
        <div className="p-4 sm:p-6 border-t relative z-10" style={{ borderColor: currentTheme.colors.border }}>
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 border rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none transition-all duration-200 text-sm sm:text-base"
              style={{
                backgroundColor: currentTheme.colors.surface + '40',
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 sm:p-3 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: !inputValue.trim() 
                  ? `linear-gradient(135deg, ${currentTheme.colors.textSecondary}60, ${currentTheme.colors.textSecondary}60)`
                  : `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                color: currentTheme.colors.text
              }}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={(e) => {
          if (e.target.files) {
            playSound('notification');
          }
        }}
      />
      
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ${isMaximized ? 'p-0' : ''}`}>
        <div 
          className={`backdrop-blur-xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-500 relative rounded-tr-2xl rounded-br-2xl ${
          isMaximized 
            ? 'w-full h-full rounded-none' 
            : 'rounded-xl sm:rounded-2xl hover:scale-[1.01]'
        }`}
        style={{
          width: isMaximized ? '100%' : '400px',
          height: isMaximized ? '100%' : '600px',
          minWidth: '300px',
          minHeight: '400px',
          maxWidth: isMaximized ? '100%' : '800px',
          maxHeight: isMaximized ? '100%' : '800px',
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
          borderColor: currentTheme.colors.border,
          boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
        }}>
          {/* Static Stars Background for Sidebar */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute" style={{ left: '15%', top: '12%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.6 }}></div>
            <div className="absolute" style={{ left: '25%', top: '28%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.4 }}></div>
            <div className="absolute" style={{ left: '35%', top: '45%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.7 }}></div>
            <div className="absolute" style={{ left: '45%', top: '62%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.3 }}></div>
            <div className="absolute" style={{ left: '55%', top: '78%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.5 }}></div>
            <div className="absolute" style={{ left: '65%', top: '15%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.6 }}></div>
            <div className="absolute" style={{ left: '75%', top: '35%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.4 }}></div>
            <div className="absolute" style={{ left: '85%', top: '52%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.7 }}></div>
            <div className="absolute" style={{ left: '20%', top: '68%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.3 }}></div>
            <div className="absolute" style={{ left: '30%', top: '85%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.5 }}></div>
            <div className="absolute" style={{ left: '70%', top: '8%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.6 }}></div>
            <div className="absolute" style={{ left: '80%', top: '25%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.primary, opacity: 0.4 }}></div>
          </div>

          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 border-b backdrop-blur-md relative z-10"
               style={{
                 background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
                 borderColor: currentTheme.colors.border
               }}>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"
                     style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}></div>
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 relative z-10" 
                       style={{ color: currentTheme.colors.primary }} />
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                     style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                     style={{ backgroundColor: currentTheme.colors.secondary }}></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}>
                  {agentContext ? `${agentContext.name} - ${agentContext.role}` : 'Sarah AI Assistant'}
                </h2>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex items-center space-x-1" style={{ color: currentTheme.colors.secondary }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                    <span className="text-xs sm:text-sm font-medium" style={{ color: currentTheme.colors.secondary }}>
                      Online • {agentContext ? `${agentContext.department} Mode` : 'Advanced Mode'}
                    </span>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full hidden sm:block"
                       style={{ 
                         color: currentTheme.colors.textSecondary,
                         backgroundColor: currentTheme.colors.surface + '40'
                       }}>
                    {agentContext ? `${agentContext.level} Level` : 'Advanced Mode'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {soundEnabled ? 
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} /> : 
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
                }
              </button>
              
              <button
                onClick={exportChat}
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
              </button>
              
              <button
                onClick={shareChat}
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Share className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
              </button>
              
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {isMaximized ? 
                  <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} /> : 
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
                }
              </button>
              
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 border border-transparent rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.error + '20';
                  e.currentTarget.style.borderColor = currentTheme.colors.error + '30';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
              </button>
            </div>
          </div>

          {/* Enhanced Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar relative z-10">
            {/* Static Stars Background for Chat */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute" style={{ left: '10%', top: '8%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.25 }}></div>
              <div className="absolute" style={{ left: '20%', top: '22%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.15 }}></div>
              <div className="absolute" style={{ left: '30%', top: '38%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.35 }}></div>
              <div className="absolute" style={{ left: '40%', top: '55%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.20 }}></div>
              <div className="absolute" style={{ left: '50%', top: '72%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.30 }}></div>
              <div className="absolute" style={{ left: '60%', top: '18%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.25 }}></div>
              <div className="absolute" style={{ left: '70%', top: '42%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.15 }}></div>
              <div className="absolute" style={{ left: '80%', top: '65%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.35 }}></div>
              <div className="absolute" style={{ left: '90%', top: '12%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.20 }}></div>
              <div className="absolute" style={{ left: '15%', top: '48%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.30 }}></div>
              <div className="absolute" style={{ left: '25%', top: '78%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.25 }}></div>
              <div className="absolute" style={{ left: '35%', top: '5%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.15 }}></div>
              <div className="absolute" style={{ left: '45%', top: '32%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.35 }}></div>
              <div className="absolute" style={{ left: '55%', top: '58%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.20 }}></div>
              <div className="absolute" style={{ left: '75%', top: '85%', width: '2px', height: '2px', backgroundColor: currentTheme.colors.secondary, opacity: 0.30 }}></div>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group relative z-10`}
              >
                <div className={`max-w-[90%] sm:max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.sender === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <div className="relative">
                        {agentContext ? (
                          <span className="text-lg">{agentContext.avatar}</span>
                        ) : (
                          <Brain className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.primary }} />
                        )}
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>
                        {agentContext ? agentContext.name : 'Sarah AI'}
                      </span>
                      <span className="text-xs" style={{ color: currentTheme.colors.textSecondary + '80' }}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`
                      relative p-3 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group-hover:shadow-xl
                      ${message.sender === 'user'
                        ? 'ml-auto'
                        : ''
                      }
                    `}
                    style={{
                      background: message.sender === 'user' 
                        ? `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`
                        : currentTheme.colors.surface + '40',
                      borderColor: message.sender === 'user' 
                        ? currentTheme.colors.primary + '40'
                        : currentTheme.colors.border,
                      color: currentTheme.colors.text
                    }}
                  >
                    <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"
                         style={{
                           background: message.sender === 'user' 
                             ? `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`
                             : `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`
                         }}></div>
                    
                    <div className="relative z-10">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: currentTheme.colors.text }}>{message.content}</p>
                      
                      {message.sender === 'ai' && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t space-y-2 sm:space-y-0"
                             style={{ borderColor: currentTheme.colors.border }}>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
                              style={{ backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                            </button>
                            <button
                              onClick={() => addReaction(message.id, '👍')}
                              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
                              style={{ backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                            </button>
                            <button
                              onClick={() => addReaction(message.id, '❤️')}
                              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
                              style={{ backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                            </button>
                            <button className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
                                    style={{ backgroundColor: 'transparent' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            {message.reactions && (
                              <div className="flex items-center space-x-1">
                                {message.reactions.map((reaction, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => addReaction(message.id, reaction.type)}
                                    className="flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded-full transition-all duration-200 hover:scale-110"
                                    style={{ backgroundColor: currentTheme.colors.surface + '20' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '20'}
                                  >
                                    <span className="text-xs sm:text-sm">{reaction.type}</span>
                                    {reaction.count > 0 && (
                                      <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>{reaction.count}</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" style={{ color: currentTheme.colors.accent }} />
                              <span className="font-medium text-xs" style={{ color: currentTheme.colors.accent }}>AI Generated</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start relative z-10">
                <div className="border rounded-xl sm:rounded-2xl p-3 sm:p-5 backdrop-blur-md transition-all duration-300"
                     style={{
                       backgroundColor: currentTheme.colors.surface + '40',
                       borderColor: currentTheme.colors.border
                     }}>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.primary }} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ backgroundColor: currentTheme.colors.accent }}></div>
                    </div>
                    <span className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>Sarah is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <div className="p-3 sm:p-6 border-t backdrop-blur-md relative z-10"
               style={{
                 background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`,
                 borderColor: currentTheme.colors.border
               }}>
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
              <div className="flex-1 relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Sarah anything..."
                  className="w-full border rounded-xl px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 
                           focus:outline-none transition-all duration-200"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '40',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    boxShadow: `0 4px 12px -4px ${currentTheme.shadows.primary}`
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
                    e.currentTarget.style.boxShadow = `0 8px 25px -8px ${currentTheme.shadows.primary}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.border;
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40';
                    e.currentTarget.style.boxShadow = `0 4px 12px -4px ${currentTheme.shadows.primary}`;
                  }}
                />
                <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    className="p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Image className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                  </button>
                </div>
              </div>
              
              <button
                type="button"
                onClick={toggleVoice}
                className="p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: isListening 
                    ? currentTheme.colors.error + '20'
                    : currentTheme.colors.surface + '40',
                  borderColor: isListening 
                    ? currentTheme.colors.error + '40'
                    : currentTheme.colors.border,
                  color: isListening 
                    ? currentTheme.colors.error
                    : currentTheme.colors.textSecondary,
                  boxShadow: isListening 
                    ? `0 8px 25px -8px ${currentTheme.colors.error}40`
                    : 'none'
                }}
              >
                {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-3 sm:p-4 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:scale-100
                         disabled:cursor-not-allowed backdrop-blur-sm relative overflow-hidden group"
                style={{
                  background: !inputValue.trim() 
                    ? `linear-gradient(135deg, ${currentTheme.colors.textSecondary}60, ${currentTheme.colors.textSecondary}60)`
                    : `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  color: currentTheme.colors.text,
                  boxShadow: !inputValue.trim() 
                    ? 'none'
                    : `0 8px 25px -8px ${currentTheme.shadows.primary}`
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}></div>
                <Send className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              </button>
            </form>
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs space-y-2 sm:space-y-0"
                 style={{ color: currentTheme.colors.textSecondary }}>
              <div className="flex items-center space-x-3 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <kbd className="px-2 py-1 rounded text-xs" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>Enter</kbd>
                  <span>to send</span>
                </div>
                <div className="flex items-center space-x-2 hidden sm:flex">
                  <kbd className="px-2 py-1 rounded text-xs" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>Shift</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 rounded text-xs" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>Enter</kbd>
                  <span>for new line</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
                  <span className="hidden sm:inline" style={{ color: currentTheme.colors.textSecondary }}>
                    {agentContext ? `${agentContext.department} mode active` : 'Code generation ready'}
                  </span>
                  <span className="sm:hidden" style={{ color: currentTheme.colors.textSecondary }}>
                    {agentContext ? agentContext.department : 'Code ready'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 hidden sm:flex">
                  <BarChart3 className="w-3 h-3" style={{ color: currentTheme.colors.secondary }} />
                  <span style={{ color: currentTheme.colors.textSecondary }}>
                    {agentContext ? `${agentContext.level} level access` : 'Analytics enabled'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" style={{ color: currentTheme.colors.accent }} />
                  <span className="font-medium text-xs" style={{ color: currentTheme.colors.accent }}>
                    {agentContext ? `${agentContext.name} AI` : 'Sarah AI v3.7.2'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};