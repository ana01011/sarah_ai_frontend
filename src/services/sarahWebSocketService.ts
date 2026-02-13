// Sarah AI WebSocket Service
// Flow: Login → Create Session → Connect WebSocket → Send Plain Text

const API_BASE = import.meta.env.VITE_API_URL || 'http://76.13.17.48:8001';
const WS_BASE = 'ws://76.13.17.48:8001';

type MessageHandler = (message: string) => void;

interface SessionResponse {
  conversation_id: string;
  ws_url: string;
}

class SarahWebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private conversationId: string | null = null;
  private isConnected = false;

  /**
   * Step 1 & 2: Create a new session and get WebSocket URL
   */
  async createSession(): Promise<SessionResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📡 Creating Sarah AI session...');
    
    const response = await fetch(`${API_BASE}/api/agent/session`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    const data: SessionResponse = await response.json();
    console.log('✅ Session created:', data.conversation_id);
    
    this.conversationId = data.conversation_id;
    return data;
  }

  /**
   * Internal WebSocket connection using existing session data
   */
  private connectToWebSocket(wsUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔌 Connecting to Amesie AI WebSocket:', wsUrl);

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('✅ Amesie AI WebSocket Connected');
        this.isConnected = true;
        resolve();
      };

      this.socket.onmessage = (event) => {
        console.log('📩 Message received:', event.data);
        // Notify all handlers with the plain text message
        this.messageHandlers.forEach(handler => handler(event.data));
      };

      this.socket.onclose = (event) => {
        console.log('⚠️ Amesie AI WebSocket Disconnected:', event.reason);
        this.isConnected = false;
        this.socket = null;
      };

      this.socket.onerror = (error) => {
        console.error('❌ Amesie AI WebSocket Error:', error);
        reject(error);
      };
    });
  }

  /**
   * Step 3 & 4: Connect to WebSocket using session URL
   */
  async connect(): Promise<void> {
    // Prevent multiple connections
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('⚠️ WebSocket already connected or connecting');
      return;
    }

    try {
      // Get session
      const session = await this.createSession();
      
      // Build full WebSocket URL
      const wsUrl = `${WS_BASE}${session.ws_url}`;
      await this.connectToWebSocket(wsUrl);

    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  /**
   * Start a new conversation: Disconnect old, create new session, connect WebSocket
   * Returns the new conversation ID for storage
   */
  async startNewConversation(): Promise<SessionResponse> {
    console.log('🆕 Starting new conversation...');
    
    // Disconnect existing connection if any
    this.disconnect();
    
    try {
      // Create new session
      const session = await this.createSession();
      
      // Build full WebSocket URL and connect
      const wsUrl = `${WS_BASE}${session.ws_url}`;
      await this.connectToWebSocket(wsUrl);
      
      console.log('✅ New conversation started:', session.conversation_id);
      return session;
    } catch (error) {
      console.error('Failed to start new conversation:', error);
      throw error;
    }
  }

  /**
   * Step 5: Send plain text message (NOT JSON!)
   */
  sendMessage(text: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('📤 Sending message:', text);
      // Send as PLAIN TEXT, not JSON
      this.socket.send(text);
    } else {
      console.warn('⚠️ WebSocket not connected. Attempting to reconnect...');
      this.connect().then(() => {
        // Retry after connection
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(text);
        }
      });
    }
  }

  /**
   * Register a message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.conversationId = null;
    }
  }

  /**
   * Get current conversation ID
   */
  getConversationId(): string | null {
    return this.conversationId;
  }

  /**
   * Check if connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const sarahWebSocketService = new SarahWebSocketService();
