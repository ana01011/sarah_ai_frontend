import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AgentProvider } from './contexts/AgentContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <AgentProvider>
            <div className="min-h-screen transition-colors">
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            </div>
          </AgentProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;