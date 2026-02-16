// import React, { useState, useEffect, useRef } from 'react';
// import { flushSync } from 'react-dom';
// import { useTheme } from '../contexts/ThemeContext';
// import { useAuth } from '../contexts/AuthContext';
// import { apiService } from '../services/api';
// import { sarahWebSocketService } from '../services/sarahWebSocketService';
// import './AIChat.css';
// import { 
//   MessageCircle, 
//   Send, 
//   X, 
//   Brain, 
//   Zap, 
//   Mic, 
//   MicOff, 
//   Paperclip, 
//   MoreVertical,
//   Copy,
//   ThumbsUp,
//   ThumbsDown,
//   RefreshCw,
//   Sparkles,
//   Settings,
//   Download,
//   Share,
//   Maximize2,
//   Minimize2,
//   Volume2,
//   VolumeX,
//   Image,
//   FileText,
//   Code,
//   BarChart3,
//   Lightbulb,
//   Rocket,
//   Shield,
//   Star,
//   Plus,
//   Trash2,
//   Edit3,
//   Check,
//   Menu,
//   ChevronDown,
//   ChevronUp,
//   Loader2,
//   Search,
//   Network
// } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';
// import 'katex/dist/katex.min.css';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// interface Message {
//   id: string;
//   content: string;
//   sender: 'user' | 'ai';
//   timestamp: Date;
//   typing?: boolean;
//   suggestions?: string[];
//   attachments?: string[];
//   reactions?: { type: string; count: number }[];
// }

// interface ChatHistory {
//   id: string;
//   title: string;
//   preview?: string;
//   messages: Message[];
//   timestamp: Date;
//   message_count?: number;
//   started_at?: string;
//   last_message_at?: string;
// }

// interface AIChatProps {
//   isOpen: boolean;
//   onClose: () => void;
//   agentContext?: any;
//   isIntegrated?: boolean;
//   // External control for integrated mode
//   showSidebar?: boolean;
//   onToggleSidebar?: () => void;
//   onNewChatTrigger?: number; // Increment to trigger new chat ill remove it later when well load from redis cache
// }

// export const AIChat: React.FC<AIChatProps> = ({ 
//   isOpen, 
//   onClose, 
//   agentContext,
//   isIntegrated = false,
//   showSidebar: externalShowSidebar,
//   onToggleSidebar,
//   onNewChatTrigger
// }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [soundEnabled, setSoundEnabled] = useState(true);
//   const [showChatHistoryInternal, setShowChatHistoryInternal] = useState(false);
  
//   // we use external control when provided, otherwise internal state will be purely external later
//   const showChatHistory = externalShowSidebar !== undefined ? externalShowSidebar : showChatHistoryInternal;
//   const toggleChatHistory = onToggleSidebar || (() => setShowChatHistoryInternal(prev => !prev));
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const [conversations, setConversations] = useState<ChatHistory[]>([]);
//   const [currentChatId, setCurrentChatId] = useState<string | null>(null);
//   const [editingChatId, setEditingChatId] = useState<string | null>(null);
//   const [editingTitle, setEditingTitle] = useState('');
//   const [thinkingDetails, setThinkingDetails] = useState<string[]>([]);
//   const [showThinkingDetails, setShowThinkingDetails] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const { currentTheme, setTheme } = useTheme();
//   const { user } = useAuth();
  
//   // Used ref for streaming message ID to avoid stale closure issues
//   const streamingMessageIdRef = useRef<string | null>(null);
//   const conversationIdRef = useRef<string | null>(null);
  
//   // Chunk queueing for smoother streaming with delay because ws stream is technically bloody fast 200ms 
//   const chunkQueueRef = useRef<string[]>([]);
//   const isProcessingQueueRef = useRef(false);
  
//   // Handles external new chat trigger
//   const prevNewChatTrigger = useRef(onNewChatTrigger);
//   useEffect(() => {
//     if (onNewChatTrigger !== undefined && onNewChatTrigger !== prevNewChatTrigger.current) {
//       prevNewChatTrigger.current = onNewChatTrigger;
//       handleNewChat();
//     }
//   }, [onNewChatTrigger]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Track if user is near bottom for smart auto-scroll
//   const isNearBottomRef = useRef(true);
//   const SCROLL_THRESHOLD = 150; // pixels from bottom to consider "near bottom"
  
//   // Check if user is near bottom of the messages container
//   const checkIfNearBottom = () => {
//     const container = messagesContainerRef.current;
//     if (!container) return true;
//     const { scrollTop, scrollHeight, clientHeight } = container;
//     return scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
//   };
  
//   // Handle scroll event to track user position
//   const handleMessagesScroll = () => {
//     isNearBottomRef.current = checkIfNearBottom();
//   };

//   const scrollToBottom = (force = false) => {
//     // Only auto-scroll if user is near bottom OR forced (e.g., user sent a message)
//     if (!force && !isNearBottomRef.current) return;
    
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ 
//         behavior: 'smooth', 
//         block: 'end',
//         inline: 'nearest'
//       });
//     }
//   };

//   // Normalized markdown content for proper parsing
//   const normalizeMarkdown = (content: string): string => {
//     if (!content) return '';
    
//     // First, kets protect code blocks from modification
//     const codeBlocks: string[] = [];
//     let normalized = content.replace(/(```[\s\S]*?```)/g, (match) => {
//       codeBlocks.push(match);
//       return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
//     });
    
//     // CRITICAL: Restore corrupted LaTeX commands
//     // The backend JSON parsing converts escape sequences to control chars:
//     // \n → LF (0x0A), \t → TAB (0x09), \r → CR (0x0D)
//     // This def corrupts LaTeX: \nu→LF+u, \times→TAB+imes, \rho→CR+ho
    
//     const TAB = String.fromCharCode(9);   // 0x09
//     const LF = String.fromCharCode(10);   // 0x0A  
//     const CR = String.fromCharCode(13);   // 0x0D
    
//     // Restore LaTeX commands corrupted by newline (LF or literal \n) this technically doesnt work everytime
//     normalized = normalized
//       .replace(new RegExp('(' + LF + '|\\\\n)u\\b', 'g'), '\\nu')
//       .replace(new RegExp('(' + LF + '|\\\\n)abla', 'g'), '\\nabla')
//       .replace(new RegExp('(' + LF + '|\\\\n)eq\\b', 'g'), '\\neq')
//       .replace(new RegExp('(' + LF + '|\\\\n)eg\\b', 'g'), '\\neg')
//       .replace(new RegExp('(' + LF + '|\\\\n)i\\b', 'g'), '\\ni')
//       .replace(new RegExp('(' + LF + '|\\\\n)ot\\b', 'g'), '\\not')
//       .replace(new RegExp('(' + LF + '|\\\\n)otin', 'g'), '\\notin')
//       .replace(new RegExp('(' + LF + '|\\\\n)less', 'g'), '\\nless')
//       .replace(new RegExp('(' + LF + '|\\\\n)leq', 'g'), '\\nleq')
//       .replace(new RegExp('(' + LF + '|\\\\n)geq', 'g'), '\\ngeq')
//       .replace(new RegExp('(' + LF + '|\\\\n)gtr', 'g'), '\\ngtr');
    
//     // Restore LaTeX commands corrupted by tab (TAB or literal \t)
//     normalized = normalized
//       .replace(new RegExp('(' + TAB + '|\\\\t)imes', 'g'), '\\times')
//       .replace(new RegExp('(' + TAB + '|\\\\t)ext\\{', 'g'), '\\text{')
//       .replace(new RegExp('(' + TAB + '|\\\\t)extbf\\{', 'g'), '\\textbf{')
//       .replace(new RegExp('(' + TAB + '|\\\\t)extit\\{', 'g'), '\\textit{')
//       .replace(new RegExp('(' + TAB + '|\\\\t)extrm\\{', 'g'), '\\textrm{')
//       .replace(new RegExp('(' + TAB + '|\\\\t)au\\b', 'g'), '\\tau')
//       .replace(new RegExp('(' + TAB + '|\\\\t)heta', 'g'), '\\theta')
//       .replace(new RegExp('(' + TAB + '|\\\\t)o\\b', 'g'), '\\to')
//       .replace(new RegExp('(' + TAB + '|\\\\t)op\\b', 'g'), '\\top')
//       .replace(new RegExp('(' + TAB + '|\\\\t)riangle', 'g'), '\\triangle')
//       .replace(new RegExp('(' + TAB + '|\\\\t)an\\b', 'g'), '\\tan')
//       .replace(new RegExp('(' + TAB + '|\\\\t)anh\\b', 'g'), '\\tanh');
    
//     // Restore LaTeX commands corrupted by carriage return (CR or literal \r)
//     normalized = normalized
//       .replace(new RegExp('(' + CR + '|\\\\r)ho\\b', 'g'), '\\rho')
//       .replace(new RegExp('(' + CR + '|\\\\r)ightarrow', 'g'), '\\rightarrow')
//       .replace(new RegExp('(' + CR + '|\\\\r)ight([^a-z]|$)', 'g'), '\\right$2')
//       .replace(new RegExp('(' + CR + '|\\\\r)angle', 'g'), '\\rangle')
//       .replace(new RegExp('(' + CR + '|\\\\r)ceil', 'g'), '\\rceil')
//       .replace(new RegExp('(' + CR + '|\\\\r)floor', 'g'), '\\rfloor');
    
