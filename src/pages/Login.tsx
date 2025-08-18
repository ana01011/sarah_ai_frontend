import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLoginButton } from '../components/Auth/GoogleLoginButton';
import { Logo } from '../components/Common/Logo';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { handleGoogleSuccess, handleDummyLogin } = useAuth();
  const [showDummyLogin, setShowDummyLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const onGoogleSuccess = async (credentialResponse: any) => {
    const success = await handleGoogleSuccess(credentialResponse);
    if (!success) {
      console.error('Login failed');
    }
  };

  const onGoogleError = () => {
    console.error('Google login failed');
  };

  const handleDummySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await handleDummyLogin(username, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Sarah AI
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your intelligent AI assistant for everything
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Sign in to continue
                </h3>
                <GoogleLoginButton 
                  onSuccess={onGoogleSuccess}
                  onError={onGoogleError}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
                </div>
              </div>

              {!showDummyLogin ? (
                <button
                  onClick={() => setShowDummyLogin(true)}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Use test credentials
                </button>
              ) : (
                <form onSubmit={handleDummySubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </form>
              )}

              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Why sign in?
                </h4>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Save your chat history</li>
                  <li>• Access from any device</li>
                  <li>• Personalized AI responses</li>
                  <li>• Secure and private</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};