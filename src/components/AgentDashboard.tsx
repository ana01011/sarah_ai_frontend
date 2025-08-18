import React from 'react';
import { ArrowLeft, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAgent } from '../contexts/AgentContext';
import { ChatContainer } from './Chat/ChatContainer';

export const AgentDashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const { selectedAgent, setCurrentView } = useAgent();

  if (!selectedAgent) {
    return null;
  }

  const handleBack = () => {
    setCurrentView('selector');
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Header */}
      <header 
        className="backdrop-blur-md border-b sticky top-0 z-40"
        style={{ 
          backgroundColor: currentTheme.colors.surface + '80',
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-xl sm:text-2xl">{selectedAgent.avatar}</div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold" style={{ color: currentTheme.colors.text }}>
                    {selectedAgent.name}
                  </h1>
                  <p className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {selectedAgent.role} • {selectedAgent.department}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div 
                className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: currentTheme.colors.success + '20',
                  color: currentTheme.colors.success
                }}
              >
                Online
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-70px)] sm:h-[calc(100vh-80px)]">
        <ChatContainer 
          isIntegrated={true}
          agentContext={selectedAgent}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};