import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AgentProvider, useAgent } from './contexts/AgentContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { AuthWrapper } from './components/auth/AuthWrapper';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { currentView, setCurrentView } = useAgent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeScreen onEnter={() => setCurrentView('dashboard')} isFirstTime={user?.isFirstTime} />;
      case 'dashboard':
        return <Dashboard />;
      case 'selector':
        return <AgentSelector />;
      case 'agent-dashboard':
        return <AgentDashboard />;
      default:
        return <WelcomeScreen 
          onEnter={() => setCurrentView('dashboard')} 
          isFirstTime={user?.isFirstTime} 
        />;
    }
  };

  return renderCurrentView();
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AgentProvider>
          <AppContent />
        </AgentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;