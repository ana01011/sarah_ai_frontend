// src/services/chatService.ts

const WS_URL = 'ws://76.13.17.48:8001/ws/seller/agent';

type MessageHandler = (message: any) => void;

class ChatService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private isConnected = false;

  connect() {
    // Prevent multiple connections
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Cannot connect to Agent: No token found");
      return;
    }

    console.log("🔌 Connecting to Amesie Agent...");
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      console.log("✅ WebSocket Open. Sending Handshake...");
      this.isConnected = true;
      
      // --- THE HANDSHAKE (Required by your API) ---
      const handshake = {
        token: token,
        chat_id: null // Starts a new session or uses default
      };
      this.socket?.send(JSON.stringify(handshake));
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Dispatch to UI
        this.messageHandlers.forEach(handler => handler(data));
      } catch (e) {
        console.error("Failed to parse incoming message", e);
      }
    };

    this.socket.onclose = (event) => {
      console.log("⚠️ Agent Disconnected:", event.reason);
      this.isConnected = false;
      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };
  }

  sendMessage(text: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // Sending 'query' as the key based on standard agent patterns
      this.socket.send(JSON.stringify({ query: text }));
    } else {
      console.warn("Agent not connected. Attempting to reconnect...");
      this.connect();
      // Optional: Queue message or alert user
    }
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const chatService = new ChatService();