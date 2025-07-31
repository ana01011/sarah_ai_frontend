import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  suffix?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  suffix = ''
}) => {
  const { currentTheme } = useTheme();
  
  const getColorValue = (colorKey: string) => {
    const colorMap = {
      primary: currentTheme.colors.primary,
      secondary: currentTheme.colors.secondary,
      success: currentTheme.colors.success,
      warning: currentTheme.colors.warning,
      error: currentTheme.colors.error,
      info: currentTheme.colors.info,
    };
    return colorMap[colorKey as keyof typeof colorMap] || currentTheme.colors.primary;
  };
  
  const cardColor = getColorValue(color);
  const isPositive = change.startsWith('+');
  
  return (
    <div 
      className="relative group backdrop-blur-md border rounded-xl p-5 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-2xl cursor-pointer overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cardColor}20, ${cardColor}10)`,
        borderColor: cardColor + '50',
        boxShadow: `0 4px 15px -3px ${cardColor}20`
      }}
      onClick={() => console.log(`Clicked ${title} metric`)}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                      transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                      transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <div 
              className="absolute -inset-1 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"
              style={{ backgroundColor: cardColor + '40' }}
            ></div>
            <Icon 
              className="w-6 h-6 opacity-90 relative z-10 group-hover:scale-110 transition-transform" 
              style={{ color: cardColor }}
            />
          </div>
          <span 
            className="text-xs px-3 py-1 rounded-full transition-colors"
            style={{ 
              backgroundColor: currentTheme.colors.surface + '40',
              color: isPositive ? currentTheme.colors.success : currentTheme.colors.error
            }}
          >
            {change}
          </span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>{title}</h3>
          <p 
            className="text-3xl font-bold font-mono group-hover:scale-105 transition-transform"
            style={{ color: cardColor }}
          >
            {value}{suffix}
          </p>
        </div>
        
        {/* Progress indicator */}
        <div 
          className="mt-4 w-full rounded-full h-1 overflow-hidden"
          style={{ backgroundColor: currentTheme.colors.surface + '40' }}
        >
          <div 
            className="h-full transition-all duration-1000 group-hover:w-full"
            style={{ 
              background: `linear-gradient(90deg, ${cardColor}, ${cardColor}80)`,
              width: `${Math.abs(parseFloat(change))}%`
            }}
          ></div>
        </div>
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300 group-hover:scale-110"
        style={{ backgroundColor: cardColor + '40' }}
      ></div>
    </div>
  );
};