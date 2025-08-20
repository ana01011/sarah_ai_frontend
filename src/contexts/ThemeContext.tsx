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
    id: 'simple-dark',
    name: 'Simple Dark',
    description: 'Clean professional dark theme',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: 'rgba(156, 163, 175, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#6366f1',
    },
    gradients: {
      primary: 'from-indigo-500 to-purple-500',
      secondary: 'from-purple-500 to-indigo-500',
      accent: 'from-cyan-500 to-blue-500',
      background: 'from-gray-900 via-gray-800 to-gray-900',
    },
    shadows: {
      primary: 'rgba(99, 102, 241, 0.25)',
      secondary: 'rgba(139, 92, 246, 0.25)',
      accent: 'rgba(6, 182, 212, 0.25)',
    },
  },
  {
    id: 'simple-light',
    name: 'Simple Light',
    description: 'Clean professional light theme',
    colors: {
      primary: '#4f46e5',
      secondary: '#7c3aed',
      accent: '#0891b2',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#475569',
      border: 'rgba(71, 85, 105, 0.15)',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#4f46e5',
    },
    gradients: {
      primary: 'from-indigo-600 to-purple-600',
      secondary: 'from-purple-600 to-indigo-600',
      accent: 'from-cyan-600 to-blue-600',
      background: 'from-slate-50 via-white to-slate-50',
    },
    shadows: {
      primary: 'rgba(79, 70, 229, 0.2)',
      secondary: 'rgba(124, 58, 237, 0.2)',
      accent: 'rgba(8, 145, 178, 0.2)',
    },
  },
  {
    id: 'tech-blue',
    name: 'Tech Blue',
    description: 'Professional blue for technology leaders',
    colors: {
      primary: '#2563eb',
      secondary: '#1d4ed8',
      accent: '#1e40af',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: 'rgba(37, 99, 235, 0.25)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#2563eb',
    },
    gradients: {
      primary: 'from-blue-600 to-indigo-600',
      secondary: 'from-indigo-600 to-blue-600',
      accent: 'from-blue-700 to-indigo-700',
      background: 'from-slate-900 via-blue-950/30 to-slate-900',
    },
    shadows: {
      primary: 'rgba(37, 99, 235, 0.4)',
      secondary: 'rgba(29, 78, 216, 0.4)',
      accent: 'rgba(30, 64, 175, 0.4)',
    },
  },
  {
    id: 'finance-green',
    name: 'Finance Green',
    description: 'Professional green for financial executives',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#065f46',
      background: '#0f1419',
      surface: '#1f2937',
      text: '#ecfdf5',
      textSecondary: '#6ee7b7',
      border: 'rgba(5, 150, 105, 0.25)',
      success: '#059669',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',
    },
    gradients: {
      primary: 'from-emerald-600 to-teal-600',
      secondary: 'from-teal-600 to-emerald-600',
      accent: 'from-emerald-700 to-teal-700',
      background: 'from-gray-900 via-emerald-950/30 to-gray-900',
    },
    shadows: {
      primary: 'rgba(5, 150, 105, 0.4)',
      secondary: 'rgba(4, 120, 87, 0.4)',
      accent: 'rgba(6, 95, 70, 0.4)',
    },
  },
  {
    id: 'marketing-purple',
    name: 'Marketing Purple',
    description: 'Creative purple for marketing professionals',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#5b21b6',
      background: '#0f0f23',
      surface: '#1e1b4b',
      text: '#f3f4f6',
      textSecondary: '#c4b5fd',
      border: 'rgba(124, 58, 237, 0.25)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#7c3aed',
    },
    gradients: {
      primary: 'from-violet-600 to-purple-600',
      secondary: 'from-purple-600 to-violet-600',
      accent: 'from-violet-700 to-purple-700',
      background: 'from-slate-900 via-violet-950/30 to-slate-900',
    },
    shadows: {
      primary: 'rgba(124, 58, 237, 0.4)',
      secondary: 'rgba(109, 40, 217, 0.4)',
      accent: 'rgba(91, 33, 182, 0.4)',
    },
  },
  {
    id: 'product-teal',
    name: 'Product Teal',
    description: 'Modern teal for product managers',
    colors: {
      primary: '#0d9488',
      secondary: '#0f766e',
      accent: '#134e4a',
      background: '#0f1419',
      surface: '#1f2937',
      text: '#f0fdfa',
      textSecondary: '#5eead4',
      border: 'rgba(13, 148, 136, 0.25)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0d9488',
    },
    gradients: {
      primary: 'from-teal-600 to-cyan-600',
      secondary: 'from-cyan-600 to-teal-600',
      accent: 'from-teal-700 to-cyan-700',
      background: 'from-gray-900 via-teal-950/30 to-gray-900',
    },
    shadows: {
      primary: 'rgba(13, 148, 136, 0.4)',
      secondary: 'rgba(15, 118, 110, 0.4)',
      accent: 'rgba(19, 78, 74, 0.4)',
    },
  },
  {
    id: 'developer-dark',
    name: 'Developer Dark',
    description: 'Clean dark theme for developers',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: 'rgba(156, 163, 175, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#6366f1',
    },
    gradients: {
      primary: 'from-indigo-500 to-purple-500',
      secondary: 'from-purple-500 to-indigo-500',
      accent: 'from-cyan-500 to-blue-500',
      background: 'from-gray-900 via-gray-800 to-gray-900',
    },
    shadows: {
      primary: 'rgba(99, 102, 241, 0.25)',
      secondary: 'rgba(139, 92, 246, 0.25)',
      accent: 'rgba(6, 182, 212, 0.25)',
    },
  },
  {
    id: 'ai-neural',
    name: 'AI Neural',
    description: 'Futuristic theme for AI specialists',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a855f7',
      accent: '#06b6d4',
      background: '#0f0f23',
      surface: '#1e1b4b',
      text: '#f8fafc',
      textSecondary: '#c4b5fd',
      border: 'rgba(139, 92, 246, 0.25)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#8b5cf6',
    },
    gradients: {
      primary: 'from-violet-500 to-purple-500',
      secondary: 'from-purple-500 to-violet-500',
      accent: 'from-cyan-500 to-violet-500',
      background: 'from-slate-900 via-violet-950/40 to-slate-900',
    },
    shadows: {
      primary: 'rgba(139, 92, 246, 0.4)',
      secondary: 'rgba(168, 85, 247, 0.4)',
      accent: 'rgba(6, 182, 212, 0.4)',
    },
  },
  {
    id: 'frontend-pink',
    name: 'Frontend Pink',
    description: 'Creative pink for frontend developers',
    colors: {
      primary: '#ec4899',
      secondary: '#f97316',
      accent: '#8b5cf6',
      background: '#0f0f23',
      surface: '#1e1b4b',
      text: '#fdf2f8',
      textSecondary: '#f9a8d4',
      border: 'rgba(236, 72, 153, 0.25)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#ec4899',
    },
    gradients: {
      primary: 'from-pink-500 to-rose-500',
      secondary: 'from-orange-500 to-pink-500',
      accent: 'from-violet-500 to-pink-500',
      background: 'from-slate-900 via-pink-950/30 to-slate-900',
    },
    shadows: {
      primary: 'rgba(236, 72, 153, 0.4)',
      secondary: 'rgba(249, 115, 22, 0.4)',
      accent: 'rgba(139, 92, 246, 0.4)',
    },
  },
  {
    id: 'backend-slate',
    name: 'Backend Slate',
    description: 'Professional slate for backend developers',
    colors: {
      primary: '#475569',
      secondary: '#64748b',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: 'rgba(71, 85, 105, 0.25)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#475569',
    },
    gradients: {
      primary: 'from-slate-600 to-gray-600',
      secondary: 'from-gray-600 to-slate-600',
      accent: 'from-cyan-500 to-slate-500',
      background: 'from-slate-900 via-gray-900 to-slate-900',
    },
    shadows: {
      primary: 'rgba(71, 85, 105, 0.4)',
      secondary: 'rgba(100, 116, 139, 0.4)',
      accent: 'rgba(6, 182, 212, 0.4)',
    },
  },
  {
    id: 'data-cyan',
    name: 'Data Cyan',
    description: 'Analytical cyan for data scientists',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#0e7490',
      background: '#0c1420',
      surface: '#1e293b',
      text: '#ecfeff',
      textSecondary: '#67e8f9',
      border: 'rgba(6, 182, 212, 0.25)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',
    },
    gradients: {
      primary: 'from-cyan-500 to-blue-500',
      secondary: 'from-blue-500 to-cyan-500',
      accent: 'from-cyan-600 to-blue-600',
      background: 'from-slate-900 via-cyan-950/30 to-slate-900',
    },
    shadows: {
      primary: 'rgba(6, 182, 212, 0.4)',
      secondary: 'rgba(8, 145, 178, 0.4)',
      accent: 'rgba(14, 116, 144, 0.4)',
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
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.find(t => t.id === 'backend-slate') || themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('sarah-theme');
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      } else {
        // If saved theme doesn't exist, default to backend-slate
        setCurrentTheme(themes.find(t => t.id === 'backend-slate') || themes[0]);
      }
    } else {
      // If no saved theme, default to backend-slate
      setCurrentTheme(themes.find(t => t.id === 'backend-slate') || themes[0]);
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