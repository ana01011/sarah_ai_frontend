// API Service for Amesie AI Backend
const API_BASE_URL = 'http://147.93.102.165:8000';

export interface AgentChatRequest {
  role?: string;
  message: string;
}

export interface AgentChatResponse {
  response: string;
  role: string;
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
      return ['general', 'software_engineer', 'data_analyst'];
    }
  },

  async sendAgentChat(request: AgentChatRequest): Promise<AgentChatResponse> {
    try {
      console.log('Sending to backend:', `${API_BASE_URL}/api/chat`);
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request.message,
          agent_role: request.role || 'general',
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received from backend:', data);
      
      return {
        response: data.response,
        role: data.role
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
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
