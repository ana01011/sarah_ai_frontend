import {
  RegisterRequest,
  LoginRequest,
  VerifyOTPRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
  AuthResponse,
  User
} from '../types/Auth';

// Mock API - All endpoints are mocked for frontend development only
// TODO: Replace with real API endpoints when backend is ready
const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` : 'http://localhost:8000/api/v1';

class AuthService {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // MOCK: Register
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/register
  async register(data: RegisterRequest): Promise<any> {
    console.log('[MOCK] Register endpoint:', data);
    await this.simulateNetworkDelay();
    
    return {
      success: true,
      message: 'Registration successful. OTP sent to email.',
      email: data.email,
      requiresOTP: true
    };
  }

  // MOCK: Verify OTP
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/verify-otp
  async verifyOTP(data: VerifyOTPRequest): Promise<any> {
    console.log('[MOCK] Verify OTP endpoint:', data);
    await this.simulateNetworkDelay();
    
    const mockToken = `mock-token-${Date.now()}`;
    this.setToken(mockToken);
    
    return {
      success: true,
      access_token: mockToken,
      token_type: 'bearer'
    };
  }

  // MOCK: Resend OTP
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/resend-otp
  async resendOTP(email: string): Promise<any> {
    console.log('[MOCK] Resend OTP endpoint:', email);
    await this.simulateNetworkDelay();
    
    return {
      success: true,
      message: 'OTP resent successfully',
      email: email
    };
  }

  // MOCK: Login
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/login
  async login(data: LoginRequest): Promise<any> {
    console.log('[MOCK] Login endpoint:', { email: data.email });
    await this.simulateNetworkDelay();

    const mockToken = `mock-token-${Date.now()}`;
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      username: data.email.split('@')[0],
      name: 'Mock User',
      is_verified: true,
      two_factor_enabled: false,
      personality: 'sarah',
      created_at: new Date().toISOString(),
      gender: 'neutral'
    };

    this.setToken(mockToken);
    this.setUser(mockUser);

    return {
      data: {
        token: mockToken,
        user: mockUser
      }
    };
  }

  // MOCK: Login Verify OTP
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/login-verify-otp
  async loginVerifyOTP(email: string, otp: string): Promise<any> {
    console.log('[MOCK] Login Verify OTP endpoint:', { email, otp });
    await this.simulateNetworkDelay();

    const mockToken = `mock-token-${Date.now()}`;
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email: email,
      username: email.split('@')[0],
      name: 'Mock User',
      is_verified: true,
      two_factor_enabled: false,
      personality: 'sarah',
      created_at: new Date().toISOString(),
      gender: 'neutral'
    };

    this.setToken(mockToken);
    this.setUser(mockUser);

    return {
      data: {
        token: mockToken,
        user: mockUser
      }
    };
  }

  // MOCK: Forgot Password
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/forgot-password
  async forgotPassword(data: ForgotPasswordRequest): Promise<any> {
    console.log('[MOCK] Forgot Password endpoint:', data);
    await this.simulateNetworkDelay();
    
    return {
      success: true,
      message: 'Password reset OTP sent to email',
      email: data.email
    };
  }

  // MOCK: Reset Password OTP
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/reset-password-otp
  async resetPasswordOTP(data: ResetPasswordRequest): Promise<any> {
    console.log('[MOCK] Reset Password OTP endpoint:', { email: data.email });
    await this.simulateNetworkDelay();
    
    return {
      success: true,
      message: 'Password reset successfully'
    };
  }

  // MOCK: Google Auth
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/google
  async googleAuth(credential: string): Promise<any> {
    console.log('[MOCK] Google Auth endpoint');
    await this.simulateNetworkDelay();

    const mockToken = `mock-token-${Date.now()}`;
    const mockUser: User = {
      id: `google-user-${Date.now()}`,
      email: 'mock.user@gmail.com',
      username: 'mockuser',
      name: 'Mock Google User',
      is_verified: true,
      two_factor_enabled: false,
      personality: 'sarah',
      created_at: new Date().toISOString(),
      gender: 'neutral'
    };

    this.setToken(mockToken);
    this.setUser(mockUser);

    return {
      success: true,
      token: mockToken,
      user: mockUser
    };
  }

  // MOCK: Get Current User
  // TODO: Replace with real API endpoint: GET ${API_BASE}/auth/me
  async getCurrentUser(): Promise<User> {
    console.log('[MOCK] Get Current User endpoint');
    await this.simulateNetworkDelay();
    
    const user = this.getUser();
    if (!user) {
      throw new Error('No user found');
    }
    
    return user;
  }

  // MOCK: Logout
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/logout
  async logout(): Promise<any> {
    console.log('[MOCK] Logout endpoint');
    await this.simulateNetworkDelay();
    this.removeToken();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  // MOCK: Enable 2FA
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/enable-2fa
  async enable2FA(): Promise<any> {
    console.log('[MOCK] Enable 2FA endpoint');
    await this.simulateNetworkDelay();
    
    const backupCodes = Array.from({ length: 10 }, () => 
      'CODE-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    
    return {
      success: true,
      qr_code: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==',
      backup_codes: backupCodes
    };
  }

  // MOCK: Disable 2FA
  // TODO: Replace with real API endpoint: POST ${API_BASE}/auth/disable-2fa
  async disable2FA(otp?: string): Promise<any> {
    console.log('[MOCK] Disable 2FA endpoint');
    await this.simulateNetworkDelay();
    
    return {
      success: true,
      message: '2FA disabled successfully'
    };
  }

  // Helper: Simulate network delay
  private simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // User management
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
