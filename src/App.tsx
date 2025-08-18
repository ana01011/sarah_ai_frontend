import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AgentProvider } from './contexts/AgentContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { useAgent } from './contexts/AgentContext';
import { useAuth } from './contexts/AuthContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';

const AppContent: React.FC = () => {
  const { currentView } = useAgent();
  const { isAuthenticated } = useAuth();

  switch (currentView) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'dashboard':
      return <Dashboard />;
    case 'selector':
      return <AgentSelector />;
    case 'agent':
      return <AgentDashboard />;
    default:
      return <WelcomeScreen />;
  }
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AgentProvider>
          <div className="min-h-screen transition-colors">
            <AuthWrapper>
              <AppContent />
            </AuthWrapper>
          </div>
        </AgentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;