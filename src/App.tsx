import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AgentProvider } from './contexts/AgentContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { useAuth } from './contexts/AuthContext';
import { useAgent } from './contexts/AgentContext';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { currentView } = useAgent();

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  switch (currentView) {
    case 'selector':
      return <AgentSelector />;
    case 'agent':
      return <AgentDashboard />;
    case 'dashboard':
    default:
      return <Dashboard />;
  }
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