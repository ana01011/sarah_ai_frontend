import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const GoogleLoginButton: React.FC = () => {
  const { loginWithGoogle, error, isLoading } = useAuth();
  const { currentTheme } = useTheme();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleError = () => {
    console.error('Google login failed');
  };

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
          theme={currentTheme.id === 'light' ? 'outline' : 'filled_blue'}
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};