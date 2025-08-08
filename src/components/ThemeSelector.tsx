import React, { useState } from 'react';
import { Palette, Check, Sun, Moon, Zap, Waves, Sunset, Circle, Lightbulb, Crown, Code, DollarSign, Megaphone, Settings, Users, Briefcase, Brain, Smartphone, Database, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const themeIcons = {
  dark: Moon,
  light: Sun,
  'simple-dark': Circle,
  'simple-light': Lightbulb,
  neon: Zap,
  ocean: Waves,
  sunset: Sunset,
  'executive-gold': Crown,
  'tech-blue': Code,
  'finance-green': DollarSign,
  'marketing-purple': Megaphone,
  'operations-orange': Settings,
  'product-teal': Users,
  'manager-brown': Briefcase,
  'developer-dark': Code,
  'ai-neural': Brain,
  'frontend-pink': Smartphone,
  'backend-slate': Database,
  'data-cyan': BarChart3,
};

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 group"
        style={{ 
          backgroundColor: isOpen ? currentTheme.colors.primary + '20' : 'transparent',
          borderColor: isOpen ? currentTheme.colors.primary + '50' : 'transparent'
        }}
      >
        <Palette 
          className="w-5 h-5 transition-colors duration-200" 
          style={{ color: isOpen ? currentTheme.colors.primary : currentTheme.colors.textSecondary }}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-80 sm:w-96 backdrop-blur-md border rounded-2xl p-4 sm:p-6 shadow-2xl z-[9999] animate-fade-in"
          style={{ 
            backgroundColor: currentTheme.colors.surface + 'f0',
            borderColor: currentTheme.colors.border,
            boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
          }}
        >
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
              Choose Theme
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Select a theme that matches your personality
            </p>
          </div>

          <div className="space-y-3">
            {themes.map((theme) => {
              const Icon = themeIcons[theme.id as keyof typeof themeIcons];
              const isSelected = currentTheme.id === theme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className="w-full p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden"
                  style={{
                    backgroundColor: isSelected 
                      ? theme.colors.primary + '20' 
                      : theme.colors.surface + '80',
                    borderColor: isSelected 
                      ? theme.colors.primary + '50' 
                      : theme.colors.border,
                    boxShadow: isSelected 
                      ? `0 8px 25px -8px ${theme.shadows.primary}` 
                      : 'none'
                  }}
                >
                  {/* Animated background effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`
                    }}
                  />
                  
                  <div className="relative z-10 flex items-center space-x-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: theme.colors.primary + '20' }}
                      >
                        <Icon 
                          className="w-4 h-4 sm:w-5 sm:h-5" 
                          style={{ color: theme.colors.primary }}
                        />
                      </div>
                      
                      <div className="text-left">
                        <h4 
                          className="font-semibold text-xs sm:text-sm"
                          style={{ color: theme.colors.text }}
                        >
                          {theme.name}
                        </h4>
                        <p 
                          className="text-xs hidden sm:block"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {theme.description}
                        </p>
                      </div>
                    </div>

                    {/* Color preview */}
                    <div className="flex space-x-1">
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>

                    {isSelected && (
                      <div 
                        className="p-1 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <p className="text-xs text-center hidden sm:block" style={{ color: currentTheme.colors.textSecondary }}>
              Theme preferences are saved automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
};