//     // Convert remaining escape sequences to actual characters
//     // Using NEGATIVE LOOKAHEAD to NOT convert if followed by LaTeX suffixes this is a big headache
//     normalized = normalized
//       .replace(/\\n(?!(u\b|abla|eq\b|eg\b|i\b|ot\b|otin|less|leq|geq|gtr))/g, '\n')
//       .replace(/\\r(?!(ho\b|ight|angle|ceil|floor))/g, '\r')
//       .replace(/\\t(?!(imes|ext|au\b|heta|o\b|op\b|riangle|an\b|anh\b))/g, '\t')
//       .replace(/\r\n/g, '\n')
//       .replace(/\r/g, '\n');
    
//     // Convert LaTeX delimiters to standard KaTeX format
//     // Note: In JS replacement, $$ = literal $, so $$$$ = $$
//     // Display math: \[ ... \] → $$ ... $$
//     normalized = normalized.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, '\n\n$$$$$1$$$$\n\n');
//     // Inline math: \( ... \) → $ ... $  
//     normalized = normalized.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, ' $$$1$$ ');
    
//     // If still no newlines, must try to detect markdown patterns and insert newlines
//     if (!normalized.includes('\n')) {
//       normalized = normalized.replace(/\s+(#{1,6}\s+)/g, '\n\n$1');
//       normalized = normalized.replace(/\s+(---)\s+/g, '\n\n$1\n\n');
//       normalized = normalized.replace(/\s+([-*+]\s+\S)/g, '\n\n$1');
//       normalized = normalized.replace(/\s+(\d+\.\s+\S)/g, '\n\n$1');
//       normalized = normalized.replace(/\s+(\*?Example:)/gi, '\n\n$1');
//       normalized = normalized.replace(/\s+(__CODE_BLOCK_\d+__)/g, '\n\n$1\n');
//       normalized = normalized.replace(/\s+(\|[^|]+\|)/g, '\n$1');
//     }
    
//     // ALWAYS apply these fixes regardless of existing newlines despite it can be inconsistent
//     normalized = normalized.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
//     normalized = normalized.replace(/([^\n])(#{1,6}\s)/g, '$1\n\n$2');
//     normalized = normalized.replace(/([^\n\-\*\+])\n([-*+]\s)/g, '$1\n\n$2');
//     normalized = normalized.replace(/([^\n\d])\n(\d+\.\s)/g, '$1\n\n$2');
//     normalized = normalized.replace(/([^\n])\n(__CODE_BLOCK_)/g, '$1\n\n$2');
//     normalized = normalized.replace(/(__CODE_BLOCK_\d+__)\n([^\n])/g, '$1\n\n$2');
//     normalized = normalized.replace(/([^\n])\n(>\s)/g, '$1\n\n$2');
//     normalized = normalized.replace(/([^\n])\n(\|)/g, '$1\n\n$2');
//     normalized = normalized.replace(/(\|[^\n]+\|)\s+(\|)/g, '$1\n$2');
    
//     // Restore code blocks with normalized newlines inside them
//     normalized = normalized.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
//       let code = codeBlocks[parseInt(index)];
//       // IMPORTANT: Use negative lookahead to NOT corrupt LaTeX commands in code!
//       // \theta, \text, \tau etc. should stay as literal backslash sequences
//       // Only convert \n, \t, \r when they're actual escape sequences (not LaTeX)
//       code = code
//         // \n NOT followed by letters that form LaTeX commands
//         .replace(/\\n(?![a-zA-Z])/g, '\n')
//         // \t NOT followed by letters that form LaTeX commands  
//         .replace(/\\t(?![a-zA-Z])/g, '\t')
//         // \r NOT followed by letters that form LaTeX commands
//         .replace(/\\r(?![a-zA-Z])/g, '\r')
//         .replace(/\r\n/g, '\n')
//         .replace(/\r/g, '\n');
//       return code;
//     });
    
//     return normalized;
//   };


//   // Smooth scroll to bottom whenever messages change - only if user is near bottom
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       scrollToBottom();
//     }, 100);
//     return () => clearTimeout(timer);
//   }, [messages, isTyping]);

//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (user) {
//       loadConversations();
//     }
//   }, [user]);

//   // Process chunk queue with delay for smoother streaming, this i done intentionally if not ws streams are really fast as explained above
//   const processChunkQueue = () => {
//     if (chunkQueueRef.current.length === 0) {
//       isProcessingQueueRef.current = false;
//       return;
//     }
    
//     let chunk = chunkQueueRef.current.shift()!;
//     const currentStreamingId = streamingMessageIdRef.current;
    
//     // Ensure newlines are actual newlines (not escaped)
//     if (typeof chunk === 'string') {
//       chunk = chunk.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
//     }
    
//     // Update the message with the chunk
//     flushSync(() => {
//       setMessages(prev => prev.map(m => 
//         m.id === currentStreamingId
//           ? { ...m, content: m.content + chunk }
//           : m
//       ));
//     });
    
//     // Auto-scroll during streaming (only if user is near bottom)
//     scrollToBottom();
    
//     // Process next chunk after a small delay (10ms for smooth streaming, i low latency it will look fast but with many users fthe 10ms latency will automaticakky go around 20-25ms)
//     setTimeout(() => processChunkQueue(), 10);
//   };

//   // WebSocket connection for real time Amesie AI chat
//   useEffect(() => {
//     if (user && isOpen) {
//       console.log('🚀 Initializing Amesie AI WebSocket connection...');
      
//       // Only connect if not already connected
//       if (!sarahWebSocketService.isSocketConnected()) {
//         sarahWebSocketService.connect().catch(error => {
//           console.error('Failed to connect to Amesie AI:', error);
//         });
//       }

//       // Listen for incoming messages
//       const unsubscribe = sarahWebSocketService.onMessage((messageText) => {
//         console.log('📨 Received from Amesie AI:', messageText);
        
//         try {
//           // Parse the JSON message
//           const parsed = JSON.parse(messageText);
//           console.log('📦 Parsed message:', parsed);
          
//           // Handle both 'type' and 'event' fields for compatibility
//           const messageType = parsed.type || parsed.event;
          
//           if (messageType === 'ready') {
//             // Set conversation ID from ready message
//             if (parsed.conversation_id) {
//               const convId = parsed.conversation_id;
//               setConversationId(convId);
//               setCurrentChatId(convId);
//               conversationIdRef.current = convId;
//               console.log('✅ Conversation ready:', convId);
//             }
//           } else if (messageType === 'thinking') {
//             // Handle thinking indicator
//             if (parsed.status === 'start') {
//               setIsTyping(true);
//               console.log('🤔 AI is thinking...');
//             } else if (parsed.status === 'end') {
//               setIsTyping(false);
//               console.log('✅ Thinking complete');
//             }
//           } else if (messageType === 'delta' || messageType === 'content') {
//             // Streaming token accumulate content
//             // Clear typing indicator on first delta
//             setIsTyping(false);
//             setThinkingDetails([]);
            
//             const content = parsed.content || parsed.text || '';
            
//             setMessages(prev => {
//               // Check if we have a streaming message in progress
//               const existingStreamingMsg = prev.find(m => m.id === streamingMessageIdRef.current);
              
//               if (existingStreamingMsg) {
//                 // Update the existing streaming message
//                 return prev.map(m => 
//                   m.id === streamingMessageIdRef.current
//                     ? { ...m, content: m.content + content }
//                     : m
//                 );
//               } else {
//                 // Create new streaming message
//                 const newMessageId = 'streaming_' + Date.now().toString();
//                 streamingMessageIdRef.current = newMessageId;
                
//                 const aiMessage: Message = {
//                   id: newMessageId,
//                   content: content,
//                   sender: 'ai',
//                   timestamp: new Date(),
//                   suggestions: [],
//                   reactions: [
//                     { type: '👍', count: 0 },
//                     { type: '❤️', count: 0 },
//                     { type: '🚀', count: 0 }
//                   ]
//                 };
                
//                 return [...prev, aiMessage];
//               }
//             });
//           } else if (messageType === 'response') {
//             // Handle response streaming
//             if (parsed.status === 'start') {
//               // Response started - clear thinking indicator and prepare for new stream
//               console.log('📝 Response started - clearing old stream');
//               setIsTyping(false);
//               setThinkingDetails([]);
//               streamingMessageIdRef.current = null; // Clear any previous streaming message
//               chunkQueueRef.current = []; // Clear chunk queue
//               isProcessingQueueRef.current = false;
//             } else if (parsed.status === 'stream') {
//               // Streaming token - accumulate content with delay
//               let content = parsed.data?.text || '';
              
//               // Convert escaped newlines to actual newlines
//               content = content.replace(/\\n/g, '\n');
//               content = content.replace(/\\r/g, '\r');
//               content = content.replace(/\\t/g, '\t');
              
//               console.log('📨 Stream chunk:', JSON.stringify(content));
              
