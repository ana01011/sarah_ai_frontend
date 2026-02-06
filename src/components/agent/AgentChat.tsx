import React, { useEffect, useState, useRef } from 'react';
import { chatService } from '../../services/chatService';
// import { chatService } from '../../services/chatSerive';
import { useTheme } from '../../contexts/ThemeContext';
import { useAgent } from '../../contexts/AgentContext';
import { Send, ArrowLeft, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'agent';
}

export const AgentChat: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setCurrentView } = useAgent();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Connect on Mount
    chatService.connect();

    // 2. Listen for messages
    const unsubscribe = chatService.onMessage((data) => {
      // NOTE: Adjust 'data.response' depending on what your backend actually sends back
      // It might be data.text, data.message, or data.answer
      const text = data.response || data.message || JSON.stringify(data);
      
      const newMessage: Message = {
        id: Date.now(),
        text: text,
        sender: 'agent'
      };
      setMessages(prev => [...prev, newMessage]);
    });

    // 3. Cleanup on Unmount
    return () => {
      unsubscribe();
      chatService.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add User Message immediately for UI responsiveness
    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    // Send to Backend
    chatService.sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm z-10" style={{ borderColor: currentTheme.colors.border }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('agent-selector')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: currentTheme.colors.primary }}>
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Amesie Agent</h3>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-slate-500">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
            <Bot size={48} className="mb-2" />
            <p>Say "Hello" to start chatting!</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border rounded-bl-none'
              }`}
              style={msg.sender === 'user' ? { backgroundColor: currentTheme.colors.primary } : { borderColor: currentTheme.colors.border }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t" style={{ borderColor: currentTheme.colors.border }}>
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your store..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:bg-white transition-all text-slate-900"
            style={{ '--tw-ring-color': currentTheme.colors.primary } as React.CSSProperties}
          />
          <button 
            type="submit"
            className="absolute right-2 p-2 rounded-lg text-white transition-transform active:scale-95 hover:shadow-md"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};