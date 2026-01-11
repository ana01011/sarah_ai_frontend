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
import { AmesieOrders } from './components/amesie/AmesieOrders';
import { AmesieMenu } from './components/amesie/AmesieMenu';
import { AmesieProfile } from './components/AmesieProfile';

const AppContent: React.FC = () => {
  const { currentView } = useAgent();
  const { currentTheme } = useTheme();

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: currentTheme.colors.background }}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"> */}
        <div className="h-full w-full">
          {(() => {
            switch (currentView) {
              case 'welcome': return <WelcomeScreen />;
              case 'dashboard': return <Dashboard />;
              case 'selector': return <AgentSelector />;
              case 'agent': return <AgentDashboard />;
              case 'amesie-dashboard':return <AmesieDashboard />;
              case 'amesie-orders':return <AmesieOrders />;
              case 'amesie-menu':return <AmesieMenu />;
              case 'profile':return <AmesieProfile />;                
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