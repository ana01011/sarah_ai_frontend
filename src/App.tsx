import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AgentProvider } from './contexts/AgentContext';
import { AuthProvider } from './contexts/AuthContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { useAuth } from './contexts/AuthContext';
import { useAgent } from './contexts/AgentContext';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { currentView } = useAgent();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (user) {
      const hasVisited = localStorage.getItem('sarah-has-visited');
      if (!hasVisited) {
        setShowWelcome(true);
        localStorage.setItem('sarah-has-visited', 'true');
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading Sarah AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthWrapper />;
  }

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onEnter={() => setShowWelcome(false)} 
        isFirstTime={true}
      />
    );
  }

  switch (currentView) {
    case 'welcome':
      return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
    case 'selector':
      return <AgentSelector />;
    case 'agent-dashboard':
      return <AgentDashboard />;
    default:
      return <Dashboard />;
  }
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AgentProvider>
          <AppContent />
        </AgentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;