//               // If no streaming message exists, create it first
//               if (!streamingMessageIdRef.current) {
//                 const newMessageId = 'streaming_' + Date.now().toString();
//                 streamingMessageIdRef.current = newMessageId;
//                 console.log('🆕 Created streaming message ID:', newMessageId);
                
//                 // Create initial empty message
//                 flushSync(() => {
//                   setMessages(prev => [...prev, {
//                     id: newMessageId,
//                     content: '',
//                     sender: 'ai',
//                     timestamp: new Date(),
//                     suggestions: [],
//                     reactions: [
//                       { type: '👍', count: 0 },
//                       { type: '❤️', count: 0 },
//                       { type: '🚀', count: 0 }
//                     ]
//                   }]);
//                 });
//               }
              
//               // Add chunk to queue
//               chunkQueueRef.current.push(content);
              
//               // Start processing if not already running
//               if (!isProcessingQueueRef.current) {
//                 isProcessingQueueRef.current = true;
//                 processChunkQueue();
//               }
//             } else if (parsed.status === 'end') {
//               // Streaming complete - wait for queue to finish processing
//               console.log('✅ Response complete - waiting for queue to finish');
              
//               // Wait for queue to be empty before cleanup
//               const waitForQueueToFinish = () => {
//                 if (chunkQueueRef.current.length === 0 && !isProcessingQueueRef.current) {
//                   console.log('✅ Queue finished, cleaning up');
//                   streamingMessageIdRef.current = null;
//                   setIsTyping(false);
//                   setThinkingDetails([]);
//                   playSound('receive');
//                   loadConversations();
//                 } else {
//                   console.log(`⏳ Waiting for queue: ${chunkQueueRef.current.length} chunks remaining`);
//                   setTimeout(waitForQueueToFinish, 20);
//                 }
//               };
              
//               waitForQueueToFinish();
//             }
//           } else if (messageType === 'done') {
//             // Streaming complete (alternative format) wait for queue to finish
//             console.log('✅ Message streaming complete - waiting for queue to finish');
            
//             // Wait for queue to be empty before cleanup
//             const waitForQueueToFinish = () => {
//               if (chunkQueueRef.current.length === 0 && !isProcessingQueueRef.current) {
//                 console.log('✅ Queue finished, cleaning up');
//                 streamingMessageIdRef.current = null;
//                 setIsTyping(false);
//                 setThinkingDetails([]);
//                 playSound('receive');
//                 loadConversations();
//               } else {
//                 console.log(`⏳ Waiting for queue: ${chunkQueueRef.current.length} chunks remaining`);
//                 setTimeout(waitForQueueToFinish, 20);
//               }
//             };
            
//             waitForQueueToFinish();
//           }
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//           // Fallback: treat as plain text if not JSON
//           const aiMessage: Message = {
//             id: Date.now().toString(),
//             content: messageText,
//             sender: 'ai',
//             timestamp: new Date(),
//             suggestions: [],
//             reactions: [
//               { type: '👍', count: 0 },
//               { type: '❤️', count: 0 },
//               { type: '🚀', count: 0 }
//             ]
//           };
//           setMessages(prev => [...prev, aiMessage]);
//           setIsTyping(false);
//           playSound('receive');
//         }
//       });

//       // Cleanup on unmount
//       return () => {
//         console.log('🔌 Disconnecting Amesie AI WebSocket...');
//         unsubscribe();
//         sarahWebSocketService.disconnect();
//       };
//     }
//   }, [user, isOpen]);

//   // TODO: Replace with API call to load conversations from database this ill do later not now needed redis cache
//   const loadConversations = async () => {
//     try {
//       // Placeholder - will be replaced with API endpoint
//       // const response = await apiService.getConversations();
//       // const histories: ChatHistory[] = response.map(conv => ({...}));
//       console.log('📋 loadConversations: Ready for API integration');
//       setConversations([]);
//     } catch (error) {
//       console.error('Error loading conversations:', error);
//       setConversations([]);
//     }
//   };

//   // TODO: Replace with API call to load conversation messages
//   const loadConversation = async (conversationId: string) => {
//     try {
//       // Placeholder will be replaced with API endpoint
//       // const messages = await apiService.getConversationMessages(conversationId);
//       // setMessages(messages);
//       console.log('📋 loadConversation: Ready for API integration, convId:', conversationId);
      
//       setMessages([]);
//       setConversationId(conversationId);
//       setCurrentChatId(conversationId);
//       conversationIdRef.current = conversationId;
//       streamingMessageIdRef.current = null;
      
//       // Reconnect WebSocket for this conversation if needed
//       if (!sarahWebSocketService.isSocketConnected()) {
//         sarahWebSocketService.connect().catch(err => {
//           console.error('Failed to reconnect WebSocket:', err);
//         });
//       }
//     } catch (error) {
//       console.error('Error loading conversation:', error);
//     }
//   };

//   // TODO: Replace with API call to delete conversation
//   const deleteConversation = async (conversationId: string) => {
//     try {
//       // Placeholder - will be replaced with API endpoint 
//       // await apiService.deleteConversation(conversationId);
//       console.log('🗑️ deleteConversation: Ready for API integration, convId:', conversationId);
      
//       // Reload conversations list
//       loadConversations();
      
//       // If deleting current chat, start new
//       if (conversationId === currentChatId) {
//         handleNewChat();
//       }
//     } catch (error) {
//       console.error('Error deleting conversation:', error);
//     }
//   };

//   // TODO: Replace with API call to rename conversation
//   const renameConversation = async (conversationId: string, newTitle: string) => {
//     try {
//       // Placeholder - will be replaced with API endpoint. its my old endpoint just as a place hooldeer
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://147.93.102.165:8000/api/v1/chat/conversations/${conversationId}/rename`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ title: newTitle })
//       });

//       if (!response.ok) {
//         console.error('Failed to rename conversation');
//       } else {
//         console.log('✅ Conversation renamed via API');
//       }

//       // Reload conversations to reflect the change
//       loadConversations();
//       setEditingChatId(null);
//       setEditingTitle('');
//     } catch (error) {
//       console.error('Error renaming conversation:', error);
//     }
//   };

//   const handleNewChat = async () => {
//     try {
//       console.log('🆕 Creating new conversation...');
      
//       // Clear current state
//       setConversationId(null);
//       conversationIdRef.current = null;
//       streamingMessageIdRef.current = null;
//       setMessages([]);
//       setIsTyping(false);
//       setThinkingDetails([]);
      
//       // Create new session via WebSocket service (calls real API)
//       // This will disconnect old WebSocket and create new session
//       const session = await sarahWebSocketService.startNewConversation();
      
//       // Set the new conversation ID from the real API response
//       setConversationId(session.conversation_id);
//       setCurrentChatId(session.conversation_id);
//       conversationIdRef.current = session.conversation_id;
      
//       // Refresh conversations list (will pull from API when implemented)
//       loadConversations();
      
//       console.log('✅ New conversation created:', session.conversation_id);
//     } catch (error) {
//       console.error('❌ Error creating new chat:', error);
//     }
//   };

//   const playSound = (type: 'send' | 'receive' | 'notification') => {
//     if (!soundEnabled) return;
//     console.log(`Playing ${type} sound`);
//   };

//   // Theme name mapping from backend to frontend theme IDs thsi is for controlling the frontend straight from llm actions
//   const themeNameMapping: Record<string, string> = {
//     'Cyber Dark': 'dark',
//     'Pure Light': 'light',
//     'Neon Nights': 'neon',
//     'Deep Ocean': 'ocean',
//     'Simple Dark': 'simple-dark',
//     'Simple Light': 'simple-light',
//     'Tech Blue': 'tech-blue',
//     'Finance Green': 'finance-green',
//     'Marketing Purple': 'marketing-purple',
//     'Product Teal': 'product-teal',
//     'Developer Dark': 'developer-dark',
//     'AI Neural': 'ai-neural',
//     'Frontend Pink': 'frontend-pink',
//     'Backend Slate': 'backend-slate',
//     'Data Cyan': 'data-cyan'
//   };

//   const handleThemeChange = (themeName: string) => {
//     const themeId = themeNameMapping[themeName];
//     console.log("Theme change requested:", themeName);
//     console.log("Mapped to theme ID:", themeId);
//     if (themeId) {
//       setTheme(themeId);
//       console.log("Called setTheme with:", themeId);
//       playSound('notification');
//     }
//   };

//   const handleSendMessage = async (e?: React.FormEvent) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }

//     if (!inputValue.trim()) return;

//     playSound('send');

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: inputValue,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     const messageContent = inputValue;
//     setInputValue('');
//     setIsTyping(true);
    
//     // Force scroll to bottom when user sends a message and reset tracking
//     isNearBottomRef.current = true;
//     scrollToBottom(true);

//     // Simulate thinking process, later ill replace it with real thinkiking mode 
//     const thinkingSteps = [
//       'Analyzing your query...',
//       'Accessing knowledge base...',
//       'Processing context...',
//       'Formulating response...'
//     ];
    
//     setThinkingDetails([thinkingSteps[0]]);
//     let stepIndex = 0;
//     const thinkingInterval = setInterval(() => {
//       stepIndex++;
//       if (stepIndex < thinkingSteps.length) {
//         setThinkingDetails(prev => [...prev, thinkingSteps[stepIndex]]);
//       } else {
//         clearInterval(thinkingInterval);
//       }
//     }, 300);

