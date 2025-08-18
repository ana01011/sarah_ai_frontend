export class StreamingService {
  private static instance: StreamingService;
  private controller: AbortController | null = null;

  static getInstance(): StreamingService {
    if (!StreamingService.instance) {
      StreamingService.instance = new StreamingService();
    }
    return StreamingService.instance;
  }

  async streamChat(
    message: string,
    onToken: (token: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    this.controller = new AbortController();
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://147.93.102.165:8000';

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          message, 
          stream: true,
          max_tokens: 500 
        }),
        signal: this.controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                onToken(data.token);
              }
              if (data.done) {
                onComplete();
                return;
              }
              if (data.error) {
                onError(data.error);
                return;
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Streaming aborted');
      } else {
        onError(error instanceof Error ? error.message : 'Streaming failed');
      }
    }
  }

  stopStreaming(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}