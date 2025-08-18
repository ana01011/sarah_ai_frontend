import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AgentProvider } from './contexts/AgentContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginPage } from './components/Auth/LoginPage';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { useAuth } from './contexts/AuthContext';
import { useAgent } from './contexts/AgentContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '83902002509-b3phug3coahs2gocijeifkrbpdmh5et7.apps.googleusercontent.com';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { currentView, setCurrentView } = useAgent();
  const [showWelcome, setShowWelcome] = React.useState(true);

  React.useEffect(() => {
    const hasVisited = localStorage.getItem('sarah-has-visited');
    if (hasVisited) {
      setShowWelcome(false);
    }
  }, []);

  const handleEnterDashboard = () => {
    localStorage.setItem('sarah-has-visited', 'true');
    setShowWelcome(false);
    setCurrentView('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (showWelcome) {
    return <WelcomeScreen onEnter={handleEnterDashboard} />;
  }

  switch (currentView) {
    case 'selector':
      return <AgentSelector />;
    case 'agent-dashboard':
      return <AgentDashboard />;
    case 'dashboard':
    default:
      return <Dashboard />;
  }
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <AgentProvider>
            <AppContent />
          </AgentProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;