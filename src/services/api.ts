// API Service for Sarah AI Backend
const API_BASE_URL = 'http://147.93.102.165:8000';

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

export const apiService = {
  async getAgentRoles(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/agents`);
      if (!response.ok) throw new Error('Failed to fetch roles');
      const agents = await response.json();
      return agents.map((agent: any) => agent.role);
    } catch (error) {
      console.error('Error fetching agent roles:', error);
      return ['sarah', 'xhash', 'neutral'];
    }
  },

  async sendChatMessage(request: AgentChatRequest): Promise<AgentChatResponse> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      const requestBody: any = {
        message: request.message,
        personality: request.role || 'sarah',
        max_tokens: request.max_tokens || 500,
        temperature: request.temperature || 0.7
      };

      if (request.conversation_id) {
        requestBody.conversation_id = request.conversation_id;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        response: data.response,
        conversation_id: data.conversation_id,
        message_id: data.message_id,
        personality: data.personality,
        tokens_used: data.tokens_used,
        processing_time: data.processing_time,
        user_context: data.user_context
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  async createNewConversation(): Promise<{ conversation_id: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      throw error;
    }
  },

  async renameConversation(conversationId: string, newTitle: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations/${conversationId}/rename`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error renaming conversation:', error);
      throw error;
    }
  },

  async getConversations(): Promise<ConversationSummary[]> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  async getConversationMessages(conversationId: string): Promise<ConversationMessage[]> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  },

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
};
