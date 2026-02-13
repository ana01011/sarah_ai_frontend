// MOCK API Service - All endpoints are mocked for frontend development
// TODO: Replace with real API endpoints when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface AgentChatRequest {
  role?: string;
  message: string;
  conversation_id?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface AgentChatResponse {
  response: string;
  conversation_id: string;
  message_id: string;
  personality: string;
  tokens_used: number;
  processing_time: number;
  user_context: object;
}

export interface ConversationSummary {
  id: string;
  title: string;
  last_message_at: string;
  message_count: number;
  started_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Simulate network delay
const simulateNetworkDelay = () => new Promise(resolve => 
  setTimeout(resolve, 200 + Math.random() * 300)
);

export const apiService = {
  // MOCK: Get Agent Roles
  // TODO: Replace with real API endpoint: GET ${API_BASE_URL}/agents
  async getAgentRoles(): Promise<string[]> {
    console.log('[MOCK] Get Agent Roles endpoint');
    await simulateNetworkDelay();
    return ['sarah', 'xhash', 'neutral'];
  },

  // MOCK: Send Chat Message
  // TODO: Replace with real API endpoint: POST ${API_BASE_URL}/api/v1/chat/message
  async sendChatMessage(request: AgentChatRequest): Promise<AgentChatResponse> {
    console.log('[MOCK] Send Chat Message endpoint:', request);
    await simulateNetworkDelay();

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }

    const conversationId = request.conversation_id || `conv-${Date.now()}`;
    
    return {
      response: `Mock response from ${request.role || 'sarah'}: This is a mock response to your message: "${request.message}"`,
      conversation_id: conversationId,
      message_id: `msg-${Date.now()}`,
      personality: request.role || 'sarah',
      tokens_used: Math.floor(Math.random() * 200),
      processing_time: 0.5 + Math.random() * 2,
      user_context: { mock: true }
    };
  },

  // MOCK: Create New Conversation
  // TODO: Replace with real API endpoint: POST ${API_BASE_URL}/api/v1/chat/conversations/new
  async createNewConversation(): Promise<{ conversation_id: string }> {
    console.log('[MOCK] Create New Conversation endpoint');
    await simulateNetworkDelay();

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }

    return {
      conversation_id: `conv-${Date.now()}`
    };
  },

  // MOCK: Rename Conversation
  // TODO: Replace with real API endpoint: PATCH ${API_BASE_URL}/api/v1/chat/conversations/:conversationId/rename
  async renameConversation(conversationId: string, newTitle: string): Promise<void> {
    console.log('[MOCK] Rename Conversation endpoint:', { conversationId, newTitle });
    await simulateNetworkDelay();

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }
  },

  // Get Conversations - Returns empty array since we use local storage for persistence
  // Real conversations come from WebSocket session API
  async getConversations(): Promise<ConversationSummary[]> {
    // Return empty - local storage handles persistence now
    return [];
  },

  // MOCK: Get Conversation Messages
  // TODO: Replace with real API endpoint: GET ${API_BASE_URL}/api/v1/chat/conversations/:conversationId/messages
  async getConversationMessages(conversationId: string): Promise<ConversationMessage[]> {
    console.log('[MOCK] Get Conversation Messages endpoint:', conversationId);
    await simulateNetworkDelay();

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }

    return [
      {
        id: 'msg-1',
        conversation_id: conversationId,
        role: 'user',
        content: 'Hello, how are you?',
        created_at: new Date().toISOString()
      },
      {
        id: 'msg-2',
        conversation_id: conversationId,
        role: 'assistant',
        content: 'I am doing well, thank you for asking!',
        created_at: new Date().toISOString()
      }
    ];
  },

  // MOCK: Delete Conversation
  // TODO: Replace with real API endpoint: DELETE ${API_BASE_URL}/api/v1/chat/conversations/:conversationId
  async deleteConversation(conversationId: string): Promise<void> {
    console.log('[MOCK] Delete Conversation endpoint:', conversationId);
    await simulateNetworkDelay();

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to continue');
    }
  },

  // MOCK: Health Check
  // TODO: Replace with real API endpoint: GET ${API_BASE_URL}/health
  async checkHealth(): Promise<boolean> {
    console.log('[MOCK] Health Check endpoint');
    await simulateNetworkDelay();
    return true; // Mock always returns healthy
  }
};
