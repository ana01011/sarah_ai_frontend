import React, { useState, useEffect } from 'react';
import { Target, Users, TrendingUp, Eye, MousePointer, Share2, Heart, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const CMODashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const [metrics, setMetrics] = useState({
    cac: 127,
    ltv: 2847,
    conversion: 3.4,
    engagement: 68.7,
    reach: 1.2,
    brandAwareness: 42.8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cac: Math.max(100, prev.cac + (Math.random() - 0.5) * 10),
        ltv: prev.ltv + (Math.random() - 0.5) * 100,
        conversion: Math.max(2, Math.min(5, prev.conversion + (Math.random() - 0.5) * 0.2)),
        engagement: Math.max(60, Math.min(80, prev.engagement + (Math.random() - 0.5) * 2)),
        reach: prev.reach + (Math.random() - 0.5) * 0.1,
        brandAwareness: Math.max(35, Math.min(50, prev.brandAwareness + (Math.random() - 0.5) * 1))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const MarketingCard = ({ title, value, change, icon: Icon, suffix = '', prefix = '' }: any) => (
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
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Marketing Overview */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <Target className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
          <span style={{ color: currentTheme.colors.text }}>Marketing Dashboard</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MarketingCard
            title="Customer Acquisition Cost"
            value={metrics.cac}
            change={-8.2}
            icon={Users}
            prefix="$"
          />
          <MarketingCard
            title="Lifetime Value"
            value={metrics.ltv}
            change={15.7}
            icon={TrendingUp}
            prefix="$"
          />
          <MarketingCard
            title="Conversion Rate"
            value={metrics.conversion.toFixed(1)}
            change={12.4}
            icon={MousePointer}
            suffix="%"
          />
          <MarketingCard
            title="Engagement Rate"
            value={metrics.engagement.toFixed(1)}
            change={7.8}
            icon={Heart}
            suffix="%"
          />
          <MarketingCard
            title="Social Reach"
            value={metrics.reach.toFixed(1)}
            change={23.1}
            icon={Share2}
            suffix="M"
          />
          <MarketingCard
            title="Brand Awareness"
            value={metrics.brandAwareness.toFixed(1)}
            change={9.3}
            icon={Eye}
            suffix="%"
          />
        </div>
      </div>

      {/* Campaign Performance */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
          <Zap className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
          <span style={{ color: currentTheme.colors.text }}>Active Campaigns</span>
        </h3>
        
        <div className="space-y-4">
          {[
            { name: 'Q4 Product Launch', budget: 250000, spent: 187500, performance: 94, status: 'Excellent' },
            { name: 'Social Media Blitz', budget: 150000, spent: 142000, performance: 87, status: 'Good' },
            { name: 'Email Marketing', budget: 75000, spent: 68000, performance: 76, status: 'Average' },
            { name: 'Influencer Partnership', budget: 200000, spent: 165000, performance: 91, status: 'Excellent' }
          ].map((campaign, idx) => (
            <div key={idx} className="p-4 rounded-xl" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium" style={{ color: currentTheme.colors.text }}>
                  {campaign.name}
                </span>
                <span 
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: campaign.performance > 90 ? currentTheme.colors.success + '20' : 
                                   campaign.performance > 80 ? currentTheme.colors.warning + '20' : currentTheme.colors.error + '20',
                    color: campaign.performance > 90 ? currentTheme.colors.success : 
                           campaign.performance > 80 ? currentTheme.colors.warning : currentTheme.colors.error
                  }}
                >
                  {campaign.status}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                <span>Budget: ${campaign.budget.toLocaleString()}</span>
                <span>Spent: ${campaign.spent.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${campaign.performance}%`,
                    backgroundColor: campaign.performance > 90 ? currentTheme.colors.success : 
                                   campaign.performance > 80 ? currentTheme.colors.warning : currentTheme.colors.error
                  }}
                />
              </div>
              <div className="text-right text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                {campaign.performance}% performance
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          className="backdrop-blur-xl border rounded-2xl p-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
            <Share2 className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            <span style={{ color: currentTheme.colors.text }}>Channel Performance</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { channel: 'Social Media', traffic: 45, conversion: 3.2, roi: 280 },
              { channel: 'Email Marketing', traffic: 28, conversion: 5.8, roi: 420 },
              { channel: 'Paid Search', traffic: 32, conversion: 4.1, roi: 350 },
              { channel: 'Content Marketing', traffic: 18, conversion: 2.9, roi: 190 }
            ].map((channel, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                   style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <div>
                  <div className="font-medium" style={{ color: currentTheme.colors.text }}>
                    {channel.channel}
                  </div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {channel.traffic}% traffic share
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: currentTheme.colors.primary }}>
                    {channel.roi}% ROI
                  </div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {channel.conversion}% conversion
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
            <Eye className="w-6 h-6" style={{ color: currentTheme.colors.info }} />
            <span style={{ color: currentTheme.colors.text }}>Brand Metrics</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { metric: 'Brand Recognition', value: 78, trend: 'up' },
              { metric: 'Customer Satisfaction', value: 92, trend: 'up' },
              { metric: 'Net Promoter Score', value: 67, trend: 'up' },
              { metric: 'Market Share', value: 23, trend: 'down' }
            ].map((brand, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                   style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <span style={{ color: currentTheme.colors.textSecondary }}>{brand.metric}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold" style={{ color: currentTheme.colors.text }}>
                    {brand.value}%
                  </span>
                  <TrendingUp 
                    className={`w-4 h-4 ${brand.trend === 'up' ? '' : 'rotate-180'}`}
                    style={{ color: brand.trend === 'up' ? currentTheme.colors.success : currentTheme.colors.error }}
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