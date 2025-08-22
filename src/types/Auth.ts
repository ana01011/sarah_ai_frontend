export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  gender?: 'male' | 'female' | 'neutral';
  is_verified: boolean;
  two_factor_enabled: boolean;
  personality: 'sarah' | 'xhash' | 'neutral';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  verificationEmail: string | null;
  twoFactorRequired: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  name?: string;
  gender?: 'male' | 'female' | 'neutral';
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  user: User;
  token: string;
  requires_2fa?: boolean;
}