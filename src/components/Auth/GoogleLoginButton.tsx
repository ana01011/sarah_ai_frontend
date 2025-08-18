import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const GoogleLoginButton: React.FC = () => {
  const { loginWithGoogle, error, isLoading } = useAuth();
  const { currentTheme } = useTheme();

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  const handleError = () => {
    console.error('Google login failed');
  };

  // Check if Google Client ID is configured
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    return (
      <div 
        className="p-4 rounded-lg border text-center"
        style={{
          backgroundColor: currentTheme.colors.warning + '20',
          borderColor: currentTheme.colors.warning + '50',
          color: currentTheme.colors.warning
        }}
      >
        <p className="text-sm mb-2">Google Client ID not configured</p>
        <p className="text-xs">
          Please add VITE_GOOGLE_CLIENT_ID to your environment variables
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div 
          className="mb-4 p-3 rounded-lg border text-sm"
          style={{
            backgroundColor: currentTheme.colors.error + '20',
            borderColor: currentTheme.colors.error + '50',
            color: currentTheme.colors.error
          }}
        >
          {error}
        </div>
      )}
      
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="filled_blue"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
          disabled={isLoading}
        />
      </div>
      
      {isLoading && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center space-x-2">
            <div 
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: currentTheme.colors.primary }}
            />
            <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Signing in...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};