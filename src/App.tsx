import React from 'react';
import { useState } from 'react';
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
    <>
      {showWelcome ? (
        <WelcomeScreen onEnter={handleEnterDashboard} />
      ) : (
        <Dashboard onBackToWelcome={handleBackToWelcome} />
      )}
    </>
  );
}

export default App;