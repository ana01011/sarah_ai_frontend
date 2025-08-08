import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AgentProvider, useAgent } from './contexts/AgentContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useAgent();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeScreen onEnter={() => setCurrentView('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'selector':
        return <AgentSelector />;
      case 'agent-dashboard':
        return <AgentDashboard />;
      default:
        return <WelcomeScreen onEnter={() => setCurrentView('dashboard')} />;
    }
  };

  return renderCurrentView();
};

function App() {
  return (
    <ThemeProvider>
      <AgentProvider>
        <AppContent />
      </AgentProvider>
    </ThemeProvider>
  );
}

export default App;