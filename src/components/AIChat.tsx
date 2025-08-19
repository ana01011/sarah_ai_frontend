import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Menu, 
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
  Star,
  Search,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  Check,
  Users,
  MessageCircle
} from 'lucide-react';
import { ChatHistory, ChatMessage } from '../types/User';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  typing?: boolean;
  suggestions?: string[];
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
      timestamp: new Date(),
      suggestions: [
        ...(agentContext ? [
          `📊 Show ${agentContext.department.toLowerCase()} metrics`,
          `💡 ${agentContext.specialties[0]} insights`,
          `🎯 ${agentContext.role} recommendations`,
          `📈 Department performance`
        ] : [
          "🚀 Show me system performance",
          "📊 Analyze model accuracy trends", 
          "⚡ Check GPU utilization",
          "🔧 Optimize training pipeline",
          "💡 Generate code snippets",
          "📈 Create performance reports"
        ])
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const { currentTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Save current chat to history after each message exchange
  useEffect(() => {
    if (messages.length > 1) { // Only save if there are actual conversations
      const currentChat: ChatHistory = {
        id: Date.now().toString(),
        title: messages.find(m => m.sender === 'user')?.content.slice(0, 50) + '...' || 'New Chat',
        messages: messages.map(msg => ({
          id: msg.id,
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp
        })),
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => {
        const filtered = prev.filter(chat => chat.id !== currentChat.id);
        const updated = [currentChat, ...filtered].slice(0, 50); // Keep only 50 most recent
        return updated;
      });
    }
  }, [messages]);

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
        content: data.response,  // Use actual response from backend
        sender: 'ai',
        timestamp: new Date(),
        suggestions: [],  // You can add suggestions if needed
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

  const handleSuggestionClick = (suggestion: string) => {
    const cleanSuggestion = suggestion.replace(/^[^\w\s]+\s*/, '');
    setInputValue(cleanSuggestion);
    inputRef.current?.focus();
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

  const loadChat = (chat: ChatHistory) => {
    const loadedMessages: Message[] = chat.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === 'user' ? 'user' : 'ai',
      timestamp: new Date(msg.timestamp),
      suggestions: msg.role === 'ai' ? [] : undefined,
      reactions: msg.role === 'ai' ? [
        { type: '👍', count: 0 },
        { type: '❤️', count: 0 },
        { type: '🚀', count: 0 }
      ] : undefined
    }));
    
    setMessages(loadedMessages);
    setIsSidebarOpen(false);
    playSound('notification');
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    playSound('notification');
  };

  const startNewChat = () => {
    setMessages([
      {
        id: '1',
        content: agentContext 
          ? `Hello! I'm ${agentContext.name}, your ${agentContext.role}. I specialize in ${agentContext.specialties.join(', ')}. How can I assist you with ${agentContext.department.toLowerCase()} matters today?`
          : "Hello! I'm Sarah, your advanced AI assistant. I can help you with system monitoring, data analysis, model optimization, code generation, and much more. What would you like to explore today?",
        sender: 'ai',
        timestamp: new Date(),
        suggestions: [
          ...(agentContext ? [
            `📊 Show ${agentContext.department.toLowerCase()} metrics`,
            `💡 ${agentContext.specialties[0]} insights`,
            `🎯 ${agentContext.role} recommendations`,
            `📈 Department performance`
          ] : [
            "🚀 Show me system performance",
            "📊 Analyze model accuracy trends", 
            "⚡ Check GPU utilization",
            "🔧 Optimize training pipeline",
            "💡 Generate code snippets",
            "📈 Create performance reports"
          ])
        ]
      }
    ]);
    setIsSidebarOpen(false);
    playSound('notification');
  };

  const startEditingTitle = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitleId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveEditedTitle = (chatId: string) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: editingTitle.trim() || chat.title }
        : chat
    ));
    setEditingTitleId(null);
    setEditingTitle('');
    playSound('notification');
  };

  const cancelEditingTitle = () => {
    setEditingTitleId(null);
    setEditingTitle('');
  };

  const filteredChatHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) return null;

  if (isIntegrated) {
    return (
      <div className="h-full flex relative">
        {/* Chat History Sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed top-[80px] left-0 w-80 h-[calc(100vh-80px)] z-[10000] backdrop-blur-xl border-r overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
              borderColor: currentTheme.colors.border,
              boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
            }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-2xl animate-pulse opacity-30"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <div 
                className="absolute top-20 -right-10 w-28 h-28 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000 opacity-25"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              />
              <div 
                className="absolute bottom-10 left-10 w-24 h-24 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-2000 opacity-20"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
              
              {/* Geometric Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, ${currentTheme.colors.primary} 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }}
              />
            </div>

            {/* Header */}
            <div className="relative z-10 p-4 border-b" style={{ borderColor: currentTheme.colors.border }}>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: currentTheme.colors.textSecondary }} />
                </button>
                <h3 className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
                  Chat History
                </h3>
                <button
                  onClick={startNewChat}
                  className="p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                    color: currentTheme.id === 'light' ? '#ffffff' : currentTheme.colors.text,
                    boxShadow: `0 8px 25px -8px ${currentTheme.shadows.primary}`
                  }}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    fontSize: '16px'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${currentTheme.colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.border;
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredChatHistory.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" 
                                style={{ color: currentTheme.colors.textSecondary }} />
                  <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {searchTerm ? 'No chats found' : 'No chat history yet'}
                  </p>
                </div>
              ) : (
                filteredChatHistory.map((chat, index) => (
                  <div
                    key={chat.id}
                    onClick={() => loadChat(chat)}
                    className="group relative p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer backdrop-blur-sm"
                    style={{
                      backgroundColor: currentTheme.colors.surface + '40',
                      borderColor: currentTheme.colors.border,
                      animationDelay: `${index * 50}ms`,
                      boxShadow: `0 4px 12px -4px ${currentTheme.shadows.primary}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
                      e.currentTarget.style.borderColor = currentTheme.colors.primary + '40';
                      e.currentTarget.style.boxShadow = `0 8px 25px -8px ${currentTheme.shadows.primary}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40';
                      e.currentTarget.style.borderColor = currentTheme.colors.border;
                      e.currentTarget.style.boxShadow = `0 4px 12px -4px ${currentTheme.shadows.primary}`;
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingTitleId === chat.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditedTitle(chat.id);
                                if (e.key === 'Escape') cancelEditingTitle();
                              }}
                              className="flex-1 px-2 py-1 text-sm rounded border"
                              style={{
                                backgroundColor: currentTheme.colors.background,
                                borderColor: currentTheme.colors.border,
                                color: currentTheme.colors.text,
                                fontSize: '16px'
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => saveEditedTitle(chat.id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                            >
                              <Check className="w-3 h-3" style={{ color: currentTheme.colors.success }} />
                            </button>
                            <button
                              onClick={cancelEditingTitle}
                              className="p-1 hover:bg-white/10 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                            >
                              <X className="w-3 h-3" style={{ color: currentTheme.colors.error }} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-medium text-sm truncate mb-1" style={{ color: currentTheme.colors.text }}>
                              {chat.title}
                            </h4>
                            <p className="text-xs truncate opacity-70" style={{ color: currentTheme.colors.textSecondary }}>
                              {chat.messages[chat.messages.length - 1]?.content || 'No messages'}
                            </p>
                            <p className="text-xs mt-1 opacity-50" style={{ color: currentTheme.colors.textSecondary }}>
                              {new Date(chat.timestamp).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>
                      
                      {editingTitleId !== chat.id && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => startEditingTitle(chat.id, chat.title, e)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 min-w-[32px] min-h-[32px] flex items-center justify-center"
                          >
                            <Edit3 className="w-3 h-3" style={{ color: currentTheme.colors.textSecondary }} />
                          </button>
                          <button
                            onClick={(e) => deleteChat(chat.id, e)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 min-w-[32px] min-h-[32px] flex items-center justify-center"
                          >
                            <Trash2 className="w-3 h-3" style={{ color: currentTheme.colors.error }} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Stats */}
            <div className="relative z-10 p-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
              <div className="flex justify-between text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                <span>{chatHistory.length} chats</span>
                <span>{chatHistory.reduce((acc, chat) => acc + chat.messages.length, 0)} messages</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-transparent">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b"
               style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Menu 
                  className="w-5 h-5" 
                  style={{ color: isSidebarOpen ? currentTheme.colors.primary : currentTheme.colors.textSecondary }}
                />
              </button>
              <div className="relative">
                <Brain className="w-6 h-6 animate-pulse" 
                       style={{ color: currentTheme.colors.primary }} />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                     style={{ backgroundColor: currentTheme.colors.secondary }}></div>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: currentTheme.colors.text }}>
                  {agentContext ? `${agentContext.name}` : 'Sarah AI'}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" 
                       style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                  <span className="text-xs" style={{ color: currentTheme.colors.secondary }}>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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
                  
                  {message.suggestions && (
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs border rounded-full transition-all duration-200 hover:scale-105 min-h-[32px]"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.textSecondary
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="border rounded-xl p-4 backdrop-blur-md"
                     style={{
                       backgroundColor: currentTheme.colors.surface + '40',
                       borderColor: currentTheme.colors.border
                     }}>
                  <div className="flex items-center space-x-3">
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
          <div className="p-4 sm:p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
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
                  color: currentTheme.colors.text,
                  fontSize: '16px'
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 sm:p-3 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
          className={`backdrop-blur-xl border shadow-2xl transition-all duration-300 overflow-hidden ${
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
          }}
        >
          {/* Beautiful Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute -top-10 -left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-2xl animate-pulse opacity-30"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <div 
              className="absolute top-20 -right-10 w-28 h-28 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000 opacity-25"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            />
            <div 
              className="absolute bottom-10 left-10 w-24 h-24 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-2000 opacity-20"
              style={{ backgroundColor: currentTheme.colors.accent }}
            />
            
            {/* Geometric Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${currentTheme.colors.primary} 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            />
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
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse relative z-10" 
                       style={{ color: currentTheme.colors.primary }} />
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-ping"
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
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
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
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
              </button>
              
              <button
                onClick={shareChat}
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Share className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
              </button>
              
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                className="p-1.5 sm:p-2 border border-transparent rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
              >
                <div className={`max-w-[90%] sm:max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.sender === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <div className="relative">
                        {agentContext ? (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                               style={{ 
                                 backgroundColor: currentTheme.colors.primary + '20',
                                 color: currentTheme.colors.primary 
                               }}>
                            {agentContext.name.charAt(0)}
                          </div>
                        ) : (
                          <Brain className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                        )}
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                             style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                      </div>
                      <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
                        {agentContext ? agentContext.name : 'Sarah'}
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
                              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group/btn min-w-[32px] min-h-[32px] flex items-center justify-center"
                              style={{ backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                            </button>
                            <button
                              onClick={() => addReaction(message.id, '👍')}
                              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group/btn min-w-[32px] min-h-[32px] flex items-center justify-center"
                              style={{ backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                            </button>
                            <button
                              onClick={() => addReaction(message.id, '❤️')}
                              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group/btn min-w-[32px] min-h-[32px] flex items-center justify-center"
                              style={{ backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                            </button>
                            <button className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group/btn min-w-[32px] min-h-[32px] flex items-center justify-center"
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
                                    className="flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded-full transition-all duration-200 hover:scale-110 min-h-[28px]"
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
                              <Sparkles className="w-3 h-3 animate-pulse" style={{ color: currentTheme.colors.accent }} />
                              <span className="text-xs font-medium" style={{ color: currentTheme.colors.accent }}>AI Generated</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {message.suggestions && (
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-full 
                                   transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm min-h-[32px]"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.textSecondary,
                            boxShadow: `0 4px 12px -4px ${currentTheme.shadows.primary}`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${currentTheme.colors.surface}60, ${currentTheme.colors.surface}40)`;
                            e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
                            e.currentTarget.style.color = currentTheme.colors.text;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`;
                            e.currentTarget.style.borderColor = currentTheme.colors.border;
                            e.currentTarget.style.color = currentTheme.colors.textSecondary;
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="border rounded-xl sm:rounded-2xl p-3 sm:p-5 backdrop-blur-md transition-all duration-300"
                     style={{
                       backgroundColor: currentTheme.colors.surface + '40',
                       borderColor: currentTheme.colors.border
                     }}>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" style={{ color: currentTheme.colors.primary }} />
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
                    boxShadow: `0 4px 12px -4px ${currentTheme.shadows.primary}`,
                    fontSize: '16px'
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
                    className="p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block min-w-[32px] min-h-[32px] flex items-center justify-center"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block min-w-[32px] min-h-[32px] flex items-center justify-center"
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
                className="p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                         disabled:cursor-not-allowed backdrop-blur-sm relative overflow-hidden group min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              </div>
            </div>
          </div>

          {/* Flowing Wave Pattern */}
          <div className="absolute inset-0">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: currentTheme.colors.primary, stopOpacity: 0.1 }} />
                  <stop offset="50%" style={{ stopColor: currentTheme.colors.secondary, stopOpacity: 0.05 }} />
                  <stop offset="100%" style={{ stopColor: currentTheme.colors.accent, stopOpacity: 0.1 }} />
                </linearGradient>
                <linearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: currentTheme.colors.secondary, stopOpacity: 0.08 }} />
                  <stop offset="100%" style={{ stopColor: currentTheme.colors.primary, stopOpacity: 0.12 }} />
                </linearGradient>
              </defs>
              
              {/* Animated Wave Paths */}
              <path d="M0,100 Q100,50 200,100 T400,100 L400,0 L0,0 Z" fill="url(#wave1)">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;50,0;0,0"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </path>
              
              <path d="M0,200 Q150,150 300,200 T600,200 L600,0 L0,0 Z" fill="url(#wave2)">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;-30,0;0,0"
                  dur="15s"
                  repeatCount="indefinite"
                />
              </path>
              
              {/* Floating Particles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <circle
                  key={i}
                  cx={50 + (i * 30) % 350}
                  cy={100 + (i * 60) % 600}
                  r={2 + (i % 3)}
                  fill={currentTheme.colors.primary}
                  opacity="0.3"
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`0,0;${10 + (i % 20)},${-20 - (i % 30)};0,0`}
                    dur={`${8 + (i % 5)}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.1;0.6;0.1"
                    dur={`${6 + (i % 4)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </svg>
            
            {/* Gradient Mesh Overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, ${currentTheme.colors.primary}40 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, ${currentTheme.colors.secondary}30 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, ${currentTheme.colors.accent}20 0%, transparent 50%)
                `
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};