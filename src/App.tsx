import React from 'react';
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AgentProvider } from './contexts/AgentContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { useAgent } from './contexts/AgentContext';

const AppContent: React.FC = () => {
  const { selectedAgent } = useAgent();
  const [showWelcome, setShowWelcome] = useState(true);

  const handleEnterSystem = () => {
    setShowWelcome(false);
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
  };

  const handleBackToSelector = () => {
    // This will be handled by the AgentSelector component
  };

  if (showWelcome) {
    return <WelcomeScreen onEnter={handleEnterSystem} />;
  }

  if (selectedAgent) {
    return <AgentDashboard agent={selectedAgent} onBack={() => window.location.reload()} />;
  }

  return <AgentSelector />;
};

import { AgentProvider } from './contexts/AgentContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { useAgent } from './contexts/AgentContext';

const AppContent: React.FC = () => {
  const { selectedAgent } = useAgent();
  const [showWelcome, setShowWelcome] = useState(true);

  const handleEnterSystem = () => {
    setShowWelcome(false);
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
  };

  const handleBackToSelector = () => {
    // This will be handled by the AgentSelector component
  };

  if (showWelcome) {
    return <WelcomeScreen onEnter={handleEnterSystem} />;
  }

  if (selectedAgent) {
    return <AgentDashboard agent={selectedAgent} onBack={() => window.location.reload()} />;
  }

  return <AgentSelector />;
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