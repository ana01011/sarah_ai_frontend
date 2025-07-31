import React from 'react';
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleEnterDashboard = () => {
    setShowWelcome(false);
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
  };

  return (
    <ThemeProvider>
      <>
        {showWelcome ? (
          <WelcomeScreen onEnter={handleEnterDashboard} />
        ) : (
          <Dashboard onBackToWelcome={handleBackToWelcome} />
        )}
      </>
    </ThemeProvider>
  );
}

export default App;