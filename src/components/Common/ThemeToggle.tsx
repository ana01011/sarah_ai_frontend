import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('sarah-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sarah-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sarah-theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center justify-center w-full p-2 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-2">
        {isDark ? (
          <Sun className="w-4 h-4 text-gray-600" />
        ) : (
          <Moon className="w-4 h-4 text-gray-600" />
        )}
        <span className="text-sm text-gray-700">
          {isDark ? 'Light' : 'Dark'} Mode
        </span>
      </div>
    </button>
  );
};