//     try {
//       // Send message via WebSocket as plain text
//       console.log('📤 Sending message to Amesie AI via WebSocket:', messageContent);
//       sarahWebSocketService.sendMessage(messageContent);

//       // Store conversation ID from WebSocket service
//       const wsConversationId = sarahWebSocketService.getConversationId();
//       if (wsConversationId && !conversationId) {
//         setConversationId(wsConversationId);
//         setCurrentChatId(wsConversationId);
//       }

//     } catch (error) {
//       console.error('Failed to send message:', error);
//       clearInterval(thinkingInterval);
//       setIsTyping(false);
//       setThinkingDetails([]);
      
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: 'Sorry, I encountered an error sending your message. Please try again.',
//         sender: 'ai',
//         timestamp: new Date()
//       };
      
//       setMessages(prev => [...prev, errorMessage]);
//       playSound('receive');
//     }
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     const cleanSuggestion = suggestion.replace(/^[^\w\s]+\s*/, '');
//     setInputValue(cleanSuggestion);
//     inputRef.current?.focus();
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       e.stopPropagation();
//       handleSendMessage();
//     }
//   };

//   const toggleVoice = () => {
//     setIsListening(!isListening);
//     playSound('notification');
//   };

//   const copyMessage = (content: string) => {
//     navigator.clipboard.writeText(content);
//     playSound('notification');
//   };

//   const handleFileUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const exportChat = () => {
//     const chatData = JSON.stringify(messages, null, 2);
//     const blob = new Blob([chatData], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'sarah-chat-export.json';
//     a.click();
//     playSound('notification');
//   };

//   const shareChat = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'Amesie AI Chat',
//         text: 'Check out my conversation with Amesie AI!',
//         url: window.location.href
//       });
//     }
//     playSound('notification');
//   };

//   const addReaction = (messageId: string, reactionType: string) => {
//     setMessages(prev => prev.map(msg => {
//       if (msg.id === messageId && msg.reactions) {
//         return {
//           ...msg,
//           reactions: msg.reactions.map(reaction => 
//             reaction.type === reactionType 
//               ? { ...reaction, count: reaction.count + 1 }
//               : reaction
//           )
//         };
//       }
//       return msg;
//     }));
//     playSound('notification');
//   };

//   const handleEditTitle = (chatId: string, currentTitle: string) => {
//     setEditingChatId(chatId);
//     setEditingTitle(currentTitle);
//   };

//   const handleSaveTitle = async () => {
//     if (editingChatId && editingTitle.trim()) {
//       await renameConversation(editingChatId, editingTitle.trim());
//     } else {
//       setEditingChatId(null);
//       setEditingTitle('');
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingChatId(null);
//     setEditingTitle('');
//   };

//   if (!isOpen) return null;

//   if (isIntegrated) {
//     // Grouping conversations by date (Today, Yesterday, Previous 7 Days, Older) ignire it
//     const groupConversationsByDate = () => {
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
//       const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
//       const groups: { [key: string]: ChatHistory[] } = {
//         'Today': [],
//         'Yesterday': [],
//         'Previous 7 Days': [],
//         'Older': []
//       };
      
//       // Filter by search query
//       const filtered = searchQuery 
//         ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
//         : conversations;
      
//       filtered.forEach(conv => {
//         const convDate = new Date(conv.timestamp);
//         if (convDate >= today) {
//           groups['Today'].push(conv);
//         } else if (convDate >= yesterday) {
//           groups['Yesterday'].push(conv);
//         } else if (convDate >= weekAgo) {
//           groups['Previous 7 Days'].push(conv);
//         } else {
//           groups['Older'].push(conv);
//         }
//       });
      
//       return groups;
//     };

//     const groupedConversations = groupConversationsByDate();

//     return (
//       // <div className="h-full bg-transparent">
//       <div className="h-full w-full flex flex-col bg-transparent overflow-hidden">
//         {/* Backdrop overlay when sidebar is open */}
//         {showChatHistory && (
//           <div 
//             className="absolute inset-0 bg-black/30 z-10 transition-opacity duration-300"
//             onClick={toggleChatHistory}
//           />
//         )}
        
//         {/*Chat History Sidebar Overlay */}
//         <div 
//           className={`absolute left-0 top-0 h-full z-20 transition-transform duration-300 ease-out ${showChatHistory ? 'translate-x-0' : '-translate-x-full'}`}
//           style={{ width: '288px' }}
//         >
//           <div className="h-full w-full flex flex-col shadow-2xl" style={{ backgroundColor: currentTheme.colors.surface }}>
//             <div className="p-3 flex-shrink-0">
//               <button
//                 onClick={handleNewChat}
//                 className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
//                 style={{
//                   background: `linear-gradient(135deg, ${currentTheme.colors.primary}15, ${currentTheme.colors.secondary}15)`,
//                   borderColor: currentTheme.colors.border,
//                   color: currentTheme.colors.text
//                 }}
//               >
//                 <Plus className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
//                 <span className="font-medium">New chat</span>
//               </button>
//             </div>

//             <div className="px-3 pb-3 flex-shrink-0">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search conversations..."
//                   className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
//                   style={{
//                     backgroundColor: currentTheme.colors.background,
//                     borderColor: currentTheme.colors.border,
//                     color: currentTheme.colors.text,
//                     fontSize: '14px'
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
//               {conversations.length === 0 ? (
//                 <div className="text-center py-12 px-4">
//                   <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" 
//                                  style={{ color: currentTheme.colors.textSecondary }} />
//                   <p className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>
//                     No conversations yet
//                   </p>
//                   <p className="text-xs mt-1 opacity-70" style={{ color: currentTheme.colors.textSecondary }}>
//                     Start a new chat to begin
//                   </p>
//                 </div>
//               ) : (
//                 Object.entries(groupedConversations).map(([group, chats]) => (
//                   chats.length > 0 && (
//                     <div key={group} className="mb-4">
//                       <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wider" 
//                            style={{ color: currentTheme.colors.textSecondary }}>
//                         {group}
//                       </div>
//                       <div className="space-y-1">
//                         {chats.map((chat) => (
//                           <div
//                             key={chat.id}
//                             className={`group flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-150 ${currentChatId === chat.id ? '' : 'hover:bg-white/5'}`}
//                             style={{
//                               backgroundColor: currentChatId === chat.id 
//                                 ? currentTheme.colors.primary + '20' 
//                                 : 'transparent'
//                             }}
//                             onClick={() => loadConversation(chat.id)}
//                           >
//                             <MessageCircle className="w-4 h-4 mr-3 flex-shrink-0 opacity-60" 
//                                           style={{ color: currentChatId === chat.id ? currentTheme.colors.primary : currentTheme.colors.textSecondary }} />
                            
//                             <div className="flex-1 min-w-0">
//                               {editingChatId === chat.id ? (
//                                 <input
//                                   type="text"
//                                   value={editingTitle}
//                                   onChange={(e) => setEditingTitle(e.target.value)}
//                                   className="w-full px-2 py-1 text-sm rounded border bg-transparent"
//                                   style={{
//                                     borderColor: currentTheme.colors.primary,
//                                     color: currentTheme.colors.text,
//                                     fontSize: '14px'
//                                   }}
//                                   onKeyDown={(e) => {
//                                     if (e.key === 'Enter') handleSaveTitle();
//                                     if (e.key === 'Escape') handleCancelEdit();
//                                   }}
//                                   onClick={(e) => e.stopPropagation()}
//                                   autoFocus
//                                 />
//                               ) : (
//                                 <span className="text-sm truncate block" style={{ color: currentTheme.colors.text }}>
//                                   {chat.title}
//                                 </span>
//                               )}
//                             </div>
                            
//                             {editingChatId !== chat.id && (
//                               <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleEditTitle(chat.id, chat.title);
//                                   }}
//                                   className="p-1 rounded hover:bg-white/10 transition-colors"
//                                   style={{ color: currentTheme.colors.textSecondary }}
//                                 >
//                                   <Edit3 className="w-3.5 h-3.5" />
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     deleteConversation(chat.id);
//                                   }}
//                                   className="p-1 rounded hover:bg-white/10 transition-colors"
//                                   style={{ color: currentTheme.colors.error }}
//                                 >
//                                   <Trash2 className="w-3.5 h-3.5" />
//                                 </button>
//                               </div>
//                             )}
                            
//                             {editingChatId === chat.id && (
//                               <div className="flex items-center space-x-1">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleSaveTitle();
//                                   }}
//                                   className="p-1 rounded hover:bg-white/10 transition-colors"
//                                   style={{ color: currentTheme.colors.success }}
//                                 >
//                                   <Check className="w-3.5 h-3.5" />
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleCancelEdit();
//                                   }}
//                                   className="p-1 rounded hover:bg-white/10 transition-colors"
//                                   style={{ color: currentTheme.colors.error }}
//                                 >
//                                   <X className="w-3.5 h-3.5" />
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )
//                 ))
//               )}
//             </div>

