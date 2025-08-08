import React, { useState, useEffect } from 'react';
import { Settings, Truck, Factory, Users, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const COODashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const [metrics, setMetrics] = useState({
    efficiency: 94.2,
    throughput: 847,
    quality: 98.7,
    onTime: 96.3,
    utilization: 87.5,
    incidents: 3
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        efficiency: Math.max(90, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 1)),
        throughput: prev.throughput + Math.floor((Math.random() - 0.5) * 50),
        quality: Math.max(95, Math.min(100, prev.quality + (Math.random() - 0.5) * 0.5)),
        onTime: Math.max(90, Math.min(100, prev.onTime + (Math.random() - 0.5) * 1)),
        utilization: Math.max(80, Math.min(95, prev.utilization + (Math.random() - 0.5) * 2)),
        incidents: Math.max(0, prev.incidents + Math.floor((Math.random() - 0.7) * 2))
      }));
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const OperationsCard = ({ title, value, change, icon: Icon, suffix = '', prefix = '' }: any) => (
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
      {/* Operations Overview */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <Settings className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
          <span style={{ color: currentTheme.colors.text }}>Operations Dashboard</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OperationsCard
            title="Operational Efficiency"
            value={metrics.efficiency.toFixed(1)}
            change={3.2}
            icon={BarChart3}
            suffix="%"
          />
          <OperationsCard
            title="Daily Throughput"
            value={metrics.throughput}
            change={8.7}
            icon={Factory}
          />
          <OperationsCard
            title="Quality Score"
            value={metrics.quality.toFixed(1)}
            change={1.4}
            icon={CheckCircle}
            suffix="%"
          />
          <OperationsCard
            title="On-Time Delivery"
            value={metrics.onTime.toFixed(1)}
            change={2.8}
            icon={Truck}
            suffix="%"
          />
          <OperationsCard
            title="Resource Utilization"
            value={metrics.utilization.toFixed(1)}
            change={5.1}
            icon={Users}
            suffix="%"
          />
          <OperationsCard
            title="Safety Incidents"
            value={metrics.incidents}
            change={-25.0}
            icon={AlertTriangle}
          />
        </div>
      </div>

      {/* Production Lines */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
          <Factory className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
          <span style={{ color: currentTheme.colors.text }}>Production Lines</span>
        </h3>
        
        <div className="space-y-4">
          {[
            { line: 'Assembly Line A', efficiency: 96, output: 247, status: 'Optimal' },
            { line: 'Assembly Line B', efficiency: 92, output: 231, status: 'Good' },
            { line: 'Quality Control', efficiency: 98, output: 189, status: 'Excellent' },
            { line: 'Packaging Unit', efficiency: 89, output: 156, status: 'Average' }
          ].map((line, idx) => (
            <div key={idx} className="p-4 rounded-xl" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium" style={{ color: currentTheme.colors.text }}>
                  {line.line}
                </span>
                <span 
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: line.efficiency > 95 ? currentTheme.colors.success + '20' : 
                                   line.efficiency > 90 ? currentTheme.colors.warning + '20' : currentTheme.colors.error + '20',
                    color: line.efficiency > 95 ? currentTheme.colors.success : 
                           line.efficiency > 90 ? currentTheme.colors.warning : currentTheme.colors.error
                  }}
                >
                  {line.status}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                <span>Efficiency: {line.efficiency}%</span>
                <span>Output: {line.output} units/hr</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${line.efficiency}%`,
                    backgroundColor: line.efficiency > 95 ? currentTheme.colors.success : 
                                   line.efficiency > 90 ? currentTheme.colors.warning : currentTheme.colors.error
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supply Chain & Logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          className="backdrop-blur-xl border rounded-2xl p-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
            <Truck className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            <span style={{ color: currentTheme.colors.text }}>Supply Chain</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { supplier: 'Raw Materials Co.', delivery: 98, quality: 96, cost: 'Optimal' },
              { supplier: 'Component Systems', delivery: 94, quality: 98, cost: 'Good' },
              { supplier: 'Packaging Solutions', delivery: 91, quality: 94, cost: 'Average' },
              { supplier: 'Logistics Partners', delivery: 97, quality: 95, cost: 'Excellent' }
            ].map((supplier, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                   style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <div>
                  <div className="font-medium" style={{ color: currentTheme.colors.text }}>
                    {supplier.supplier}
                  </div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    Delivery: {supplier.delivery}% | Quality: {supplier.quality}%
                  </div>
                </div>
                <span 
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary + '20',
                    color: currentTheme.colors.primary
                  }}
                >
                  {supplier.cost}
                </span>
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
            <Clock className="w-6 h-6" style={{ color: currentTheme.colors.info }} />
            <span style={{ color: currentTheme.colors.text }}>Performance Metrics</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { metric: 'Overall Equipment Effectiveness', value: 87, target: 90 },
              { metric: 'First Pass Yield', value: 94, target: 95 },
              { metric: 'Cycle Time Efficiency', value: 92, target: 90 },
              { metric: 'Inventory Turnover', value: 8.2, target: 8.0 }
            ].map((perf, idx) => (
              <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {perf.metric}
                  </span>
                  <span className="font-bold" style={{ 
                    color: perf.value >= perf.target ? currentTheme.colors.success : currentTheme.colors.warning 
                  }}>
                    {perf.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (perf.value / perf.target) * 100)}%`,
                      backgroundColor: perf.value >= perf.target ? currentTheme.colors.success : currentTheme.colors.warning
                    }}
                  />
                </div>
                <div className="text-right text-xs mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                  Target: {perf.target}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};