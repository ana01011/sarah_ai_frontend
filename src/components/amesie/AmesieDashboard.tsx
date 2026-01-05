import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  Star, 
  ChevronDown, 
  Utensils, 
  Pizza, 
  BarChart3,
  MapPin,
  Clock
} from 'lucide-react';

export const AmesieDashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const stats = [
    { label: 'RUNNING ORDERS', value: '20', color: currentTheme.colors.primary },
    { label: 'ORDER REQUEST', value: '05', color: currentTheme.colors.secondary },
  ];

  const timeLabels = ['10AM', '11AM', '12PM', '01PM', '02PM', '03PM', '04PM'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
            Seller Dashboard
          </h2>
          <div className="flex items-center mt-1 text-sm opacity-70" style={{ color: currentTheme.colors.text }}>
            <MapPin size={14} className="mr-1" />
            <span>Vadodara, Gujarat</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl border" 
             style={{ backgroundColor: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}>
          <Clock size={16} style={{ color: currentTheme.colors.primary }} />
          <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
            Store Status: <span className="text-green-500">Open</span>
          </span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            className="p-8 rounded-3xl shadow-sm border transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}
          >
            <p className="text-xs font-bold tracking-widest opacity-60 mb-2" style={{ color: currentTheme.colors.text }}>
              {stat.label}
            </p>
            <p className="text-6xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Total Revenue Card */}
      <div 
        className="p-8 rounded-3xl shadow-sm border"
        style={{ backgroundColor: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm font-medium opacity-70" style={{ color: currentTheme.colors.text }}>TOTAL REVENUE</p>
            <p className="text-3xl font-bold mt-1" style={{ color: currentTheme.colors.text }}>₹2,241</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs"
              style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.textSecondary }}
            >
              <span>{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</span>
              <ChevronDown size={14} />
            </button>
            <button className="text-xs underline font-medium" style={{ color: currentTheme.colors.primary }}>
              See Details
            </button>
          </div>
        </div>

        {/* Mock Chart Area */}
        <div className="h-32 w-full flex items-end justify-between px-2 mb-4">
          {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
            <div 
              key={i} 
              className="w-8 rounded-t-lg transition-all duration-500 hover:opacity-80"
              style={{ 
                height: `${height}%`, 
                backgroundColor: i === 3 ? currentTheme.colors.primary : currentTheme.colors.primary + '40' 
              }}
            />
          ))}
        </div>
        
        <div className="flex justify-between px-1">
          {timeLabels.map((label, i) => (
            <span key={i} className="text-[10px] uppercase opacity-50" style={{ color: currentTheme.colors.text }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews Card */}
        <div 
          className="p-6 rounded-3xl shadow-sm border"
          style={{ backgroundColor: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold" style={{ color: currentTheme.colors.text }}>Reviews</h3>
            <button className="text-xs underline" style={{ color: currentTheme.colors.primary }}>See All Reviews</button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star size={20} fill={currentTheme.colors.primary} style={{ color: currentTheme.colors.primary }} />
              <span className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>4.9</span>
            </div>
            <span className="text-sm opacity-60" style={{ color: currentTheme.colors.text }}>Total 20 Reviews</span>
          </div>
        </div>

        {/* Popular Items Card */}
        <div 
          className="p-6 rounded-3xl shadow-sm border"
          style={{ backgroundColor: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold" style={{ color: currentTheme.colors.text }}>Popular Items This Week</h3>
            <button className="text-xs underline" style={{ color: currentTheme.colors.primary }}>See All</button>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 h-24 rounded-2xl flex items-center justify-center border-2 border-dashed"
                 style={{ backgroundColor: currentTheme.colors.background, borderColor: currentTheme.colors.border }}>
              <Utensils size={32} style={{ color: currentTheme.colors.primary }} />
            </div>
            <div className="flex-1 h-24 rounded-2xl flex items-center justify-center border-2 border-dashed"
                 style={{ backgroundColor: currentTheme.colors.background, borderColor: currentTheme.colors.border }}>
              <Pizza size={32} style={{ color: currentTheme.colors.secondary }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};