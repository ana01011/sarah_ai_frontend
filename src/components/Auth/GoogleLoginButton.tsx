import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const GoogleLoginButton: React.FC = () => {
  const { loginWithGoogle, loginWithTestCredentials, error, isLoading } = useAuth();
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
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="large"
              width="100%"
              text="signin_with"
            />
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowTestLogin(true)}
              className="text-sm text-blue-500 hover:text-blue-400 hover:underline transition-colors"
            >
              Use test credentials instead
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-amber-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Google login unavailable</span>
            </div>
            <p className="text-xs mt-1 text-amber-600">
              Use test credentials: <strong>test@250323</strong> | <strong>Ahmed@250323</strong>
            </p>
          </div>

          <form onSubmit={handleTestLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={testCredentials.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="test@250323"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={testCredentials.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ahmed@250323"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Sign In with Test Credentials</span>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setShowTestLogin(false)}
              className="text-sm text-blue-500 hover:text-blue-400 hover:underline transition-colors"
            >
              Back to Google Login
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};