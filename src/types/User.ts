export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  preview?: string;
  messages: ChatMessage[];
  timestamp: Date;
  message_count?: number;
  started_at?: string;
  last_message_at?: string;
}