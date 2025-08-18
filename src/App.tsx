import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AgentProvider, useAgent } from './contexts/AgentContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { ChatPage } from './pages/ChatPage';

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

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            currentView === 'welcome' ? (
              <WelcomeScreen onEnter={() => setCurrentView('dashboard')} isFirstTime={user?.isFirstTime} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={<Dashboard />} 
        />
        <Route 
          path="/chat" 
          element={<ChatPage />} 
        />
        <Route 
          path="/agents" 
          element={<AgentSelector />} 
        />
        <Route 
          path="/agent-dashboard" 
          element={<AgentDashboard />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/dashboard" replace />} 
        />
      </Routes>
    </Router>
  );
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