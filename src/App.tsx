import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AgentProvider, useAgent } from './contexts/AgentContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { AgentSelector } from './components/agent/AgentSelector';
import { AgentDashboard } from './components/AgentDashboard';
import { Sidebar } from './components/Sidebar';
import { AmesieDashboard } from './components/amesie/AmesieDashboard';
import { AmesieOrders } from './components/amesie/AmesieOrders';
import { AmesieMenu } from './components/amesie/AmesieMenu';
import AmesieProfile from './components/amesie/profile';
import { Menu } from 'lucide-react';
import { AgentChat } from './components/agent/AgentChat';

const AppContent: React.FC = () => {
  const { currentView } = useAgent();
  const { currentTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: currentTheme.colors.background }}>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed z-[100] p-2.5 bg-white/90 backdrop-blur-md shadow-sm border border-slate-200 text-slate-600 transition-all active:scale-95 hover:bg-white hover:text-slate-900"
          style={{ borderColor: currentTheme.colors.border }}
        >
          <Menu size={20} />
        </button>

        <div className="flex-1 min-h-0 relative">
          <div className="h-full w-full">
            {(() => {
              switch (currentView as any) {
                case 'welcome': return <WelcomeScreen />;
                case 'dashboard': return <Dashboard />;
                case 'selector': return <AgentSelector />;
                case 'agent': return <AgentDashboard />;
                case 'chat': return <AgentChat />;
                case 'amesie-dashboard': return <AmesieDashboard />;
                case 'amesie-orders': return <AmesieOrders />;
                case 'amesie-menu': return <AmesieMenu />;
                case 'profile': return <AmesieProfile />;
                default: return <WelcomeScreen />;
              }
            })()}
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AgentProvider>
        <AuthProvider>
          <AuthWrapper>
            <AppContent />
          </AuthWrapper>
        </AuthProvider>
      </AgentProvider>
    </ThemeProvider>
  );
}

export default App;