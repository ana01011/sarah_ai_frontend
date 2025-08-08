import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target, BarChart3, Globe, Award, Briefcase } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const CEODashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const [metrics, setMetrics] = useState({
    revenue: 24.7,
    growth: 18.5,
    customers: 12847,
    marketShare: 23.4,
    satisfaction: 94.2,
    employees: 1247
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + (Math.random() - 0.5) * 0.5,
        growth: prev.growth + (Math.random() - 0.5) * 0.3,
        customers: prev.customers + Math.floor((Math.random() - 0.5) * 20),
        marketShare: prev.marketShare + (Math.random() - 0.5) * 0.2,
        satisfaction: Math.max(90, Math.min(100, prev.satisfaction + (Math.random() - 0.5) * 0.5)),
        employees: prev.employees + Math.floor((Math.random() - 0.5) * 5)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, change, icon: Icon, suffix = '', prefix = '' }: any) => (
    <div 
      className="backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 hover:scale-[1.08] active:scale-95 hover:shadow-2xl cursor-pointer relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.primary}15, ${currentTheme.colors.primary}08, transparent)`,
        borderColor: currentTheme.colors.primary + '40',
        boxShadow: `0 8px 32px -8px ${currentTheme.colors.primary}25, 0 0 0 1px ${currentTheme.colors.primary}10`
      }}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                      transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                      transition-transform duration-1000"></div>
      
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <div 
            className="absolute -inset-2 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500"
            style={{ backgroundColor: currentTheme.colors.primary + '60' }}
          ></div>
          <Icon 
            className="w-8 h-8 opacity-90 relative z-10 group-hover:scale-125 transition-all duration-500" 
            style={{ color: currentTheme.colors.primary }}
          />
        </div>
        <span 
          className="text-sm px-3 py-1.5 rounded-full font-medium transition-all duration-300 backdrop-blur-sm"
          style={{ 
            backgroundColor: currentTheme.colors.surface + '60',
            color: change > 0 ? currentTheme.colors.success : currentTheme.colors.error
          }}
        >
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <h3 className="text-sm font-medium mb-2" style={{ color: currentTheme.colors.textSecondary }}>
        {title}
      </h3>
      <p 
        className="text-3xl font-bold font-mono group-hover:scale-110 transition-all duration-500"
        style={{ color: currentTheme.colors.primary }}
      >
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
      
      {/* Progress indicator */}
      <div 
        className="mt-4 w-full rounded-full h-1 overflow-hidden"
        style={{ backgroundColor: currentTheme.colors.surface + '60' }}
      >
        <div 
          className="h-full transition-all duration-1000 group-hover:w-full"
          style={{ 
            background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.primary}80)`,
            width: `${Math.abs(change)}%`
          }}
        ></div>
      </div>
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500 group-hover:scale-110"
        style={{ backgroundColor: currentTheme.colors.primary + '50' }}
      ></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <Briefcase className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
          <span style={{ color: currentTheme.colors.text }}>Executive Dashboard</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Annual Revenue"
            value={metrics.revenue.toFixed(1)}
            change={12.3}
            icon={DollarSign}
            prefix="$"
            suffix="M"
          />
          <MetricCard
            title="Growth Rate"
            value={metrics.growth.toFixed(1)}
            change={5.7}
            icon={TrendingUp}
            suffix="%"
          />
          <MetricCard
            title="Total Customers"
            value={metrics.customers}
            change={8.2}
            icon={Users}
          />
          <MetricCard
            title="Market Share"
            value={metrics.marketShare.toFixed(1)}
            change={2.1}
            icon={Target}
            suffix="%"
          />
          <MetricCard
            title="Customer Satisfaction"
            value={metrics.satisfaction.toFixed(1)}
            change={1.8}
            icon={Award}
            suffix="%"
          />
          <MetricCard
            title="Team Size"
            value={metrics.employees}
            change={15.4}
            icon={Users}
          />
        </div>
      </div>

      {/* Strategic Initiatives */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
          <Target className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
          <span style={{ color: currentTheme.colors.text }}>Strategic Initiatives</span>
        </h3>
        
        <div className="space-y-4">
          {[
            { name: 'Global Expansion', progress: 78, status: 'On Track' },
            { name: 'Digital Transformation', progress: 92, status: 'Ahead' },
            { name: 'Sustainability Program', progress: 65, status: 'In Progress' },
            { name: 'Innovation Lab', progress: 45, status: 'Planning' }
          ].map((initiative, idx) => (
            <div key={idx} className="p-4 rounded-xl" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium" style={{ color: currentTheme.colors.text }}>
                  {initiative.name}
                </span>
                <span 
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary + '20',
                    color: currentTheme.colors.primary
                  }}
                >
                  {initiative.status}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${initiative.progress}%`,
                    backgroundColor: currentTheme.colors.primary
                  }}
                />
              </div>
              <div className="text-right text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                {initiative.progress}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          className="backdrop-blur-xl border rounded-2xl p-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
            <Globe className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            <span style={{ color: currentTheme.colors.text }}>Global Presence</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { region: 'North America', revenue: 45, growth: 12 },
              { region: 'Europe', revenue: 32, growth: 18 },
              { region: 'Asia Pacific', revenue: 23, growth: 25 }
            ].map((region, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                   style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <span style={{ color: currentTheme.colors.text }}>{region.region}</span>
                <div className="text-right">
                  <div className="font-bold" style={{ color: currentTheme.colors.primary }}>
                    {region.revenue}%
                  </div>
                  <div className="text-sm" style={{ color: currentTheme.colors.success }}>
                    +{region.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="backdrop-blur-xl border rounded-2xl p-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
            <BarChart3 className="w-6 h-6" style={{ color: currentTheme.colors.info }} />
            <span style={{ color: currentTheme.colors.text }}>Key Performance Indicators</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { metric: 'Customer Acquisition Cost', value: '$127', trend: 'down' },
              { metric: 'Lifetime Value', value: '$2,847', trend: 'up' },
              { metric: 'Churn Rate', value: '2.3%', trend: 'down' },
              { metric: 'Net Promoter Score', value: '72', trend: 'up' }
            ].map((kpi, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                   style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <span style={{ color: currentTheme.colors.textSecondary }}>{kpi.metric}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold" style={{ color: currentTheme.colors.text }}>
                    {kpi.value}
                  </span>
                  <TrendingUp 
                    className={`w-4 h-4 ${kpi.trend === 'up' ? '' : 'rotate-180'}`}
                    style={{ color: kpi.trend === 'up' ? currentTheme.colors.success : currentTheme.colors.error }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};