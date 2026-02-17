
import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { sarahWebSocketService } from '../services/sarahWebSocketService';
import './AIChat.css';
import { 
  Send, 
  X, 
  Brain, 
  Zap, 
  Mic, 
  MicOff, 
  Paperclip, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Image, 
  Code, 
  BarChart3, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  Share
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

interface ChatHistory {
  id: string;
  title: string;
  preview?: string;
  messages: Message[];
  timestamp: Date;
  message_count?: number;
  started_at?: string;
  last_message_at?: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  agentContext?: any;
  isIntegrated?: boolean;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  onNewChatTrigger?: number;
}

export const AIChat: React.FC<AIChatProps> = ({ 
  isOpen, 
  onClose, 
  agentContext, 
  isIntegrated = false,
  onNewChatTrigger
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // State for logic compatibility
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [thinkingDetails, setThinkingDetails] = useState<string[]>([]);
  const [showThinkingDetails, setShowThinkingDetails] = useState(false);
  
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  
  const streamingMessageIdRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const chunkQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);
  const prevNewChatTrigger = useRef(onNewChatTrigger);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isNearBottomRef = useRef(true);
  const SCROLL_THRESHOLD = 150;

  useEffect(() => {
    if (onNewChatTrigger !== undefined && onNewChatTrigger !== prevNewChatTrigger.current) {
      prevNewChatTrigger.current = onNewChatTrigger;
      handleNewChat();
    }
  }, [onNewChatTrigger]);

  const checkIfNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
  };
  
  const handleMessagesScroll = () => {
    isNearBottomRef.current = checkIfNearBottom();
  };

  const scrollToBottom = (force = false) => {
    if (!force && !isNearBottomRef.current) return;
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  };

  const normalizeMarkdown = (content: string): string => {
    if (!content) return '';
    const codeBlocks: string[] = [];
    let normalized = content.replace(/(```[\s\S]*?```)/g, (match) => {
      codeBlocks.push(match);
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });
    
    normalized = normalized
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\n')
      .replace(/\\t/g, '\t');
    
    normalized = normalized.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
      return codeBlocks[parseInt(index)];
    });
    return normalized;
  };

  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom(), 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  const processChunkQueue = () => {
    if (chunkQueueRef.current.length === 0) {
      isProcessingQueueRef.current = false;
      return;
    }
    let chunk = chunkQueueRef.current.shift()!;
    const currentStreamingId = streamingMessageIdRef.current;
    if (typeof chunk === 'string') {
      chunk = chunk.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
    }
    flushSync(() => {
      setMessages(prev => prev.map(m => 
        m.id === currentStreamingId ? { ...m, content: m.content + chunk } : m
      ));
    });
    scrollToBottom();
    setTimeout(() => processChunkQueue(), 10);
  };

  useEffect(() => {
    if (user && isOpen) {
      if (!sarahWebSocketService.isSocketConnected()) {
        sarahWebSocketService.connect().catch(console.error);
      }
      const unsubscribe = sarahWebSocketService.onMessage((messageText) => {
        try {
          const parsed = JSON.parse(messageText);
          const messageType = parsed.type || parsed.event;
          
          if (messageType === 'thinking') {
            setIsTyping(parsed.status === 'start');
          } else if (messageType === 'delta' || messageType === 'content') {
            setIsTyping(false);
            setThinkingDetails([]);
            const content = parsed.content || parsed.text || '';
            setMessages(prev => {
              const existing = prev.find(m => m.id === streamingMessageIdRef.current);
              if (existing) {
                return prev.map(m => m.id === streamingMessageIdRef.current ? { ...m, content: m.content + content } : m);
              } else {
                const newId = 'streaming_' + Date.now();
                streamingMessageIdRef.current = newId;
                return [...prev, { id: newId, content, sender: 'ai', timestamp: new Date(), suggestions: [], reactions: [] }];
              }
            });
          } else if (messageType === 'response') {
            if (parsed.status === 'start') {
              setIsTyping(false);
              setThinkingDetails([]);
              streamingMessageIdRef.current = null; 
              chunkQueueRef.current = []; 
              isProcessingQueueRef.current = false;
            } else if (parsed.status === 'stream') {
              let content = parsed.data?.text || '';
              if (!streamingMessageIdRef.current) {
                const newMessageId = 'streaming_' + Date.now();
                streamingMessageIdRef.current = newMessageId;
                flushSync(() => setMessages(prev => [...prev, { id: newMessageId, content: '', sender: 'ai', timestamp: new Date(), suggestions: [], reactions: [] }]));
              }
              chunkQueueRef.current.push(content);
              if (!isProcessingQueueRef.current) {
                isProcessingQueueRef.current = true;
                processChunkQueue();
              }
            } else if (parsed.status === 'end') {
               setTimeout(() => { streamingMessageIdRef.current = null; setIsTyping(false); }, 500);
            }
          }
        } catch (e) { console.error(e); }
      });
      return () => { unsubscribe(); sarahWebSocketService.disconnect(); };
    }
  }, [user, isOpen]);

  const loadConversations = async () => { setConversations([]); };

  const handleNewChat = async () => {
    setConversationId(null);
    conversationIdRef.current = null;
    streamingMessageIdRef.current = null;
    setMessages([]);
    setIsTyping(false);
    setThinkingDetails([]);
    try {
        const session = await sarahWebSocketService.startNewConversation();
        setConversationId(session.conversation_id);
    } catch(e) { console.error(e); }
  };

  const playSound = (type: string) => { if(soundEnabled) console.log(type); };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!inputValue.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), content: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const msg = inputValue;
    setInputValue('');
    setIsTyping(true);
    isNearBottomRef.current = true;
    scrollToBottom(true);
    try {
      sarahWebSocketService.sendMessage(msg);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const toggleVoice = () => setIsListening(!isListening);
  const copyMessage = (content: string) => navigator.clipboard.writeText(content);
  const handleFileUpload = () => fileInputRef.current?.click();
  const exportChat = () => {};
  const shareChat = () => {};
  const addReaction = (id: string, type: string) => {};

  if (!isOpen) return null;

  // ------------------------------------------------------------------
  // INTEGRATED VIEW 
  // Optimized: Height reduced to 95% to lift from bottom, scrollbar thin.
  // ------------------------------------------------------------------
  if (isIntegrated) {
    return (
      <>
        {/* Inject styles for thin scrollbar locally */}
        <style>
          {`
            .slim-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .slim-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .slim-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(156, 163, 175, 0.5);
              border-radius: 20px;
            }
          `}
        </style>
        
        {/* Main Container - h-[95%] creates the "shorter window" effect */}
        <div className="h-[100%] w-full flex flex-col min-w-0 min-h-0 bg-transparent overflow-hidden">
          
          {/* Messages Area - Added slim-scrollbar class */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className="flex-1 overflow-y-auto px-4 pb-4 pt-0 space-y-4 slim-scrollbar min-h-0" 
            style={{ 
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              scrollPaddingTop: '1rem' 
            }}
          >
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4 opacity-60">
                <Brain className="w-12 h-12 mb-4" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-base font-semibold mb-2" style={{ color: currentTheme.colors.text }}>Start a conversation</h3>
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>Ask me anything about your business.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
                <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.sender === 'user' ? (
                    <div className="p-3 sm:p-4 rounded-xl backdrop-blur-md border"
                         style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`, borderColor: currentTheme.colors.primary + '40', color: currentTheme.colors.text }}>
                      <div className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                          <span className="text-xs font-bold" style={{ color: currentTheme.colors.text }}>Amesie AI</span>
                      </div>
                      <div className="prose prose-sm max-w-none text-sm" style={{ color: currentTheme.colors.text }}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({...props}) => <p className="my-2" {...props} />,
                            a: ({...props}) => <a className="text-blue-400 underline" target="_blank" {...props} />,
                            code: ({className, children, ...props}: any) => {
                              const match = /language-(\w+)/.exec(className || '');
                              const isBlock = match || String(children).includes('\n');
                              if (isBlock) {
                                  return (
                                      <div className="my-2 rounded-md overflow-hidden bg-black/20">
                                          <div className="flex justify-between px-3 py-1 bg-black/30 border-b border-white/5">
                                              <span className="text-[10px] text-gray-400">{match?.[1] || 'text'}</span>
                                              <button onClick={() => navigator.clipboard.writeText(String(children))} className="text-[10px] text-gray-400 hover:text-white"><Copy className="w-3 h-3"/></button>
                                          </div>
                                          <SyntaxHighlighter style={oneDark} language={match?.[1] || 'text'} PreTag="div" customStyle={{ margin: 0, background: 'transparent', fontSize: '12px' }}>
                                              {String(children).replace(/\n$/, '')}
                                          </SyntaxHighlighter>
                                      </div>
                                  );
                              }
                              return <code className="px-1 py-0.5 rounded bg-white/10" {...props}>{children}</code>;
                            }
                          }}
                        >
                          {normalizeMarkdown(message.content)}
                        </ReactMarkdown>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => copyMessage(message.content)} className="p-1 hover:bg-white/10 rounded"><Copy className="w-3 h-3" style={{ color: currentTheme.colors.textSecondary }} /></button>
                          <button className="p-1 hover:bg-white/10 rounded"><ThumbsUp className="w-3 h-3" style={{ color: currentTheme.colors.textSecondary }} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                  <span className="text-xs text-gray-400">Thinking...</span>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t flex-shrink-0" style={{ borderColor: currentTheme.colors.border, backgroundColor: currentTheme.colors.surface }}>
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                  <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Amesie..."
                  className="w-full border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 transition-all"
                  style={{ backgroundColor: currentTheme.colors.surface + '60', borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}
                  />
                  <button type="button" onClick={handleFileUpload} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      <Paperclip className="w-4  h-4" />
                  </button>
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`, color: '#fff' }}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // ------------------------------------------------------------------
  // MODAL VIEW (Popup)
  // ------------------------------------------------------------------
  return (
    <>
      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={() => playSound('notification')} />
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${isMaximized ? 'p-0' : 'p-0 sm:p-4'}`}>
        <div className={`backdrop-blur-xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-500 relative ${isMaximized ? 'w-full h-full rounded-none' : 'w-full h-full sm:w-[400px] sm:h-[600px] sm:rounded-2xl'}`}
             style={{ background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`, borderColor: currentTheme.colors.border }}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: currentTheme.colors.border }}>
             <div className="flex items-center gap-3">
                <Brain className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
                <div>
                    <h2 className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>Amesie AI</h2>
                    <div className="flex items-center gap-1 text-xs text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online
                    </div>
                </div>
             </div>
             <div className="flex gap-1">
                <button onClick={() => setIsMaximized(!isMaximized)} className="p-2 hover:bg-white/10 rounded"><Maximize2 className="w-4 h-4" style={{ color: currentTheme.colors.text }} /></button>
                <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded"><X className="w-4 h-4" style={{ color: currentTheme.colors.text }} /></button>
             </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
             {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl ${message.sender === 'user' ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'}`}
                         style={{ color: currentTheme.colors.text }}>
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
             <form onSubmit={handleSendMessage} className="flex gap-2">
                <input ref={inputRef} value={inputValue} onChange={e => setInputValue(e.target.value)} className="flex-1 px-4 py-2 rounded-xl border bg-transparent focus:outline-none focus:ring-1 focus:ring-primary" 
                       style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }} placeholder="Message..." />
                <button type="submit" className="p-2 rounded-xl bg-primary text-white"><Send className="w-5 h-5" /></button>
             </form>
          </div>
        </div>
      </div>
    </>
  );
};