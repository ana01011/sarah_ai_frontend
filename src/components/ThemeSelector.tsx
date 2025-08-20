import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, Sun, Moon, Zap, Waves, Circle, Lightbulb, Code, DollarSign, Megaphone, Users, Briefcase, Brain, Smartphone, Database, BarChart3, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const themeIcons = {
  dark: Moon,
  light: Sun,
  'simple-dark': Circle,
  'simple-light': Lightbulb,
  neon: Zap,
  ocean: Waves,
  'tech-blue': Code,
  'finance-green': DollarSign,
  'marketing-purple': Megaphone,
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
  const [showFirstTimeGuide, setShowFirstTimeGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has seen the theme guide before
    const hasSeenThemeGuide = localStorage.getItem('hasSeenThemeGuide');
    if (!hasSeenThemeGuide) {
      setShowFirstTimeGuide(true);
    } else {
      setHasSeenGuide(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleFirstTimeGuideClose = () => {
    setShowFirstTimeGuide(false);
    setHasSeenGuide(true);
    localStorage.setItem('hasSeenThemeGuide', 'true');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* First Time User Guide */}
      {showFirstTimeGuide && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div 
            className="relative max-w-xs sm:max-w-sm w-full mx-4 backdrop-blur-xl border rounded-2xl p-4 sm:p-6 shadow-2xl animate-fade-in"
            style={{ 
              backgroundColor: currentTheme.colors.surface + 'f0',
              borderColor: currentTheme.colors.border,
              boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
            }}
          >
            {/* Animated sparkles */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 animate-pulse" style={{ color: currentTheme.colors.primary }} />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Sparkles className="w-4 h-4 animate-pulse delay-500" style={{ color: currentTheme.colors.secondary }} />
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <Palette className="w-8 h-8 sm:w-12 sm:h-12 mx-auto animate-bounce" style={{ color: currentTheme.colors.primary }} />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold mb-3" style={{ color: currentTheme.colors.text }}>
                🎨 Customize Your Experience!
              </h3>
              
              <p className="text-xs sm:text-sm mb-4 leading-relaxed" style={{ color: currentTheme.colors.textSecondary }}>
                Welcome to SARAH! You can switch between <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>{themes.length} beautiful themes</span> by clicking the palette icon in the header.
              </p>
              
              <div className="mb-4 sm:mb-6 p-2 sm:p-3 rounded-xl" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                  💡 <strong>Pro Tip:</strong> Each theme is designed for different roles - CEO, CTO, Developer, etc.
                </p>
              </div>
              
              <button
                onClick={handleFirstTimeGuideClose}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  color: currentTheme.id === 'light' ? '#ffffff' : currentTheme.colors.text
                }}
              >
                Got it! Let's explore themes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 group min-w-[44px] min-h-[44px] flex items-center justify-center"
        style={{ 
          backgroundColor: isOpen ? currentTheme.colors.primary + '20' : 'transparent',
          borderColor: isOpen ? currentTheme.colors.primary + '50' : 'transparent'
        }}
      >
        <Palette 
          className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200" 
          style={{ color: isOpen ? currentTheme.colors.primary : currentTheme.colors.textSecondary }}
        />
        
        {/* Pulsing indicator for first-time users */}
        {!hasSeenGuide && !showFirstTimeGuide && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
          </div>
        )}
      </button>

      {/* Theme Selector Dropdown */}
      {isOpen && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-80 sm:w-96 backdrop-blur-xl border rounded-2xl shadow-2xl z-[9999] overflow-hidden max-w-[calc(100vw-2rem)] animate-theme-dropdown"
          style={{ 
            backgroundColor: currentTheme.colors.surface + 'f0',
            borderColor: currentTheme.colors.border,
            boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
          }}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                Choose Theme
              </h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.accent }}></div>
              </div>
            </div>
            <p className="text-xs sm:text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              {themes.length} professional themes • Scroll to see more
            </p>
          </div>

          {/* Scrollable Theme List */}
          <div className="relative">
            {/* Theme List Container */}
            <div className="p-3 sm:p-4 max-h-60 sm:max-h-80 overflow-y-auto theme-scrollbar">
              <div className="space-y-2 sm:space-y-3 pr-2">
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
                      className="w-full p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
                      style={{
                        backgroundColor: isSelected 
                          ? theme.colors.primary + '20' 
                          : theme.colors.surface + '60',
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
                      
                      <div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <div 
                            className="p-2 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: theme.colors.primary + '20' }}
                          >
                            <Icon 
                              className="w-4 h-4 sm:w-5 sm:h-5" 
                              style={{ color: theme.colors.primary }}
                            />
                          </div>
                          
                          <div className="text-left min-w-0 flex-1">
                            <h4 
                              className="font-semibold text-sm sm:text-base truncate"
                              style={{ color: theme.colors.text }}
                            >
                              {theme.name}
                            </h4>
                            <p 
                              className="text-xs hidden sm:block truncate"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              {theme.description}
                            </p>
                          </div>
                        </div>

                        {/* Color preview */}
                        <div className="flex space-x-1 flex-shrink-0">
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

                        {/* Selection indicator */}
                        {isSelected && (
                          <div 
                            className="p-1 rounded-full flex-shrink-0"
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
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t text-center" style={{ borderColor: currentTheme.colors.border }}>
            <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              Theme preferences are saved automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
};