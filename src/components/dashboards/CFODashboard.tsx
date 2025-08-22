import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, PieChart, BarChart3, Calculator, CreditCard, Building, Target } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const CFODashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const [metrics, setMetrics] = useState({
    revenue: 47.2,
    profit: 12.8,
    cashFlow: 8.4,
    expenses: 34.4,
    roi: 18.7,
    burnRate: 2.1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + (Math.random() - 0.5) * 0.8,
        profit: prev.profit + (Math.random() - 0.5) * 0.4,
        cashFlow: prev.cashFlow + (Math.random() - 0.5) * 0.6,
        expenses: prev.expenses + (Math.random() - 0.5) * 0.5,
        roi: prev.roi + (Math.random() - 0.5) * 0.3,
        burnRate: Math.max(1.5, prev.burnRate + (Math.random() - 0.5) * 0.2)
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const FinanceCard = ({ title, value, change, icon: Icon, suffix = '', prefix = '$' }: any) => (
    <div 
      className="backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 hover:scale-[1.05] cursor-pointer relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
        borderColor: currentTheme.colors.border,
        boxShadow: `0 8px 32px -8px ${currentTheme.shadows.primary}`
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
        <span 
          className="text-sm px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: change > 0 ? currentTheme.colors.success + '20' : currentTheme.colors.error + '20',
            color: change > 0 ? currentTheme.colors.success : currentTheme.colors.error
          }}
        >
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <h3 className="text-sm font-medium mb-2" style={{ color: currentTheme.colors.textSecondary }}>
        {title}
      </h3>
      <p className="text-3xl font-bold font-mono" style={{ color: currentTheme.colors.text }}>
        {prefix}{typeof value === 'number' ? value.toFixed(1) : value}{suffix}M
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Financial Overview */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <DollarSign className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
          <span style={{ color: currentTheme.colors.text }}>Financial Dashboard</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FinanceCard
            title="Total Revenue"
            value={metrics.revenue}
            change={14.2}
            icon={TrendingUp}
          />
          <FinanceCard
            title="Net Profit"
            value={metrics.profit}
            change={8.7}
            icon={Target}
          />
          <FinanceCard
            title="Cash Flow"
            value={metrics.cashFlow}
            change={12.1}
            icon={BarChart3}
          />
          <FinanceCard
            title="Operating Expenses"
            value={metrics.expenses}
            change={-3.4}
            icon={Calculator}
          />
          <FinanceCard
            title="ROI"
            value={metrics.roi}
            change={5.8}
            icon={PieChart}
            suffix="%"
            prefix=""
          />
          <FinanceCard
            title="Burn Rate"
            value={metrics.burnRate}
            change={-8.2}
            icon={CreditCard}
          />
        </div>
      </div>

      {/* Budget Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          className="backdrop-blur-xl border rounded-2xl p-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
            <PieChart className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
            <span style={{ color: currentTheme.colors.text }}>Budget Allocation</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { category: 'R&D', allocated: 15.2, spent: 14.8, variance: -2.6 },
              { category: 'Marketing', allocated: 8.5, spent: 9.1, variance: 7.1 },
              { category: 'Operations', allocated: 12.3, spent: 11.9, variance: -3.3 },
              { category: 'Sales', allocated: 6.8, spent: 7.2, variance: 5.9 }
            ].map((budget, idx) => (
              <div key={idx} className="p-4 rounded-xl" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium" style={{ color: currentTheme.colors.text }}>
                    {budget.category}
                  </span>
                  <span 
                    className="text-sm px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: budget.variance < 0 ? currentTheme.colors.success + '20' : currentTheme.colors.warning + '20',
                      color: budget.variance < 0 ? currentTheme.colors.success : currentTheme.colors.warning
                    }}
                  >
                    {budget.variance > 0 ? '+' : ''}{budget.variance}%
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                  <span>Allocated: ${budget.allocated}M</span>
                  <span>Spent: ${budget.spent}M</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(budget.spent / budget.allocated) * 100}%`,
                      backgroundColor: budget.variance < 0 ? currentTheme.colors.success : currentTheme.colors.warning
                    }}
                  />
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
            <Building className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            <span style={{ color: currentTheme.colors.text }}>Investment Portfolio</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { investment: 'Tech Stocks', value: 24.7, return: 12.4 },
              { investment: 'Real Estate', value: 18.3, return: 8.7 },
              { investment: 'Bonds', value: 15.9, return: 4.2 },
              { investment: 'Crypto', value: 8.1, return: 23.8 }
            ].map((investment, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                   style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <div>
                  <div className="font-medium" style={{ color: currentTheme.colors.text }}>
                    {investment.investment}
                  </div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    ${investment.value}M invested
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: currentTheme.colors.success }}>
                    +{investment.return}%
                  </div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    Return
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};