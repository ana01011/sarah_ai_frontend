import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

// Declare global google object
declare global {
  interface Window {
    google: any;
  }
}

export const LoginPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const { login, error, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '136426881868-agle26pe3r9ii73jcjal39b80iss1k2o.apps.googleusercontent.com',
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Trigger the Google One Tap prompt
      window.google.accounts.id.prompt();
    } else {
      console.error('Google Identity Services not loaded');
      alert('Google login is temporarily unavailable. Please try again later.');
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(googleUser));
      localStorage.setItem('token', response.credential);
      
      // Trigger auth context update
      window.location.reload();
      
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[15rem] sm:w-[30rem] h-[15rem] sm:h-[30rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[13rem] sm:w-[26rem] h-[13rem] sm:h-[26rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[14rem] sm:w-[28rem] h-[14rem] sm:h-[28rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-2 sm:mb-4">
          
          <h1 
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent mb-1 sm:mb-2"
            style={{
              backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            }}
          >
            SARAH
          </h1>
          
          <p className="text-xs sm:text-sm font-light mb-1 sm:mb-2" style={{ color: currentTheme.colors.textSecondary }}>
            Advanced AI Operations Platform
          </p>
          
          <div className="flex items-center justify-center space-x-1 sm:space-x-2" style={{ color: currentTheme.colors.secondary }}>
            <Sparkles className="w-3 h-3 animate-spin" />
            <span className="text-xs sm:text-sm font-mono">Secure Access Portal</span>
            <Sparkles className="w-3 h-3 animate-spin" />
          </div>
        </div>

        <div 
          className="backdrop-blur-xl border rounded-2xl p-3 sm:p-4 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
            borderColor: currentTheme.colors.border,
            boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
          }}
        >
          {error && (
            <div 
              className="mb-2 sm:mb-3 p-2 rounded-xl border"
              style={{
                backgroundColor: currentTheme.colors.error + '20',
                borderColor: currentTheme.colors.error + '50',
                color: currentTheme.colors.error
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    fontSize: '16px'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.border;
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
                  }}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-10 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    fontSize: '16px'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.border;
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 
                       hover:scale-[1.02] active:scale-95 hover:shadow-xl
                       flex items-center justify-center space-x-3 group relative overflow-hidden
                       backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                color: currentTheme.id === 'light' ? '#ffffff' : currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
                boxShadow: `0 10px 25px -5px ${currentTheme.shadows.primary}`
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}
              />
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm">Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: currentTheme.colors.border }}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span 
                className="bg-transparent px-2" 
                style={{ 
                  color: currentTheme.colors.textSecondary,
                  backgroundColor: currentTheme.colors.surface + 'f0'
                }}
              >
                or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            id="google-signin-button"
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-300 
                     hover:scale-[1.02] active:scale-95 hover:shadow-lg
                     flex items-center justify-center space-x-3 group relative overflow-hidden
                     backdrop-blur-sm border"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text,
              boxShadow: `0 4px 12px -4px ${currentTheme.shadows.secondary}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.surface + 'a0';
              e.currentTarget.style.borderColor = currentTheme.colors.primary + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
              e.currentTarget.style.borderColor = currentTheme.colors.border;
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}
            />
            
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            
            <span className="text-sm relative z-10">Continue with Google</span>
          </button>

          {/* Footer Note */}
          <p className="mt-2 text-center text-xs" style={{ color: currentTheme.colors.textSecondary }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};