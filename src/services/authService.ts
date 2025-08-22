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

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors || {}
      };
    }

    return data;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<{ email: string }>> {
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

    return this.handleResponse(response);
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async resendOTP(email: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email })
    });

    return this.handleResponse(response);
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async loginVerifyOTP(email: string, otp: string): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE}/auth/login-verify-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, otp })
    });

    return this.handleResponse(response);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  async resetPasswordOTP(data: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/auth/reset-password-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: data.email,
        otp: data.otp,
        new_password: data.newPassword
      })
    });

    return this.handleResponse(response);
  }

  async googleAuth(credential: string): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ credential })
    });

    return this.handleResponse(response);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });

    return this.handleResponse(response);
  }

  async logout(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(true)
    });

    return this.handleResponse(response);
  }

  async enable2FA(): Promise<ApiResponse<{ qr_code: string; backup_codes: string[] }>> {
    const response = await fetch(`${API_BASE}/auth/enable-2fa`, {
      method: 'POST',
      headers: this.getHeaders(true)
    });

    return this.handleResponse(response);
  }

  async disable2FA(otp: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/auth/disable-2fa`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ otp })
    });

    return this.handleResponse(response);
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
}

export const authService = new AuthService();