//             {/* Sidebar Footer */}
//             <div className="p-3 border-t flex-shrink-0" style={{ borderColor: currentTheme.colors.border }}>
//               <div className="flex items-center space-x-3 px-2 py-2 rounded-lg" style={{ backgroundColor: currentTheme.colors.background + '50' }}>
//                 <div className="w-8 h-8 rounded-full flex items-center justify-center" 
//                      style={{ backgroundColor: currentTheme.colors.primary + '30' }}>
//                   <span className="text-sm font-semibold" style={{ color: currentTheme.colors.primary }}>
//                     {user?.name?.charAt(0) || 'U'}
//                   </span>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium truncate" style={{ color: currentTheme.colors.text }}>
//                     {user?.name || 'User'}
//                   </p>
//                   <p className="text-xs truncate" style={{ color: currentTheme.colors.textSecondary }}>
//                     {conversations.length} conversations
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Chat Area - Full width, sidebar overlays */}
//         <div className="h-full flex flex-col min-w-10 min-h-0">
//           {/* Integrated Mode Header */}
//           <div className="flexitems-center px-4 py-3 flex-shrink-0 backdrop-blur-sm"
//                style={{ 
//                  borderColor: currentTheme.colors.border,
//                  backgroundColor: currentTheme.colors.surface + '60'
//                }}>
//             <div className="flex items-center space-x-3">
//               {/* Sidebar Toggle */}
//               {/* <button
//                 onClick={toggleChatHistory}
//                 className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
//                 style={{ color: currentTheme.colors.textSecondary }}
//                 title={showChatHistory ? 'Close chat history' : 'Open chat history'}
//               >
//                 {showChatHistory ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//               </button> */}
              
//               {/* Branding */}

//               {/* <div className="flex items-center space-x-2">
//                 <Brain className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
//                 <div>
//                   <h2 className="text-sm font-bold" style={{ color: currentTheme.colors.text }}>
//                     AMESIE
//                   </h2>
//                   <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
//                     v3.7.3
//                   </p>
//                 </div>
//               </div> */}

//             </div>
//           </div>
          
//           {/* Messages Area - Scrollable - Optimized for 60fps */}
//           <div 
//             ref={messagesContainerRef}
//             onScroll={handleMessagesScroll}
//             className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-12" 
//             style={{ 
//               WebkitOverflowScrolling: 'touch',
//               overscrollBehavior: 'contain'
//             }}
//           >
//             {/* Empty State */}
//             {messages.length === 0 && !isTyping && (
//               <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
//                 <Brain className="w-16 h-16 mb-4 animate-pulse" style={{ color: currentTheme.colors.primary }} />
//                 <h3 className="text-lg font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
//                   Start a conversation
//                 </h3>
//                 <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
//                   Ask me anything about your business, analytics, or get help with tasks
//                 </p>
//               </div>
//             )}
            
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
//               >
//                 <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
//                   {/* User messages - keep boxed */}
//                   {message.sender === 'user' ? (
//                     <div
//                       className="p-3 sm:p-4 rounded-xl backdrop-blur-md border transition-all duration-300"
//                       style={{
//                         background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
//                         borderColor: currentTheme.colors.primary + '40',
//                         color: currentTheme.colors.text
//                       }}
//                     >
//                       <div className="prose prose-sm max-w-none" style={{ color: currentTheme.colors.text }}>
//                         <div className="whitespace-pre-wrap leading-relaxed">
//                           {message.content}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     /* AI messages - free flow, no box removed it now */
//                     <div className="space-y-3">
//                       {/* AI & Name */}
//                       <div className="flex items-center space-x-2 mb-2">
//                         <div className="relative">
//                           <Brain className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
//                           <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.success }}></div>
//                         </div>
//                         <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>Amesie AI</span>
//                         <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
//                           {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </span>
//                       </div>
                      
//                       {/* Message content with prose */}
//                       <div className="max-w-full prose prose-sm sm:prose-base prose-headings:text-current prose-p:text-current prose-li:text-current prose-strong:text-current prose-em:text-current" style={{ color: currentTheme.colors.text }}>
//                         <ReactMarkdown
//                           remarkPlugins={[remarkGfm, remarkMath]}
//                           rehypePlugins={[rehypeKatex]}
//                           components={{
//                             h1: ({...props}) => (
//                               <h1 className="text-xl sm:text-2xl font-semibold mt-6 mb-4 pb-2 border-b border-current/10" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             h2: ({...props}) => (
//                               <h2 className="text-lg sm:text-xl font-semibold mt-5 mb-3" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             h3: ({...props}) => (
//                               <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             p: ({...props}) => (
//                               <p className="my-3 leading-7 text-[15px]" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             ul: ({...props}) => (
//                               <ul className="my-3 ml-6 space-y-2 list-disc marker:text-current/60" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             ol: ({...props}) => (
//                               <ol className="my-3 ml-6 space-y-2 list-decimal marker:text-current/60" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             li: ({...props}) => (
//                               <li className="leading-7 pl-1" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             blockquote: ({...props}) => (
//                               <blockquote 
//                                 className="my-4 pl-4 py-2 border-l-4 italic rounded-r"
//                                 style={{ 
//                                   borderColor: currentTheme.colors.primary,
//                                   backgroundColor: currentTheme.colors.surface + '40',
//                                   color: currentTheme.colors.text 
//                                 }} 
//                                 {...props} 
//                               />
//                             ),
//                             code: ({className, children, ...props}: any) => {
//                               const match = /language-(\w+)/.exec(className || '');
//                               const language = match ? match[1] : '';
//                               // Normalize escaped newlines - use negative lookahead to protect LaTeX
//                               const codeString = String(children)
//                                 .replace(/\\n(?![a-zA-Z])/g, '\n')
//                                 .replace(/\\t(?![a-zA-Z])/g, '\t')
//                                 .replace(/\\r(?![a-zA-Z])/g, '\r')
//                                 .replace(/\n$/, '');
                              
//                               // Block code with language
//                               const isBlock = Boolean(language) || codeString.includes('\n') || Boolean(className);
                              
//                               if (isBlock && language) {
//                                 return (
//                                   <div className="my-4 rounded-xl overflow-hidden shadow-lg w-full" style={{ backgroundColor: '#1e1e1e' }}>
//                                     <div className="flex items-center justify-between px-4 py-2 border-b border-white/10" style={{ backgroundColor: '#2d2d2d' }}>
//                                       <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">{language}</span>
//                                       <button
//                                         onClick={() => {
//                                           navigator.clipboard.writeText(codeString);
//                                         }}
//                                         className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
//                                       >
//                                         <Copy className="w-3.5 h-3.5" />
//                                         Copy
//                                       </button>
//                                     </div>
//                                     <div className="overflow-x-auto overflow-y-visible">
//                                       <SyntaxHighlighter
//                                         style={oneDark}
//                                         language={language}
//                                         PreTag="div"
//                                         wrapLongLines={true}
//                                         customStyle={{
//                                           margin: 0,
//                                           padding: '1rem 1.25rem',
//                                           background: 'transparent',
//                                           fontSize: '0.875rem',
//                                           lineHeight: '1.6',
//                                           whiteSpace: 'pre',
//                                           overflowX: 'auto',
//                                         }}
//                                         codeTagProps={{
//                                           style: {
//                                             fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
//                                           }
//                                         }}
//                                         {...props}
//                                       >
//                                         {codeString}
//                                       </SyntaxHighlighter>
//                                     </div>
//                                   </div>
//                                 );
//                               }
                              
//                               // Block code without language
//                               if (isBlock) {
//                                 return (
//                                   <div className="my-4 rounded-xl overflow-hidden shadow-lg w-full" style={{ backgroundColor: '#1e1e1e' }}>
//                                     <div className="flex items-center justify-end px-4 py-2 border-b border-white/10" style={{ backgroundColor: '#2d2d2d' }}>
//                                       <button
//                                         onClick={() => navigator.clipboard.writeText(codeString)}
//                                         className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
//                                       >
//                                         <Copy className="w-3.5 h-3.5" />
//                                         Copy
//                                       </button>
//                                     </div>
//                                     <div className="overflow-x-auto overflow-y-visible">
//                                       <SyntaxHighlighter
//                                         style={oneDark}
//                                         language="text"
//                                         PreTag="div"
//                                         wrapLongLines={true}
//                                         customStyle={{
//                                           margin: 0,
//                                           padding: '1rem 1.25rem',
//                                           background: 'transparent',
//                                           fontSize: '0.875rem',
//                                           lineHeight: '1.6',
//                                           whiteSpace: 'pre',
//                                           overflowX: 'auto',
//                                         }}
//                                         codeTagProps={{
//                                           style: {
//                                             fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
//                                           }
//                                         }}
//                                         {...props}
//                                       >
//                                         {codeString}
//                                       </SyntaxHighlighter>
//                                     </div>
//                                   </div>
//                                 );
//                               }
                              
