import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, Users, DollarSign, Target, Globe, BarChart3, ArrowUp, ArrowDown, MessageCircle } from 'lucide-react';
import { AgentDashboardProps } from '../../types/Agent';
import { useTheme } from '../../contexts/ThemeContext';

export const CEODashboard: React.FC<AgentDashboardProps> = ({ agent, onBack, onOpenChat }) => {
  const { currentTheme } = useTheme();
  const [metrics, setMetrics] = useState({
    revenue: 847000000,
    growth: 23.4,
    valuation: 2400000000,
    employees: 12847,
    marketShare: 34.7,
    customerSat: 4.8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        revenue: prev.revenue + Math.floor(Math.random() * 10000),
        growth: prev.growth + (Math.random() - 0.5) * 0.1,
        marketShare: prev.marketShare + (Math.random() - 0.5) * 0.1,
        customerSat: Math.max(4.0, Math.min(5.0, prev.customerSat + (Math.random() - 0.5) * 0.01))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Header */}
      <header 
        className="backdrop-blur-md border-b p-4 sm:p-6"
        style={{ 
          backgroundColor: currentTheme.colors.surface + '80',
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              ←
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{agent.avatar}</div>
              <div>
                <h1 className="text-2xl font-bold flex items-center space-x-2">
                  <Crown className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                  <span>{agent.name}</span>
                </h1>
                <p style={{ color: currentTheme.colors.textSecondary }}>{agent.role}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: currentTheme.colors.primary + '20',
              borderColor: currentTheme.colors.primary + '50',
              color: currentTheme.colors.primary
            }}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Ask CEO</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div 
            className="backdrop-blur-md border rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
              <ArrowUp className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Revenue</h3>
            <p className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
              {formatCurrency(metrics.revenue)}
            </p>
            <p className="text-xs text-green-400">+{metrics.growth.toFixed(1)}% YoY</p>
          </div>

          <div 
            className="backdrop-blur-md border rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8" style={{ color: currentTheme.colors.secondary }} />
              <ArrowUp className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Valuation</h3>
            <p className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
              {formatCurrency(metrics.valuation)}
            </p>
            <p className="text-xs text-green-400">+15.2% this quarter</p>
          </div>

          <div 
            className="backdrop-blur-md border rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8" style={{ color: currentTheme.colors.accent }} />
              <ArrowUp className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Employees</h3>
            <p className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
              {metrics.employees.toLocaleString()}
            </p>
            <p className="text-xs text-green-400">+847 this year</p>
          </div>

          <div 
            className="backdrop-blur-md border rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8" style={{ color: currentTheme.colors.info }} />
              <ArrowUp className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Market Share</h3>
            <p className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
              {metrics.marketShare.toFixed(1)}%
            </p>
            <p className="text-xs text-green-400">+2.3% this quarter</p>
          </div>
        </div>

        {/* Strategic Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Performance */}
          <div 
            className="backdrop-blur-md border rounded-xl p-6"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
              <span>Company Performance</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: currentTheme.colors.textSecondary }}>Revenue Growth</span>
                  <span className="font-mono">{metrics.growth.toFixed(1)}%</span>
                </div>
                <div 
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: currentTheme.colors.background }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                      width: `${Math.min(100, metrics.growth * 4)}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: currentTheme.colors.textSecondary }}>Market Share</span>
                  <span className="font-mono">{metrics.marketShare.toFixed(1)}%</span>
                </div>
                <div 
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: currentTheme.colors.background }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      background: `linear-gradient(90deg, ${currentTheme.colors.secondary}, ${currentTheme.colors.accent})`,
                      width: `${metrics.marketShare}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: currentTheme.colors.textSecondary }}>Customer Satisfaction</span>
                  <span className="font-mono">{metrics.customerSat.toFixed(1)}/5.0</span>
                </div>
                <div 
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: currentTheme.colors.background }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      background: `linear-gradient(90deg, ${currentTheme.colors.accent}, ${currentTheme.colors.primary})`,
                      width: `${(metrics.customerSat / 5) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Initiatives */}
          <div 
            className="backdrop-blur-md border rounded-xl p-6"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Target className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
              <span>Strategic Initiatives</span>
            </h2>
            
            <div className="space-y-4">
              {[
                { name: 'AI Platform Expansion', progress: 78, status: 'On Track' },
                { name: 'Global Market Entry', progress: 45, status: 'In Progress' },
                { name: 'Sustainability Goals', progress: 92, status: 'Ahead' },
                { name: 'Digital Transformation', progress: 67, status: 'On Track' }
              ].map((initiative, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{initiative.name}</span>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: currentTheme.colors.success + '20',
                        color: currentTheme.colors.success
                      }}
                    >
                      {initiative.status}
                    </span>
                  </div>
                  <div 
                    className="w-full rounded-full h-2"
                    style={{ backgroundColor: currentTheme.colors.background }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: currentTheme.colors.primary,
                        width: `${initiative.progress}%`
                      }}
                    />
                  </div>
                  <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                    {initiative.progress}% Complete
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div 
          className="backdrop-blur-md border rounded-xl p-6"
          style={{
            backgroundColor: currentTheme.colors.surface + '80',
            borderColor: currentTheme.colors.border
          }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Globe className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            <span>Executive Summary</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                Q4 2024
              </div>
              <p style={{ color: currentTheme.colors.textSecondary }}>
                Record-breaking quarter with 23% growth and successful product launches
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.secondary }}>
                47 Countries
              </div>
              <p style={{ color: currentTheme.colors.textSecondary }}>
                Global expansion continues with new market entries in APAC region
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.accent }}>
                $2.4B Valuation
              </div>
              <p style={{ color: currentTheme.colors.textSecondary }}>
                Company valuation increased by 15% following successful funding round
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};