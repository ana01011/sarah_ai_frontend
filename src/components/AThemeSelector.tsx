import React, { useState } from 'react';
import { Palette, Check, Sun, Moon, Zap, Waves, Sunset } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const themeIcons = {
  dark: Moon,
  light: Sun,
  neon: Zap,
  ocean: Waves,
  sunset: Sunset,
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
          className="absolute top-full right-0 mt-2 w-80 backdrop-blur-md border rounded-2xl p-6 shadow-2xl z-50 animate-fade-in"
          style={{ 
            backgroundColor: currentTheme.colors.surface + 'f0',
            borderColor: currentTheme.colors.border,
            boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
          }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
              Choose Theme
            </h3>
            <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
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
                  className="w-full p-4 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden"
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
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: theme.colors.primary + '20' }}
                      >
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: theme.colors.primary }}
                        />
                      </div>
                      
                      <div className="text-left">
                        <h4 
                          className="font-semibold text-sm"
                          style={{ color: theme.colors.text }}
                        >
                          {theme.name}
                        </h4>
                        <p 
                          className="text-xs"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {theme.description}
                        </p>
                      </div>
                    </div>

                    {/* Color preview */}
                    <div className="flex space-x-1 ml-auto">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>

                    {isSelected && (
                      <div 
                        className="p-1 rounded-full ml-2"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <p className="text-xs text-center" style={{ color: currentTheme.colors.textSecondary }}>
              Theme preferences are saved automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
};