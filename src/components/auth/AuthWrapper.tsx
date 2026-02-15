import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { VerifyEmailPage } from './VerifyEmailPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { TwoFactorPage } from './TwoFactorPage';
import { GlobalLoader } from '../ui/GloabalLoader';

interface AuthWrapperProps {
  children: React.ReactNode;
}

type AuthView = 'login' | 'register' | 'verify' | 'forgot-password' | '2fa';

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading, twoFactorRequired } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>('login');
  
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const MIN_LOADING_TIME = 1500;

    if (!authLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, MIN_LOADING_TIME);

      return () => clearTimeout(timer);
    } else {
      setShowLoader(true);
    }
  }, [authLoading]);

  if (authLoading || showLoader) {
    return <GlobalLoader />;
  }

  if (!isAuthenticated) {
    if (twoFactorRequired) {
      return (
        <TwoFactorPage
          onSwitchToLogin={() => setCurrentView('login')}
          onVerificationSuccess={() => {}}
        />
      );
    }

    switch (currentView) {
      case 'register':
        return (
          <RegisterPage
            onSwitchToLogin={() => setCurrentView('login')}
            onSwitchToVerify={() => setCurrentView('verify')}
          />
        );
      case 'verify':
        return (
          <VerifyEmailPage
            onSwitchToLogin={() => setCurrentView('login')}
            onVerificationSuccess={() => {}}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onSwitchToLogin={() => setCurrentView('login')}
            onSwitchToVerify={() => setCurrentView('verify')}
          />
        );
      case '2fa':
        return (
          <TwoFactorPage
            onSwitchToLogin={() => setCurrentView('login')}
            onVerificationSuccess={() => {}}
          />
        );
      default:
        return (
          <LoginPage
            onSwitchToRegister={() => setCurrentView('register')}
            onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
            onSwitchTo2FA={() => setCurrentView('2fa')}
          />
        );
    }
  }

  return <>{children}</>;
};