import React from 'react';
import { LucideIcon } from 'lucide-react';
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
      className="relative group backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 hover:scale-[1.08] active:scale-95 hover:shadow-2xl cursor-pointer overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cardColor}15, ${cardColor}08, transparent)`,
        borderColor: cardColor + '40',
        boxShadow: `0 8px 32px -8px ${cardColor}25, 0 0 0 1px ${cardColor}10`
      }}
      onClick={() => console.log(`Clicked ${title} metric`)}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                      transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                      transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <div 
              className="absolute -inset-2 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500"
              style={{ backgroundColor: cardColor + '60' }}
            ></div>
            <Icon 
              className="w-7 h-7 opacity-90 relative z-10 group-hover:scale-125 transition-all duration-500" 
              style={{ color: cardColor }}
            />
          </div>
          <span 
            className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-300 backdrop-blur-sm"
            style={{ 
              backgroundColor: currentTheme.colors.surface + '60',
              color: isPositive ? currentTheme.colors.success : currentTheme.colors.error
            }}
          >
            {change}
          </span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>{title}</h3>
          <p 
            className="text-3xl font-bold font-mono group-hover:scale-110 transition-all duration-500"
            style={{ color: cardColor }}
          >
            {value}{suffix}
          </p>
        </div>
        
        {/* Progress indicator */}
        <div 
          className="mt-4 w-full rounded-full h-1 overflow-hidden"
          style={{ backgroundColor: currentTheme.colors.surface + '60' }}
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
        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500 group-hover:scale-110"
        style={{ backgroundColor: cardColor + '50' }}
      ></div>
    </div>
  );
};