//                               // Inline code
//                               return (
//                                 <code 
//                                   className="px-1.5 py-0.5 rounded text-[13px] font-medium"
//                                   style={{ 
//                                     backgroundColor: currentTheme.colors.surface,
//                                     color: currentTheme.colors.primary,
//                                     fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
//                                   }}
//                                   {...props}
//                                 >
//                                   {children}
//                                 </code>
//                               );
//                             },
//                             pre: ({children}) => (
//                               <div className="not-prose">{children}</div>
//                             ),
//                             strong: ({...props}) => (
//                               <strong className="font-semibold" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             em: ({...props}) => (
//                               <em className="italic" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             hr: ({...props}) => (
//                               <hr className="my-6" style={{ borderColor: currentTheme.colors.border }} {...props} />
//                             ),
//                             a: ({...props}) => (
//                               <a 
//                                 className="underline underline-offset-2 hover:opacity-80 transition-opacity" 
//                                 style={{ color: currentTheme.colors.primary }}
//                                 target="_blank" 
//                                 rel="noopener noreferrer" 
//                                 {...props} 
//                               />
//                             ),
//                             table: ({...props}) => (
//                               <div className="overflow-x-auto my-4 rounded-xl border shadow-sm" style={{ borderColor: currentTheme.colors.border }}>
//                                 <table className="min-w-full divide-y border-collapse" style={{ borderColor: currentTheme.colors.border }} {...props} />
//                               </div>
//                             ),
//                             thead: ({...props}) => (
//                               <thead style={{ backgroundColor: currentTheme.colors.surface }} {...props} />
//                             ),
//                             tbody: ({...props}) => (
//                               <tbody className="divide-y" style={{ borderColor: currentTheme.colors.border }} {...props} />
//                             ),
//                             tr: ({...props}) => (
//                               <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors" {...props} />
//                             ),
//                             th: ({...props}) => (
//                               <th 
//                                 className="px-4 py-3 font-semibold text-left text-sm whitespace-nowrap" 
//                                 style={{ backgroundColor: currentTheme.colors.surface, color: currentTheme.colors.text, borderBottom: `1px solid ${currentTheme.colors.border}` }} 
//                                 {...props} 
//                               />
//                             ),
//                             td: ({...props}) => (
//                               <td 
//                                 className="px-4 py-3 text-sm" 
//                                 style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }} 
//                                 {...props} 
//                               />
//                             ),
//                           }}
//                         >
//                           {normalizeMarkdown(message.content)}
//                         </ReactMarkdown>
//                       </div>
                      
//                       {/* Actions bar */}
//                       <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => copyMessage(message.content)}
//                           className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <Copy className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textSecondary }} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <ThumbsUp className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textSecondary }} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <ThumbsDown className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textSecondary }} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <RefreshCw className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textSecondary }} />
//                         </button>
//                       </div>
//                     </div>
//                   )}
                  
//                   {message.suggestions && (
//                     <div className="mt-2 sm:mt-3 flex flex-wrap gap-2">
//                       {message.suggestions.map((suggestion, index) => (
//                         <button
//                           key={index}
//                           onClick={() => handleSuggestionClick(suggestion)}
//                           className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs border rounded-full transition-all duration-200 hover:scale-105"
//                           style={{
//                             background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`,
//                             borderColor: currentTheme.colors.border,
//                             color: currentTheme.colors.textSecondary
//                           }}
//                         >
//                           {suggestion}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
            
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="max-w-[85%] space-y-2">
//                   {/* Main thinking indicator */}
//                   <div className="flex items-start space-x-3">
//                     <div className="mt-1">
//                       <Loader2 className="w-5 h-5 animate-spin" style={{ color: currentTheme.colors.primary }} />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
//                           Amesie is thinking
//                         </span>
//                         <div className="flex space-x-1">
//                           <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.primary }}></div>
//                           <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.secondary, animationDelay: '0.1s' }}></div>
//                           <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.accent, animationDelay: '0.2s' }}></div>
//                         </div>
//                       </div>
                      
//                       {/* Collapsible thinking details */}
//                       {thinkingDetails.length > 0 && (
//                         <div className="space-y-2">
//                           <button
//                             onClick={() => setShowThinkingDetails(!showThinkingDetails)}
//                             className="flex items-center space-x-2 text-xs transition-colors hover:opacity-80"
//                             style={{ color: currentTheme.colors.textSecondary }}
//                           >
//                             {showThinkingDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                             <span>{showThinkingDetails ? 'Hide' : 'Show'} thinking process</span>
//                           </button>
                          
//                           {showThinkingDetails && (
//                             <div 
//                               className="rounded-lg p-3 space-y-1.5 border backdrop-blur-sm"
//                               style={{
//                                 backgroundColor: currentTheme.colors.surface + '30',
//                                 borderColor: currentTheme.colors.border
//                               }}
//                             >
//                               {thinkingDetails.map((detail, idx) => (
//                                 <div key={idx} className="flex items-start space-x-2 text-xs">
//                                   <div className="mt-0.5">
//                                     {idx === thinkingDetails.length - 1 ? (
//                                       <Loader2 className="w-3 h-3 animate-spin" style={{ color: currentTheme.colors.secondary }} />
//                                     ) : (
//                                       <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.success + '30' }}>
//                                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.colors.success }}></div>
//                                       </div>
//                                     )}
//                                   </div>
//                                   <span style={{ color: currentTheme.colors.textSecondary }}>{detail}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Fixed Input Area */}
//           <div className="p-4 border-t flex-shrink-0" style={{ borderColor: currentTheme.colors.border }}>
//             <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Message Amesie..."
//                 className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200"
//                 style={{
//                   backgroundColor: currentTheme.colors.surface + '60',
//                   borderColor: currentTheme.colors.border,
//                   color: currentTheme.colors.text,
//                   fontSize: '16px'
//                 }}
//               />
//               <button
//                 type="submit"
//                 disabled={!inputValue.trim()}
//                 className="p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
//                 style={{
//                   background: inputValue.trim() 
//                     ? `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
//                     : currentTheme.colors.surface,
//                   color: currentTheme.colors.text
//                 }}
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         multiple
//         accept="image/*,.pdf,.txt,.doc,.docx"
//         onChange={(e) => {
//           if (e.target.files) {
//             playSound('notification');
//           }
//         }}
//       />
      
//       <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${isMaximized ? 'p-0' : 'p-0 sm:p-4'}`}>
//         <div 
//           className={`backdrop-blur-xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-500 relative gpu-accelerated ${
//           isMaximized 
//             ? 'w-full h-full rounded-none' 
//             : 'w-full h-full sm:w-[400px] sm:h-[600px] sm:rounded-xl sm:rounded-2xl'
//         }`}
//         style={{
//           maxWidth: isMaximized ? '100%' : '100%',
//           maxHeight: isMaximized ? '100%' : '100%',
//           background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
//           borderColor: currentTheme.colors.border,
//           boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
//         }}>
//           {/* Enhanced Header */}
//           <div className="flex items-center justify-between p-3 sm:p-6 border-b backdrop-blur-md"
//                style={{
//                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
//                  borderColor: currentTheme.colors.border
//                }}>
//             <div className="flex items-center space-x-2 sm:space-x-4">
//               <div className="relative group">
//                 <div className="absolute -inset-2 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"
//                      style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}></div>
//                 <Brain className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse relative z-10" 
//                        style={{ color: currentTheme.colors.primary }} />
//                 <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-ping"
//                      style={{ backgroundColor: currentTheme.colors.secondary }}></div>
//                 <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full"
//                      style={{ backgroundColor: currentTheme.colors.secondary }}></div>
//               </div>
//               <div>
//                 <h2 className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent"
//                     style={{ backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}>
//                   {agentContext ? `${agentContext.name}` : 'Amesie AI'}
//                 </h2>
//                 <div className="flex items-center space-x-2 sm:space-x-3">
//                   <div className="flex items-center space-x-1" style={{ color: currentTheme.colors.secondary }}>
//                     <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
//                     <span className="text-xs sm:text-sm font-medium" style={{ color: currentTheme.colors.secondary }}>
//                       Online • {agentContext ? `${agentContext.department} Mode` : 'Advanced Mode'}
//                     </span>
//                   </div>
//                   <div className="text-xs px-2 py-1 rounded-full hidden sm:block"
//                        style={{ 
//                          color: currentTheme.colors.textSecondary,
//                          backgroundColor: currentTheme.colors.surface + '40'
//                        }}>
//                     {agentContext ? `${agentContext.level} Level` : 'Advanced Mode'}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-1 sm:space-x-2">
//               <button
//                 onClick={() => setSoundEnabled(!soundEnabled)}
//                 className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
//                 style={{ backgroundColor: 'transparent' }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//               >
//                 {soundEnabled ? 
//                   <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} /> : 
//                   <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
//                 }
//               </button>
              
//               <button
//                 onClick={exportChat}
//                 className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
//                 style={{ backgroundColor: 'transparent' }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//               >
//                 <Download className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
//               </button>
              
//               <button
//                 onClick={shareChat}
//                 className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
//                 style={{ backgroundColor: 'transparent' }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//               >
//                 <Share className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
//               </button>
              
//               <button
//                 onClick={() => setIsMaximized(!isMaximized)}
//                 className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
//                 style={{ backgroundColor: 'transparent' }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//               >
//                 {isMaximized ? 
//                   <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} /> : 
//                   <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
//                 }
//               </button>
              
