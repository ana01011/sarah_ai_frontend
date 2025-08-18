export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
  error?: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  preview: string;
}

export interface StreamingResponse {
  token: string;
  done: boolean;
  error?: string;
}

export interface ChatState {
  currentChat: Message[];
  chatHistory: ChatHistory[];
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  currentChatId: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}