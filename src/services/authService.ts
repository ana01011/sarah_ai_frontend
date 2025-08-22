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

const API_BASE = 'http://147.93.102.165:8000/api/v1';

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

  async register(data: RegisterRequest): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        password: data.password,
        name: data.name,
        gender: data.gender
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Registration failed');
    }
    return result;
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Verification failed');
    }
    
    // Store token if returned
    if (result.access_token) {
      this.setToken(result.access_token);
    }
    
    return result;
  }

  async resendOTP(email: string): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to resend OTP');
    }
    return result;
  }

  async login(data: LoginRequest): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Login failed');
    }

    // Check for 2FA
    if (result.require_otp || result.requires_2fa) {
      return { data: { requires_2fa: true } };
    }

    // Store token and return in expected format
    if (result.access_token) {
      this.setToken(result.access_token);
      
      // Get user info
      const userResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${result.access_token}`
        }
      });
      
      const user = await userResponse.json();
      
      return {
        data: {
          token: result.access_token,
          user: user
        }
      };
    }

    return result;
  }

  async loginVerifyOTP(email: string, otp: string): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/login-verify-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, otp })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'OTP verification failed');
    }

    // Store token and return in expected format
    if (result.access_token) {
      this.setToken(result.access_token);
      
      // Get user info
      const userResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${result.access_token}`
        }
      });
      
      const user = await userResponse.json();
      
      return {
        data: {
          token: result.access_token,
          user: user
        }
      };
    }

    return result;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to send reset email');
    }
    return result;
  }

  async resetPasswordOTP(data: ResetPasswordRequest): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/reset-password-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: data.email,
        otp: data.otp,
        new_password: data.newPassword
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Password reset failed');
    }
    return result;
  }

  async googleAuth(credential: string): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ token: credential })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Google auth failed');
    }

    // Store token
    if (result.access_token) {
      this.setToken(result.access_token);
    }

    return result;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to get user');
    }
    return result;
  }

  async logout(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(true)
      });
      
      await response.json();
    } finally {
      this.removeToken();
    }
  }

  async enable2FA(): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/enable-2fa`, {
      method: 'POST',
      headers: this.getHeaders(true)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to enable 2FA');
    }
    return result;
  }

  async disable2FA(): Promise<any> {
    const response = await fetch(`${API_BASE}/auth/disable-2fa`, {
      method: 'POST',
      headers: this.getHeaders(true)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to disable 2FA');
    }
    return result;
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