//               <button
//                 onClick={onClose}
//                 className="p-1.5 sm:p-2 border border-transparent rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
//                 style={{ backgroundColor: 'transparent' }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = currentTheme.colors.error + '20';
//                   e.currentTarget.style.borderColor = currentTheme.colors.error + '30';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = 'transparent';
//                   e.currentTarget.style.borderColor = 'transparent';
//                 }}
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentTheme.colors.textSecondary }} />
//               </button>
//             </div>
//           </div>

//           {/* Enhanced Messages */}
//           <div 
//             ref={messagesContainerRef}
//             onScroll={handleMessagesScroll}
//             className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar" 
//             style={{ 
//               WebkitOverflowScrolling: 'touch',
//               overscrollBehavior: 'contain',
//               willChange: 'scroll-position'
//             }}
//           >
//             {/* Empty State */}
//             {messages.length === 0 && !isTyping && (
//               <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
//                 <Brain className="w-16 h-16 mb-4 animate-pulse" style={{ color: currentTheme.colors.primary }} />
//                 <h3 className="text-lg font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
//                   Start a conversation
//                 </h3>
//                 <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
//                   Ask me anything about your business, analytics, or get help with tasks
//                 </p>
//               </div>
//             )}
            
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
//               >
//                 <div className={`max-w-[90%] sm:max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
//                   {/* User messages - keep boxed */}
//                   {message.sender === 'user' ? (
//                     <div
//                       className="p-3 sm:p-4 rounded-xl backdrop-blur-md border transition-all duration-300"
//                       style={{
//                         background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
//                         borderColor: currentTheme.colors.primary + '40',
//                         color: currentTheme.colors.text
//                       }}
//                     >
//                       <div className="prose prose-sm max-w-none" style={{ color: currentTheme.colors.text }}>
//                         <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
//                           {message.content}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     /* AI messages - free-flow, no box */
//                     <div className="space-y-3">
//                       {/* AI & Name */}
//                       <div className="flex items-center space-x-2 mb-2">
//                         <div className="relative">
//                           {agentContext ? (
//                             <span className="text-lg">{agentContext.avatar}</span>
//                           ) : (
//                             <Brain className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
//                           )}
//                           <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.success }}></div>
//                         </div>
//                         <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
//                           {agentContext ? agentContext.name : 'Amesie AI'}
//                         </span>
//                         <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
//                           {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </span>
//                       </div>
                      
//                       {/* Message content - Claude/GPT style with prose */}
//                       <div className="max-w-full prose prose-sm sm:prose-base prose-headings:text-current prose-p:text-current prose-li:text-current prose-strong:text-current prose-em:text-current" style={{ color: currentTheme.colors.text }}>
//                         <ReactMarkdown
//                           remarkPlugins={[remarkGfm, remarkMath]}
//                           rehypePlugins={[rehypeKatex]}
//                           components={{
//                             h1: ({...props}) => (
//                               <h1 className="text-xl sm:text-2xl font-semibold mt-6 mb-4 pb-2 border-b border-current/10" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             h2: ({...props}) => (
//                               <h2 className="text-lg sm:text-xl font-semibold mt-5 mb-3" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             h3: ({...props}) => (
//                               <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             p: ({...props}) => (
//                               <p className="my-3 leading-7 text-sm sm:text-[15px]" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             ul: ({...props}) => (
//                               <ul className="my-3 ml-6 space-y-2 list-disc marker:text-current/60" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             ol: ({...props}) => (
//                               <ol className="my-3 ml-6 space-y-2 list-decimal marker:text-current/60" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             li: ({...props}) => (
//                               <li className="leading-7 pl-1" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             blockquote: ({...props}) => (
//                               <blockquote 
//                                 className="my-4 pl-4 py-2 border-l-4 italic rounded-r"
//                                 style={{ 
//                                   borderColor: currentTheme.colors.primary,
//                                   backgroundColor: currentTheme.colors.surface + '40',
//                                   color: currentTheme.colors.text 
//                                 }} 
//                                 {...props} 
//                               />
//                             ),
//                             code: ({className, children, ...props}: any) => {
//                               const match = /language-(\w+)/.exec(className || '');
//                               const language = match ? match[1] : '';
//                               // Normalize escaped newlines - use negative lookahead to protect LaTeX
//                               const codeString = String(children)
//                                 .replace(/\\n(?![a-zA-Z])/g, '\n')
//                                 .replace(/\\t(?![a-zA-Z])/g, '\t')
//                                 .replace(/\\r(?![a-zA-Z])/g, '\r')
//                                 .replace(/\n$/, '');
                              
//                               // Block code with language
//                               const isBlock = Boolean(language) || codeString.includes('\n') || Boolean(className);
                              
//                               if (isBlock && language) {
//                                 return (
//                                   <div className="my-4 rounded-xl overflow-hidden shadow-lg w-full" style={{ backgroundColor: '#1e1e1e' }}>
//                                     <div className="flex items-center justify-between px-4 py-2 border-b border-white/10" style={{ backgroundColor: '#2d2d2d' }}>
//                                       <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">{language}</span>
//                                       <button
//                                         onClick={() => {
//                                           navigator.clipboard.writeText(codeString);
//                                         }}
//                                         className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
//                                       >
//                                         <Copy className="w-3.5 h-3.5" />
//                                         Copy
//                                       </button>
//                                     </div>
//                                     <div className="overflow-x-auto overflow-y-visible">
//                                       <SyntaxHighlighter
//                                         style={oneDark}
//                                         language={language}
//                                         PreTag="div"
//                                         wrapLongLines={true}
//                                         customStyle={{
//                                           margin: 0,
//                                           padding: '1rem 1.25rem',
//                                           background: 'transparent',
//                                           fontSize: '0.875rem',
//                                           lineHeight: '1.6',
//                                           whiteSpace: 'pre',
//                                           overflowX: 'auto',
//                                         }}
//                                         codeTagProps={{
//                                           style: {
//                                             fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
//                                           }
//                                         }}
//                                         {...props}
//                                       >
//                                         {codeString}
//                                       </SyntaxHighlighter>
//                                     </div>
//                                   </div>
//                                 );
//                               }
                              
//                               // Block code without language
//                               if (isBlock) {
//                                 return (
//                                   <div className="my-4 rounded-xl overflow-hidden shadow-lg w-full" style={{ backgroundColor: '#1e1e1e' }}>
//                                     <div className="flex items-center justify-end px-4 py-2 border-b border-white/10" style={{ backgroundColor: '#2d2d2d' }}>
//                                       <button
//                                         onClick={() => navigator.clipboard.writeText(codeString)}
//                                         className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
//                                       >
//                                         <Copy className="w-3.5 h-3.5" />
//                                         Copy
//                                       </button>
//                                     </div>
//                                     <div className="overflow-x-auto overflow-y-visible">
//                                       <SyntaxHighlighter
//                                         style={oneDark}
//                                         language="text"
//                                         PreTag="div"
//                                         wrapLongLines={true}
//                                         customStyle={{
//                                           margin: 0,
//                                           padding: '1rem 1.25rem',
//                                           background: 'transparent',
//                                           fontSize: '0.875rem',
//                                           lineHeight: '1.6',
//                                           whiteSpace: 'pre',
//                                           overflowX: 'auto',
//                                         }}
//                                         codeTagProps={{
//                                           style: {
//                                             fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
//                                           }
//                                         }}
//                                         {...props}
//                                       >
//                                         {codeString}
//                                       </SyntaxHighlighter>
//                                     </div>
//                                   </div>
//                                 );
//                               }
                              
//                               // Inline code
//                               return (
//                                 <code 
//                                   className="px-1.5 py-0.5 rounded text-[13px] font-medium"
//                                   style={{ 
//                                     backgroundColor: currentTheme.colors.surface,
//                                     color: currentTheme.colors.primary,
//                                     fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
//                                   }}
//                                   {...props}
//                                 >
//                                   {children}
//                                 </code>
//                               );
//                             },
//                             pre: ({children}) => (
//                               <div className="not-prose">{children}</div>
//                             ),
//                             strong: ({...props}) => (
//                               <strong className="font-semibold" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             em: ({...props}) => (
//                               <em className="italic" style={{ color: currentTheme.colors.text }} {...props} />
//                             ),
//                             hr: ({...props}) => (
//                               <hr className="my-6" style={{ borderColor: currentTheme.colors.border }} {...props} />
//                             ),
//                             a: ({...props}) => (
//                               <a 
//                                 className="underline underline-offset-2 hover:opacity-80 transition-opacity" 
//                                 style={{ color: currentTheme.colors.primary }}
//                                 target="_blank" 
//                                 rel="noopener noreferrer" 
//                                 {...props} 
//                               />
//                             ),
//                             table: ({...props}) => (
//                               <div className="overflow-x-auto my-4 rounded-xl border shadow-sm" style={{ borderColor: currentTheme.colors.border }}>
//                                 <table className="min-w-full divide-y border-collapse" style={{ borderColor: currentTheme.colors.border }} {...props} />
//                               </div>
//                             ),
//                             thead: ({...props}) => (
//                               <thead style={{ backgroundColor: currentTheme.colors.surface }} {...props} />
//                             ),
//                             tbody: ({...props}) => (
//                               <tbody className="divide-y" style={{ borderColor: currentTheme.colors.border }} {...props} />
//                             ),
//                             tr: ({...props}) => (
//                               <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors" {...props} />
//                             ),
//                             th: ({...props}) => (
//                               <th 
//                                 className="px-4 py-3 font-semibold text-left text-sm whitespace-nowrap" 
//                                 style={{ backgroundColor: currentTheme.colors.surface, color: currentTheme.colors.text, borderBottom: `1px solid ${currentTheme.colors.border}` }} 
//                                 {...props} 
//                               />
//                             ),
//                             td: ({...props}) => (
//                               <td 
//                                 className="px-4 py-3 text-sm" 
//                                 style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }} 
//                                 {...props} 
//                               />
//                             ),
//                           }}
//                         >
//                           {normalizeMarkdown(message.content)}
//                         </ReactMarkdown>
//                       </div>
                      
