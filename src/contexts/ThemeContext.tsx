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
    id: 'executive-gold',
    name: 'Executive Gold',
    description: 'Luxury gold theme for executives',
    colors: {
      primary: '#d4af37',
      secondary: '#b8860b',
      accent: '#ffd700',
      background: '#1a1611',
      surface: '#2d2416',
      text: '#ffffff',
      textSecondary: '#d4af37',
      border: 'rgba(212, 175, 55, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#d4af37',
    },
    gradients: {
      primary: 'from-yellow-500 to-amber-600',
      secondary: 'from-amber-600 to-yellow-500',
      accent: 'from-yellow-400 to-amber-500',
      background: 'from-amber-900 via-yellow-900 to-amber-900',
    },
    shadows: {
      primary: 'rgba(212, 175, 55, 0.4)',
      secondary: 'rgba(184, 134, 11, 0.4)',
      accent: 'rgba(255, 215, 0, 0.4)',
    },
  },
  {
    id: 'tech-blue',
    name: 'Tech Blue',
    description: 'Professional blue for technology roles',
    colors: {
      primary: '#0066cc',
      secondary: '#0080ff',
      accent: '#00aaff',
      background: '#0a1628',
      surface: '#1e2a3a',
      text: '#ffffff',
      textSecondary: '#7dd3fc',
      border: 'rgba(0, 102, 204, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0066cc',
    },
    gradients: {
      primary: 'from-blue-600 to-cyan-500',
      secondary: 'from-cyan-500 to-blue-600',
      accent: 'from-blue-400 to-cyan-400',
      background: 'from-blue-900 via-cyan-900 to-blue-900',
    },
    shadows: {
      primary: 'rgba(0, 102, 204, 0.4)',
      secondary: 'rgba(0, 128, 255, 0.4)',
      accent: 'rgba(0, 170, 255, 0.4)',
    },
  },
  {
    id: 'finance-green',
    name: 'Finance Green',
    description: 'Professional green for financial roles',
    colors: {
      primary: '#16a34a',
      secondary: '#059669',
      accent: '#10b981',
      background: '#0f1f13',
      surface: '#1a2e20',
      text: '#ffffff',
      textSecondary: '#86efac',
      border: 'rgba(22, 163, 74, 0.2)',
      success: '#16a34a',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#16a34a',
    },
    gradients: {
      primary: 'from-green-600 to-emerald-600',
      secondary: 'from-emerald-600 to-green-600',
      accent: 'from-green-500 to-emerald-500',
      background: 'from-green-900 via-emerald-900 to-green-900',
    },
    shadows: {
      primary: 'rgba(22, 163, 74, 0.4)',
      secondary: 'rgba(5, 150, 105, 0.4)',
      accent: 'rgba(16, 185, 129, 0.4)',
    },
  },
  {
    id: 'marketing-purple',
    name: 'Marketing Purple',
    description: 'Creative purple for marketing roles',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      background: '#1e1b3a',
      surface: '#2d2748',
      text: '#ffffff',
      textSecondary: '#c4b5fd',
      border: 'rgba(124, 58, 237, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#7c3aed',
    },
    gradients: {
      primary: 'from-violet-600 to-purple-600',
      secondary: 'from-purple-600 to-violet-600',
      accent: 'from-violet-500 to-purple-500',
      background: 'from-violet-900 via-purple-900 to-violet-900',
    },
    shadows: {
      primary: 'rgba(124, 58, 237, 0.4)',
      secondary: 'rgba(168, 85, 247, 0.4)',
      accent: 'rgba(192, 132, 252, 0.4)',
    },
  },
  {
    id: 'operations-orange',
    name: 'Operations Orange',
    description: 'Dynamic orange for operations roles',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#fb923c',
      background: '#1f1611',
      surface: '#2d1f17',
      text: '#ffffff',
      textSecondary: '#fdba74',
      border: 'rgba(234, 88, 12, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#ea580c',
    },
    gradients: {
      primary: 'from-orange-600 to-amber-600',
      secondary: 'from-amber-600 to-orange-600',
      accent: 'from-orange-500 to-amber-500',
      background: 'from-orange-900 via-amber-900 to-orange-900',
    },
    shadows: {
      primary: 'rgba(234, 88, 12, 0.4)',
      secondary: 'rgba(249, 115, 22, 0.4)',
      accent: 'rgba(251, 146, 60, 0.4)',
    },
  },
  {
    id: 'product-teal',
    name: 'Product Teal',
    description: 'Modern teal for product roles',
    colors: {
      primary: '#0d9488',
      secondary: '#14b8a6',
      accent: '#2dd4bf',
      background: '#0f1f1c',
      surface: '#1a2e2a',
      text: '#ffffff',
      textSecondary: '#7dd3d0',
      border: 'rgba(13, 148, 136, 0.2)',
      success: '#0d9488',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0d9488',
    },
    gradients: {
      primary: 'from-teal-600 to-cyan-600',
      secondary: 'from-cyan-600 to-teal-600',
      accent: 'from-teal-500 to-cyan-500',
      background: 'from-teal-900 via-cyan-900 to-teal-900',
    },
    shadows: {
      primary: 'rgba(13, 148, 136, 0.4)',
      secondary: 'rgba(20, 184, 166, 0.4)',
      accent: 'rgba(45, 212, 191, 0.4)',
    },
  },
  {
    id: 'dev-cyan',
    name: 'Developer Cyan',
    description: 'Cool cyan for developers',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      accent: '#22d3ee',
      background: '#0c1821',
      surface: '#1e2a35',
      text: '#ffffff',
      textSecondary: '#7dd3fc',
      border: 'rgba(8, 145, 178, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0891b2',
    },
    gradients: {
      primary: 'from-cyan-600 to-sky-600',
      secondary: 'from-sky-600 to-cyan-600',
      accent: 'from-cyan-500 to-sky-500',
      background: 'from-cyan-900 via-sky-900 to-cyan-900',
    },
    shadows: {
      primary: 'rgba(8, 145, 178, 0.4)',
      secondary: 'rgba(6, 182, 212, 0.4)',
      accent: 'rgba(34, 211, 238, 0.4)',
    },
  },
  {
    id: 'ai-purple',
    name: 'AI Purple',
    description: 'Futuristic purple for AI roles',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      background: '#1e1b3a',
      surface: '#2d2748',
      text: '#ffffff',
      textSecondary: '#c4b5fd',
      border: 'rgba(139, 92, 246, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#8b5cf6',
    },
    gradients: {
      primary: 'from-violet-500 to-purple-500',
      secondary: 'from-purple-500 to-violet-500',
      accent: 'from-violet-400 to-purple-400',
      background: 'from-violet-900 via-purple-900 to-violet-900',
    },
    shadows: {
      primary: 'rgba(139, 92, 246, 0.4)',
      secondary: 'rgba(167, 139, 250, 0.4)',
      accent: 'rgba(196, 181, 253, 0.4)',
    },
  },
  {
    id: 'junior-pink',
    name: 'Junior Pink',
    description: 'Energetic pink for junior roles',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#f9a8d4',
      background: '#1f1825',
      surface: '#2d1b35',
      text: '#ffffff',
      textSecondary: '#f9a8d4',
      border: 'rgba(236, 72, 153, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#ec4899',
    },
    gradients: {
      primary: 'from-pink-500 to-rose-500',
      secondary: 'from-rose-500 to-pink-500',
      accent: 'from-pink-400 to-rose-400',
      background: 'from-pink-900 via-rose-900 to-pink-900',
    },
    shadows: {
      primary: 'rgba(236, 72, 153, 0.4)',
      secondary: 'rgba(244, 114, 182, 0.4)',
      accent: 'rgba(249, 168, 212, 0.4)',
    },
  },
  {
    id: 'junior-blue',
    name: 'Junior Blue',
    description: 'Fresh blue for junior developers',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#93c5fd',
      background: '#0f1629',
      surface: '#1e293b',
      text: '#ffffff',
      textSecondary: '#93c5fd',
      border: 'rgba(59, 130, 246, 0.2)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    gradients: {
      primary: 'from-blue-500 to-indigo-500',
      secondary: 'from-indigo-500 to-blue-500',
      accent: 'from-blue-400 to-indigo-400',
      background: 'from-blue-900 via-indigo-900 to-blue-900',
    },
    shadows: {
      primary: 'rgba(59, 130, 246, 0.4)',
      secondary: 'rgba(96, 165, 250, 0.4)',
      accent: 'rgba(147, 197, 253, 0.4)',
    },
  },
  {
    id: 'intern-green',
    name: 'Intern Green',
    description: 'Fresh green for interns',
    colors: {
      primary: '#22c55e',
      secondary: '#4ade80',
      accent: '#86efac',
      background: '#0f1f13',
      surface: '#1a2e20',
      text: '#ffffff',
      textSecondary: '#86efac',
      border: 'rgba(34, 197, 94, 0.2)',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#22c55e',
    },
    gradients: {
      primary: 'from-green-500 to-lime-500',
      secondary: 'from-lime-500 to-green-500',
      accent: 'from-green-400 to-lime-400',
      background: 'from-green-900 via-lime-900 to-green-900',
    },
    shadows: {
      primary: 'rgba(34, 197, 94, 0.4)',
      secondary: 'rgba(74, 222, 128, 0.4)',
      accent: 'rgba(134, 239, 172, 0.4)',
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