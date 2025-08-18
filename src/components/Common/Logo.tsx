import React from 'react';
import { Brain } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="bg-blue-600 rounded-full p-2">
        <Brain className={`${sizeClasses[size]} text-white`} />
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 dark:text-gray-100 ${textSizeClasses[size]}`}>
          Sarah AI
        </span>
      )}
    </div>
  );
};