//                       {/* Actions bar */}
//                       <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => copyMessage(message.content)}
//                           className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <Copy className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textSecondary }} />
//                         </button>
//                         <button
//                           onClick={() => addReaction(message.id, '👍')}
//                           className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <ThumbsUp className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textSecondary }} />
//                         </button>
//                         <button
//                           onClick={() => addReaction(message.id, '❤️')}
//                           className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <ThumbsDown className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textSecondary }} />
//                         </button>
//                         <button
//                           className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                         >
//                           <RefreshCw className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textSecondary }} />
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {message.suggestions && (
//                     <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
//                       {message.suggestions.map((suggestion, index) => (
//                         <button
//                           key={index}
//                           onClick={() => handleSuggestionClick(suggestion)}
//                           className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-full 
//                                    transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm"
//                           style={{
//                             background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`,
//                             borderColor: currentTheme.colors.border,
//                             color: currentTheme.colors.textSecondary,
//                             boxShadow: `0 4px 12px -4px ${currentTheme.shadows.primary}`
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background = `linear-gradient(135deg, ${currentTheme.colors.surface}60, ${currentTheme.colors.surface}40)`;
//                             e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
//                             e.currentTarget.style.color = currentTheme.colors.text;
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background = `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`;
//                             e.currentTarget.style.borderColor = currentTheme.colors.border;
//                             e.currentTarget.style.color = currentTheme.colors.textSecondary;
//                           }}
//                         >
//                           {suggestion}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="max-w-[85%] space-y-2">
//                   {/* Main thinking indicator */}
//                   <div className="flex items-start space-x-3">
//                     <div className="mt-1">
//                       <Loader2 className="w-5 h-5 animate-spin" style={{ color: currentTheme.colors.primary }} />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
//                           Amesie is thinking
//                         </span>
//                         <div className="flex space-x-1">
//                           <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.primary }}></div>
//                           <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.secondary, animationDelay: '0.1s' }}></div>
//                           <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: currentTheme.colors.accent, animationDelay: '0.2s' }}></div>
//                         </div>
//                       </div>
                      
//                       {/* Collapsible thinking details */}
//                       {thinkingDetails.length > 0 && (
//                         <div className="space-y-2">
//                           <button
//                             onClick={() => setShowThinkingDetails(!showThinkingDetails)}
//                             className="flex items-center space-x-2 text-xs transition-colors hover:opacity-80"
//                             style={{ color: currentTheme.colors.textSecondary }}
//                           >
//                             {showThinkingDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                             <span>{showThinkingDetails ? 'Hide' : 'Show'} thinking process</span>
//                           </button>
                          
//                           {showThinkingDetails && (
//                             <div 
//                               className="rounded-lg p-3 space-y-1.5 border backdrop-blur-sm"
//                               style={{
//                                 backgroundColor: currentTheme.colors.surface + '30',
//                                 borderColor: currentTheme.colors.border
//                               }}
//                             >
//                               {thinkingDetails.map((detail, idx) => (
//                                 <div key={idx} className="flex items-start space-x-2 text-xs">
//                                   <div className="mt-0.5">
//                                     {idx === thinkingDetails.length - 1 ? (
//                                       <Loader2 className="w-3 h-3 animate-spin" style={{ color: currentTheme.colors.secondary }} />
//                                     ) : (
//                                       <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.success + '30' }}>
//                                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.colors.success }}></div>
//                                       </div>
//                                     )}
//                                   </div>
//                                   <span style={{ color: currentTheme.colors.textSecondary }}>{detail}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Enhanced Input */}
//           <div className="p-3 sm:p-6 border-t backdrop-blur-md"
//                style={{
//                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.surface}20)`,
//                  borderColor: currentTheme.colors.border
//                }}>
//             <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
//               <div className="flex-1 relative group">
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Message Amesie..."
//                   className="w-full border rounded-xl px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 
//                            focus:outline-none transition-all duration-200 text-base"
//                   style={{
//                     backgroundColor: currentTheme.colors.surface + '40',
//                     borderColor: currentTheme.colors.border,
//                     color: currentTheme.colors.text,
//                     boxShadow: `0 4px 12px -4px ${currentTheme.shadows.primary}`
//                   }}
//                   onFocus={(e) => {
//                     e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
//                     e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
//                     e.currentTarget.style.boxShadow = `0 8px 25px -8px ${currentTheme.shadows.primary}`;
//                   }}
//                   onBlur={(e) => {
//                     e.currentTarget.style.borderColor = currentTheme.colors.border;
//                     e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40';
//                     e.currentTarget.style.boxShadow = `0 4px 12px -4px ${currentTheme.shadows.primary}`;
//                   }}
//                 />
//                 <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
//                   <button
//                     type="button"
//                     onClick={handleFileUpload}
//                     className="p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
//                     style={{ backgroundColor: 'transparent' }}
//                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                   >
//                     <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {}}
//                     className="p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block"
//                     style={{ backgroundColor: 'transparent' }}
//                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '40'}
//                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                   >
//                     <Image className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.textSecondary }} />
//                   </button>
//                 </div>
//               </div>
              
//               <button
//                 type="button"
//                 onClick={toggleVoice}
//                 className="p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
//                 style={{
//                   backgroundColor: isListening 
//                     ? currentTheme.colors.error + '20'
//                     : currentTheme.colors.surface + '40',
//                   borderColor: isListening 
//                     ? currentTheme.colors.error + '40'
//                     : currentTheme.colors.border,
//                   color: isListening 
//                     ? currentTheme.colors.error
//                     : currentTheme.colors.textSecondary,
//                   boxShadow: isListening 
//                     ? `0 8px 25px -8px ${currentTheme.colors.error}40`
//                     : 'none'
//                 }}
//               >
//                 {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
//               </button>
              
//               <button
//                 type="submit"
//                 disabled={!inputValue.trim()}
//                 className="p-3 sm:p-4 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:scale-100
//                          disabled:cursor-not-allowed backdrop-blur-sm relative overflow-hidden group"
//                 style={{
//                   background: !inputValue.trim() 
//                     ? `linear-gradient(135deg, ${currentTheme.colors.textSecondary}60, ${currentTheme.colors.textSecondary}60)`
//                     : `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
//                   color: currentTheme.colors.text,
//                   boxShadow: !inputValue.trim() 
//                     ? 'none'
//                     : `0 8px 25px -8px ${currentTheme.shadows.primary}`
//                 }}
//               >
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}></div>
//                 <Send className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
//               </button>
//             </form>
            
//             {/* Quick Actions */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs space-y-2 sm:space-y-0"
//                  style={{ color: currentTheme.colors.textSecondary }}>
//               <div className="flex items-center space-x-3 sm:space-x-6">
//                 <div className="flex items-center space-x-2">
//                   <kbd className="px-2 py-1 rounded text-xs" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>Enter</kbd>
//                   <span>to send</span>
//                 </div>
//                 <div className="flex items-center space-x-2 hidden sm:flex">
//                   <kbd className="px-2 py-1 rounded text-xs" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>Shift</kbd>
//                   <span>+</span>
//                   <kbd className="px-2 py-1 rounded text-xs" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>Enter</kbd>
//                   <span>for new line</span>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-2 sm:space-x-4">
//                 <div className="flex items-center space-x-2">
//                   <Code className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
//                   <span className="hidden sm:inline" style={{ color: currentTheme.colors.textSecondary }}>
//                     {agentContext ? `${agentContext.department} mode active` : 'Code generation ready'}
//                   </span>
//                   <span className="sm:hidden" style={{ color: currentTheme.colors.textSecondary }}>
//                     {agentContext ? agentContext.department : 'Code ready'}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2 hidden sm:flex">
//                   <BarChart3 className="w-3 h-3" style={{ color: currentTheme.colors.secondary }} />
//                   <span style={{ color: currentTheme.colors.textSecondary }}>
//                     {agentContext ? `${agentContext.level} level access` : 'Analytics enabled'}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <Zap className="w-3 h-3 animate-pulse" style={{ color: currentTheme.colors.accent }} />
//                   <span className="font-medium text-xs" style={{ color: currentTheme.colors.accent }}>
//                     {agentContext ? `${agentContext.name} AI` : 'Amesie AI'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

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
        <div className="h-[95%] w-full flex flex-col min-w-0 min-h-0 bg-transparent overflow-hidden">
          
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
                      <Paperclip className="w-4 h-4" />
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