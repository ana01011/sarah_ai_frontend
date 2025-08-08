import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAgent } from '../contexts/AgentContext';
import { CEODashboard } from './dashboards/CEODashboard';
import { CTODashboard } from './dashboards/CTODashboard';
import { CFODashboard } from './dashboards/CFODashboard';
import { CMODashboard } from './dashboards/CMODashboard';
import { COODashboard } from './dashboards/COODashboard';
import { AIChat } from './AIChat';
import { useState, useEffect } from 'react';

export const AgentDashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const { selectedAgent, setCurrentView } = useAgent();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!selectedAgent) {
    setCurrentView('dashboard');
    return null;
  }

  // Apply the same background styling as main dashboard
  const dashboardStyle = {
    background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
    color: currentTheme.colors.text,
    minHeight: '100vh'
  };

  const renderSpecializedDashboard = () => {
    switch (selectedAgent.id) {
      case 'ceo':
        return <CEODashboard />;
      case 'cto':
        return <CTODashboard />;
      case 'cfo':
        return <CFODashboard />;
      case 'cmo':
        return <CMODashboard />;
      case 'coo':
        return <COODashboard />;
      default:
        return (
          <div 
            className="backdrop-blur-xl border rounded-2xl p-8 text-center"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="text-6xl mb-4">{selectedAgent.avatar}</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
              {selectedAgent.name}
            </h2>
            <p className="text-lg mb-4" style={{ color: currentTheme.colors.textSecondary }}>
              {selectedAgent.role}
            </p>
            <p className="mb-6" style={{ color: currentTheme.colors.textSecondary }}>
              {selectedAgent.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
                  {selectedAgent.metrics.performance}%
                </div>
                <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  Performance
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: currentTheme.colors.secondary }}>
                  {selectedAgent.metrics.efficiency}%
                </div>
                <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  Efficiency
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                Specialized Dashboard Coming Soon
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={dashboardStyle}
    >
      {/* Animated Background - Same as Main Dashboard */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[32rem] h-[32rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 w-[30rem] h-[30rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        ></div>
        <div 
          className="absolute -bottom-10 -right-10 w-[24rem] h-[24rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-3000"
          style={{ backgroundColor: currentTheme.colors.primary + '40' }}
        ></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className="backdrop-blur-md border-b mb-8 p-4 sm:p-6 rounded-t-2xl"
          style={{ 
            backgroundColor: currentTheme.colors.surface + '80',
            borderColor: currentTheme.colors.border
          }}
        >
          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-white/10"
              style={{ 
                backgroundColor: 'transparent'
              }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: currentTheme.colors.textSecondary }} />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedAgent.avatar}</div>
              <div>
                <h1 
                  className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                  }}
                >
                  {selectedAgent.name}
                </h1>
                <p className="text-sm sm:text-base" style={{ color: currentTheme.colors.textSecondary }}>
                  {selectedAgent.role} • {selectedAgent.department}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="relative group bg-gradient-to-r from-blue-500/20 to-emerald-500/20 
                     hover:from-blue-500/30 hover:to-emerald-500/30 border border-blue-500/30 
                     hover:border-emerald-500/50 rounded-xl px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 
                     hover:scale-110 active:scale-95 hover:shadow-xl hover:shadow-blue-500/30
                     backdrop-blur-sm overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
              borderColor: currentTheme.colors.primary + '50',
              boxShadow: `0 10px 25px -5px ${currentTheme.shadows.primary}`
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}
            />
            <div className="flex items-center space-x-2">
              <MessageCircle 
                className="w-4 h-4 sm:w-5 sm:h-5 transition-colors" 
                style={{ color: currentTheme.colors.primary }}
              />
              <span 
                className="text-sm sm:text-base font-semibold transition-colors relative z-10"
                style={{ color: currentTheme.colors.text }}
              >
                Chat with {selectedAgent.name.split(' ')[0]}
              </span>
            </div>
          </button>
          </div>
        </div>

        {/* Agent Info Bar */}
        <div 
          className="backdrop-blur-xl border rounded-2xl p-4 sm:p-6 mb-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
                {selectedAgent.metrics.performance}%
              </div>
              <div className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Performance
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold" style={{ color: currentTheme.colors.secondary }}>
                {selectedAgent.metrics.efficiency}%
              </div>
              <div className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Efficiency
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold" style={{ color: currentTheme.colors.accent }}>
                {selectedAgent.metrics.experience}%
              </div>
              <div className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold" style={{ color: currentTheme.colors.info }}>
                {selectedAgent.metrics.availability}%
              </div>
              <div className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Availability
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Chat Section */}
        <div 
          className="mb-8 backdrop-blur-xl border rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border,
            height: '400px'
          }}
        >
          <AIChat 
            isOpen={true} 
            onClose={() => {}} 
            agentContext={selectedAgent}
            isIntegrated={true}
          />
        </div>

        {/* Specialized Dashboard */}
        {renderSpecializedDashboard()}
        </div>
      </div>
    </div>
  );
};