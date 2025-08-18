import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const GoogleLoginButton: React.FC = () => {
  const { loginWithGoogle, loginWithTestCredentials, error, isLoading } = useAuth();
  const { currentTheme } = useTheme();
  const [showTestLogin, setShowTestLogin] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await loginWithGoogle(credentialResponse);
    } catch (error) {
      console.error('Google login failed:', error);
      setShowTestLogin(true);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setShowTestLogin(true);
  };

  const handleTestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithTestCredentials(testCredentials.email, testCredentials.password);
    } catch (error) {
      console.error('Test login failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      {!showTestLogin ? (
        <div className="space-y-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            width="100%"
            text="signin_with"
          />
          
          <div className="text-center">
            <button
              onClick={() => setShowTestLogin(true)}
              className="text-sm hover:underline transition-colors"
              style={{ color: currentTheme.colors.primary }}
            >
              Use test credentials instead
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Google login unavailable. Use test credentials:
            </p>
            <p className="text-xs mt-1" style={{ color: currentTheme.colors.textSecondary }}>
              Email: test@250323 | Password: Ahmed@250323
            </p>
          </div>

          <form onSubmit={handleTestLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                Email
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
                <input
                  type="email"
                  name="email"
                  value={testCredentials.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                  placeholder="test@250323"
                />
              </div>
            </div>

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
                  value={testCredentials.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                  placeholder="Ahmed@250323"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 
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
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Sign In with Test Credentials</span>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setShowTestLogin(false)}
              className="text-sm hover:underline transition-colors"
              style={{ color: currentTheme.colors.primary }}
            >
              Back to Google Login
            </button>
          </div>
        </div>
      )}

      {error && (
        <div 
          className="p-3 rounded-lg border text-sm"
          style={{
            backgroundColor: currentTheme.colors.error + '20',
            borderColor: currentTheme.colors.error + '50',
            color: currentTheme.colors.error
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};