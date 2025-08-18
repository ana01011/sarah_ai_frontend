import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLoginButton } from '../components/Auth/GoogleLoginButton';
import { Logo } from '../components/Common/Logo';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { handleGoogleSuccess } = useAuth();

  const onGoogleSuccess = async (credentialResponse: any) => {
    const success = await handleGoogleSuccess(credentialResponse);
    if (!success) {
      console.error('Login failed');
    }
  };

  const onGoogleError = () => {
    console.error('Google login failed');
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