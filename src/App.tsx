import React from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AgentProvider, useAgent } from './contexts/AgentContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { Sidebar } from './components/Sidebar';
import { AmesieDashboard } from './components/amesie/AmesieDashboard';

const AppContent: React.FC = () => {
  const { currentView } = useAgent();
  const { currentTheme } = useTheme();

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: currentTheme.colors.background }}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {(() => {
            switch (currentView) {
              case 'welcome': return <WelcomeScreen />;
              case 'dashboard': return <Dashboard />;
              case 'selector': return <AgentSelector />;
              case 'agent': return <AgentDashboard />;
              case 'amesie-dashboard':return <AmesieDashboard />;
              
              case 'amesie-orders':
                return <div className="text-center py-20" style={{ color: currentTheme.colors.text }}>Amesie Orders Coming Soon</div>;
              case 'amesie-menu':
                return <div className="text-center py-20" style={{ color: currentTheme.colors.text }}>Amesie Menu Coming Soon</div>;
              case 'profile':
                return <div className="text-center py-20" style={{ color: currentTheme.colors.text }}>Profile Page Coming Soon</div>;
                
              default: return <WelcomeScreen />;
            }
          })()}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AgentProvider>
          <AuthWrapper>
            <AppContent />
          </AuthWrapper>
        </AgentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;