import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const { login, error, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: 'test@250323',
    password: 'Ahmed@250323'
  });
  const [showPassword, setShowPassword] = useState(false);

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
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[40rem] h-[40rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[36rem] h-[36rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[38rem] h-[38rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div 
              className="absolute -inset-6 rounded-full blur-2xl opacity-40 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
            />
            <Brain 
              className="w-16 h-16 mx-auto relative animate-pulse" 
              style={{ color: currentTheme.colors.primary }}
            />
          </div>
          
          <h1 
            className="text-4xl font-bold bg-clip-text text-transparent mb-2"
            style={{
              backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            }}
          >
            SARAH
          </h1>
          
          <p className="text-lg font-light mb-2" style={{ color: currentTheme.colors.textSecondary }}>
            Welcome Back
          </p>
          
          <div className="flex items-center justify-center space-x-2" style={{ color: currentTheme.colors.secondary }}>
            <Sparkles className="w-4 h-4 animate-spin" />
          {/* Test Credentials Info */}
          <div 
            className="mb-6 p-4 rounded-xl border"
            style={{
              backgroundColor: currentTheme.colors.info + '20',
              borderColor: currentTheme.colors.info + '50',
              color: currentTheme.colors.info
            }}
          >
            <p className="text-sm font-medium mb-1">Test Credentials:</p>
            <p className="text-xs">Email: test@250323</p>
            <p className="text-xs">Password: Ahmed@250323</p>
          </div>

          {error && (
            <div 
              className="mb-6 p-4 rounded-xl border"
              style={{
                backgroundColor: currentTheme.colors.error + '20',
                borderColor: currentTheme.colors.error + '50',
                color: currentTheme.colors.error
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
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
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 
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
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
  )
}