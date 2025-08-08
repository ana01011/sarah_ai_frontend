import React, { useState } from 'react';
import { Agent } from '../types/Agent';
import { useTheme } from '../contexts/ThemeContext';
import { CEODashboard } from './dashboards/CEODashboard';
import { CTODashboard } from './dashboards/CTODashboard';
import { AIChat } from './AIChat';

interface AgentDashboardProps {
  agent: Agent;
  onBack: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ agent, onBack }) => {
  const { setTheme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Set agent-specific theme
  React.useEffect(() => {
    setTheme(agent.themeId);
  }, [agent.themeId, setTheme]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const renderDashboard = () => {
    const props = { agent, onBack, onOpenChat: handleOpenChat };
    
    switch (agent.id) {
      case 'ceo':
        return <CEODashboard {...props} />;
      case 'cto':
        return <CTODashboard {...props} />;
      default:
        // Generic dashboard for other agents
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-4 mb-8">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  ←
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{agent.avatar}</div>
                  <div>
                    <h1 className="text-2xl font-bold">{agent.name}</h1>
                    <p className="text-gray-400">{agent.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4">Dashboard Coming Soon</h2>
                <p className="text-gray-400 mb-8">
                  Specialized dashboard for {agent.role} is under development
                </p>
                <button
                  onClick={handleOpenChat}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Chat with {agent.name}
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderDashboard()}
      <AIChat 
        isOpen={isChatOpen} 
        onClose={handleCloseChat}
        agentContext={agent}
      />
    </>
  );
};