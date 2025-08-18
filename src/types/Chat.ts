export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  agentRole?: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  preview: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface StreamingResponse {
  token: string;
  done: boolean;
  error?: string;
}