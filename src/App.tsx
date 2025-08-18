import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { ChatPage } from './pages/Chat';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      </div>
    </ThemeProvider>
  );
}

export default App;