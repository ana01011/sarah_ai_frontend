import React, { useState, useEffect, useRef } from 'react';
// Added 'Store' to the imports for the Amesie theme
import { 
  Palette, Check, Sun, Moon, Zap, Waves, Circle, Lightbulb, 
  Code, DollarSign, Megaphone, Users, Briefcase, Brain, 
  Smartphone, Database, BarChart3, Sparkles, Store 
} from 'lucide-react';
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
  'amesie-gold': Store,
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div 
            className="relative max-w-xs sm:max-w-md w-full mx-4 backdrop-blur-xl border rounded-2xl p-6 sm:p-8 shadow-2xl"
            style={{ 
              backgroundColor: currentTheme.colors.surface + 'f0',
              borderColor: currentTheme.colors.border,
              boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
            }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-3 -right-3">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: currentTheme.colors.primary + '40' }}>
                <Sparkles className="w-6 h-6 p-1" style={{ color: currentTheme.colors.primary }} />
              </div>
            </div>
            <div className="absolute -bottom-3 -left-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary + '40' }}>
                <Sparkles className="w-4 h-4 p-0.5" style={{ color: currentTheme.colors.secondary }} />
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <div className="relative inline-block">
                  <div 
                    className="absolute -inset-2 rounded-full blur-lg opacity-30"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  />
                  <Palette className="w-12 h-12 sm:w-16 sm:h-16 mx-auto relative z-10" style={{ color: currentTheme.colors.primary }} />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                Welcome to SARAH AI! 🎨
              </h3>
              
              <p className="text-sm sm:text-base mb-6 leading-relaxed" style={{ color: currentTheme.colors.textSecondary }}>
                Customize your experience with <span className="font-bold" style={{ color: currentTheme.colors.primary }}>{themes.length} professional themes</span> designed for different roles and preferences.
              </p>
              
              <div className="mb-6 p-4 rounded-xl border" style={{ 
                backgroundColor: currentTheme.colors.surface + '60',
                borderColor: currentTheme.colors.border
              }}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
                      <Palette className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold mb-1" style={{ color: currentTheme.colors.text }}>
                      How to Change Themes:
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: currentTheme.colors.textSecondary }}>
                      Click the <strong>palette icon</strong> in the top header to browse {themes.length} professional themes including CEO, CTO, Developer, Marketing, and more!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                <p>Currently using: <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>Backend Slate Theme</span></p>
              </div>
              
              <button
                onClick={handleFirstTimeGuideClose}
                className="w-full py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  color: '#ffffff',
                  boxShadow: `0 8px 25px -8px ${currentTheme.shadows.primary}`
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}
                />
                <span className="relative z-10">Got it! Start exploring SARAH</span>
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