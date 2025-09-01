import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/Auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ requires2FA?: boolean }>;
  register: (data: any) => Promise<{ email: string }>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  loginVerifyOTP: (email: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string, confirmPassword: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  enable2FA: () => Promise<{ qr_code: string; backup_codes: string[] }>;
  disable2FA: (otp: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setVerificationEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    verificationEmail: null,
    twoFactorRequired: false
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = authService.getToken();
      const savedUser = authService.getUser();

      if (token && savedUser) {
        // Verify token is still valid
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setState(prev => ({
            ...prev,
            user: response.data!,
            token,
            isAuthenticated: true,
            isLoading: false
          }));
          return;
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authService.removeToken();
    }

    setState(prev => ({
      ...prev,
      isLoading: false
    }));
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login({ email, password, rememberMe });
      
      if (response.data?.requires_2fa) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          twoFactorRequired: true,
          verificationEmail: email
        }));
        return { requires2FA: true };
      }

      if (response.data?.token && response.data?.user) {
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        
        setState(prev => ({
          ...prev,
          user: response.data!.user,
          token: response.data!.token,
          isAuthenticated: true,
          isLoading: false,
          twoFactorRequired: false
        }));
      }

      return {};
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Login failed',
        isLoading: false
      }));
      throw error;
    }
  };

  const register = async (data: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.register(data);
      setState(prev => ({
        ...prev,
        isLoading: false,
        verificationEmail: data.email
      }));
      return { email: data.email };
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Registration failed',
        isLoading: false
      }));
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.verifyOTP({ email, otp });
      
      if (response.data?.token && response.data?.user) {
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        
        setState(prev => ({
          ...prev,
          user: response.data!.user,
          token: response.data!.token,
          isAuthenticated: true,
          isLoading: false,
          verificationEmail: null
        }));
      } else if (response.access_token) {
        // Handle direct token response from backend
        authService.setToken(response.access_token);
        
        // Get user info
        try {
          const userResponse = await authService.getCurrentUser();
          authService.setUser(userResponse);
          
          setState(prev => ({
            ...prev,
            user: userResponse,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            verificationEmail: null
          }));
        } catch (userError) {
          console.error('Error getting user after OTP verification:', userError);
          setState(prev => ({
            ...prev,
            error: 'Failed to get user information',
            isLoading: false
          }));
          throw userError;
        }
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'OTP verification failed',
        isLoading: false
      }));
      throw error;
    }
  };

  const resendOTP = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authService.resendOTP(email);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to resend OTP',
        isLoading: false
      }));
      throw error;
    }
  };

  const loginVerifyOTP = async (email: string, otp: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.loginVerifyOTP(email, otp);
      
      if (response.data?.token && response.data?.user) {
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        
        setState(prev => ({
          ...prev,
          user: response.data!.user,
          token: response.data!.token,
          isAuthenticated: true,
          isLoading: false,
          twoFactorRequired: false,
          verificationEmail: null
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || '2FA verification failed',
        isLoading: false
      }));
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authService.forgotPassword({ email });
      setState(prev => ({
        ...prev,
        isLoading: false,
        verificationEmail: email
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to send reset code',
        isLoading: false
      }));
      throw error;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string, confirmPassword: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authService.resetPasswordOTP({ email, otp, newPassword, confirmPassword });
      setState(prev => ({
        ...prev,
        isLoading: false,
        verificationEmail: null
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Password reset failed',
        isLoading: false
      }));
      throw error;
    }
  };

  const googleLogin = async (credential: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.googleAuth(credential);
      
      if (response.data?.token && response.data?.user) {
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        
        setState(prev => ({
          ...prev,
          user: response.data!.user,
          token: response.data!.token,
          isAuthenticated: true,
          isLoading: false
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Google login failed',
        isLoading: false
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        verificationEmail: null,
        twoFactorRequired: false
      });
    }
  };

  const enable2FA = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.enable2FA();
      setState(prev => ({ ...prev, isLoading: false }));
      return response.data!;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to enable 2FA',
        isLoading: false
      }));
      throw error;
    }
  };

  const disable2FA = async (otp: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await authService.disable2FA(otp);
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, two_factor_enabled: false } : null,
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to disable 2FA',
        isLoading: false
      }));
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null
    }));
    
    if (state.user) {
      authService.setUser({ ...state.user, ...userData });
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const setVerificationEmail = (email: string) => {
    setState(prev => ({ ...prev, verificationEmail: email }));
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      verifyOTP,
      resendOTP,
      loginVerifyOTP,
      forgotPassword,
      resetPassword,
      googleLogin,
      logout,
      enable2FA,
      disable2FA,
      updateUser,
      clearError,
      setVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};