import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'cyan';
  suffix?: string;
}

const colorClasses = {
  emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
  blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
  amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
  purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
  rose: 'from-rose-500/20 to-rose-600/20 border-rose-500/30 text-rose-400',
  cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
};

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  suffix = ''
}) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div 
      className={`
        relative group backdrop-blur-md bg-gradient-to-br ${colorClasses[color]}
        border rounded-xl p-5 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-2xl
        hover:shadow-${color}-500/30 cursor-pointer overflow-hidden
      `}
      onClick={() => console.log(`Clicked ${title} metric`)}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                      transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <div className={`absolute -inset-1 bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity`}></div>
            <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[3]} opacity-90 relative z-10 group-hover:scale-110 transition-transform`} />
          </div>
          <span className={`text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors
                           ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {change}
          </span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-300">{title}</h3>
          <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[3]} font-mono group-hover:scale-105 transition-transform`}>
            {value}{suffix}
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} transition-all duration-1000 group-hover:w-full`}
            style={{ width: `${Math.abs(parseFloat(change))}%` }}
          ></div>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${colorClasses[color].split(' ')[0]} 
                       ${colorClasses[color].split(' ')[1]} rounded-xl opacity-0 
                       group-hover:opacity-30 blur-lg transition-all duration-300 group-hover:scale-110`}></div>
    </div>
  );
};