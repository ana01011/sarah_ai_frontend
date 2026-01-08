import React from 'react';
import { Brain, Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAgent } from '../contexts/AgentContext';

export const WelcomeScreen: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setCurrentView } = useAgent();

  const handleGetStarted = () => {
    setCurrentView('dashboard');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[40rem] h-[40rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[36rem] h-[36rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[38rem] h-[38rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo and Branding */}
        <div className="mb-12">
          <div className="relative inline-block mb-8">
            <div 
              className="absolute -inset-8 rounded-full blur-3xl opacity-40 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
            />
            <Brain 
              className="w-24 h-24 mx-auto relative animate-pulse" 
              style={{ color: currentTheme.colors.primary }}
            />
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent mb-4"
            style={{
              backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            }}
          >
            {/* SARAH */}
            AMESIE
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl font-light mb-3" style={{ color: currentTheme.colors.textSecondary }}>
            Advanced AI Operations Platform
          </p>
          
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6" style={{ color: currentTheme.colors.secondary }}>
            <Sparkles className="w-6 h-6 animate-spin" />
            <span className="text-sm sm:text-base md:text-lg font-mono">Intelligent • Adaptive • Powerful</span>
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="group relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 
                   hover:scale-105 active:scale-95 hover:shadow-2xl
                   flex items-center justify-center space-x-4 mx-auto
                   backdrop-blur-sm border overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
            color: currentTheme.id === 'light' ? '#ffffff' : currentTheme.colors.text,
            borderColor: currentTheme.colors.border,
            boxShadow: `0 20px 40px -10px ${currentTheme.shadows.primary}`
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}
          />
          <span className="relative z-10">Enter AMESIE</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
        </button>

        <p className="mt-4 text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
          Experience the future of AI-powered operations
        </p>
      </div>
    </div>
  );
};