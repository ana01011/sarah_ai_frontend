import { LoginRequest, SellerRegisterRequest, Token, User } from '../types/backend';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://76.13.17.48:8001'}/api`;

class AuthService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const storedToken = token || localStorage.getItem('token');
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }
    return headers;
  }

  async login(credentials: LoginRequest): Promise<Token> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.[0]?.msg || 'Login failed. Please check your credentials.');
    }

    const data: Token = await response.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  }


  async getCurrentUser(token?: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  }

  /**
   * Register a new Seller
   */
  async registerSeller(data: SellerRegisterRequest): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/register/seller`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.[0]?.msg || 'Registration failed');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('amesie-theme');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export const authService = new AuthService();