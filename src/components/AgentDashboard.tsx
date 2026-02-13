import React, { useState } from 'react';
import { ArrowLeft, Star, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAgent } from '../contexts/AgentContext';
import { AIChat } from './AIChat';

export const AgentDashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const { selectedAgent, setCurrentView, setSelectedAgent } = useAgent();
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [newChatTrigger, setNewChatTrigger] = useState(0);

  const handleBack = () => {
    setSelectedAgent(null);
    setCurrentView('selector');
  };

  if (!selectedAgent) {
    return null;
  }

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[32rem] h-[32rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[30rem] h-[30rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div 
          className="backdrop-blur-md border-b p-4 sm:p-6 flex-shrink-0"
          style={{ 
            backgroundColor: currentTheme.colors.surface + '80',
            borderColor: currentTheme.colors.border
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: currentTheme.colors.textSecondary }} />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="text-4xl sm:text-5xl">{selectedAgent.avatar}</div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
                      {selectedAgent.name}
                    </h1>
                    <p className="text-sm sm:text-base" style={{ color: currentTheme.colors.primary }}>
                      {selectedAgent.role}
                    </p>
                    <p className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                      {selectedAgent.department} • {selectedAgent.level}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" style={{ color: currentTheme.colors.warning }} />
                      <span className="text-sm font-semibold" style={{ color: currentTheme.colors.text }}>
                        {selectedAgent.metrics.performance}%
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                      Performance
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" style={{ color: currentTheme.colors.secondary }} />
                      <span className="text-sm font-semibold" style={{ color: currentTheme.colors.text }}>
                        {selectedAgent.metrics.efficiency}%
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                      Efficiency
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" 
                       style={{ backgroundColor: currentTheme.colors.success }} />
                  <span className="text-sm" style={{ color: currentTheme.colors.success }}>
                    Online
                  </span>
                </div>
              </div>
            </div>
            
            {/* Agent Specialties */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedAgent.specialties.map((specialty, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: currentTheme.colors.primary + '20',
                    color: currentTheme.colors.primary
                  }}
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden">
          <AIChat 
            isOpen={true}
            onClose={() => {}}
            agentContext={selectedAgent}
            isIntegrated={true}
            showSidebar={showChatSidebar}
            onToggleSidebar={() => setShowChatSidebar(!showChatSidebar)}
            onNewChatTrigger={newChatTrigger}
          />
        </div>
      </div>
    </div>
  );
};