import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  shadows: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Cyber Dark',
    description: 'Electric blue cyberpunk aesthetic',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#ffffff',
      textSecondary: '#94a3b8',
      border: 'rgba(255, 255, 255, 0.1)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    gradients: {
      primary: 'from-blue-500 to-emerald-500',
      secondary: 'from-emerald-500 to-blue-500',
      accent: 'from-amber-500 to-orange-500',
      background: 'from-slate-900 via-slate-800 to-slate-900',
    },
    shadows: {
      primary: 'rgba(59, 130, 246, 0.3)',
      secondary: 'rgba(16, 185, 129, 0.3)',
      accent: 'rgba(245, 158, 11, 0.3)',
    },
  },
  {
    id: 'light',
    name: 'Pure Light',
    description: 'Clean minimalist light theme',
    colors: {
      primary: '#2563eb',
      secondary: '#059669',
      accent: '#dc2626',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: 'rgba(0, 0, 0, 0.1)',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#2563eb',
    },
    gradients: {
      primary: 'from-blue-600 to-emerald-600',
      secondary: 'from-emerald-600 to-blue-600',
      accent: 'from-red-600 to-pink-600',
      background: 'from-white via-slate-50 to-white',
    },
    shadows: {
      primary: 'rgba(37, 99, 235, 0.3)',
      secondary: 'rgba(5, 150, 105, 0.3)',
      accent: 'rgba(220, 38, 38, 0.3)',
    },
  },
  {
    id: 'neon',
    name: 'Neon Nights',
    description: 'Vibrant neon synthwave vibes',
    colors: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#ffff00',
      background: '#0a0a0a',
      surface: '#1a0a1a',
      text: '#ffffff',
      textSecondary: '#ff80ff',
      border: 'rgba(255, 0, 128, 0.2)',
      success: '#00ff80',
      warning: '#ffff00',
      error: '#ff4040',
      info: '#8080ff',
    },
    gradients: {
      primary: 'from-pink-500 to-purple-500',
      secondary: 'from-green-400 to-cyan-400',
      accent: 'from-yellow-400 to-pink-400',
      background: 'from-black via-purple-900/20 to-black',
    },
    shadows: {
      primary: 'rgba(255, 0, 128, 0.5)',
      secondary: 'rgba(0, 255, 128, 0.5)',
      accent: 'rgba(255, 255, 0, 0.5)',
    },
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Calming deep sea blues and teals',
    colors: {
      primary: '#0891b2',
      secondary: '#0d9488',
      accent: '#7c3aed',
      background: '#0c4a6e',
      surface: '#164e63',
      text: '#f0f9ff',
      textSecondary: '#7dd3fc',
      border: 'rgba(125, 211, 252, 0.2)',
      success: '#0d9488',
      warning: '#f59e0b',
      error: '#f87171',
      info: '#0891b2',
    },
    gradients: {
      primary: 'from-cyan-600 to-teal-600',
      secondary: 'from-teal-600 to-cyan-600',
      accent: 'from-violet-600 to-purple-600',
      background: 'from-sky-900 via-cyan-900 to-sky-900',
    },
    shadows: {
      primary: 'rgba(8, 145, 178, 0.4)',
      secondary: 'rgba(13, 148, 136, 0.4)',
      accent: 'rgba(124, 58, 237, 0.4)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm sunset oranges and purples',
    colors: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#7c2d12',
      background: '#451a03',
      surface: '#7c2d12',
      text: '#fed7aa',
      textSecondary: '#fdba74',
      border: 'rgba(253, 186, 116, 0.2)',
      success: '#16a34a',
      warning: '#eab308',
      error: '#dc2626',
      info: '#ea580c',
    },
    gradients: {
      primary: 'from-orange-600 to-red-600',
      secondary: 'from-red-600 to-orange-600',
      accent: 'from-amber-600 to-orange-800',
      background: 'from-orange-900 via-red-900 to-orange-900',
    },
    shadows: {
      primary: 'rgba(234, 88, 12, 0.4)',
      secondary: 'rgba(220, 38, 38, 0.4)',
      accent: 'rgba(124, 45, 18, 0.4)',
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('sarah-theme');
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('sarah-theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};