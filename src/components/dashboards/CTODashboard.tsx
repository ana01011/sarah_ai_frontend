import React, { useState, useEffect } from 'react';
import { Server, Code, GitBranch, Shield, Zap, Database, Cloud, Cpu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const CTODashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const [metrics, setMetrics] = useState({
    uptime: 99.97,
    deployments: 247,
    codeQuality: 94.3,
    security: 98.1,
    performance: 87.6,
    infrastructure: 92.4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        uptime: Math.max(99.5, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
        deployments: prev.deployments + Math.floor(Math.random() * 3),
        codeQuality: Math.max(90, Math.min(100, prev.codeQuality + (Math.random() - 0.5) * 0.5)),
        security: Math.max(95, Math.min(100, prev.security + (Math.random() - 0.5) * 0.3)),
        performance: Math.max(80, Math.min(100, prev.performance + (Math.random() - 0.5) * 2)),
        infrastructure: Math.max(85, Math.min(100, prev.infrastructure + (Math.random() - 0.5) * 1))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const TechMetricCard = ({ title, value, icon: Icon, suffix = '', status }: any) => (
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
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: status === 'excellent' ? currentTheme.colors.success : 
                                   status === 'good' ? currentTheme.colors.warning : currentTheme.colors.error }}
        />
      </div>
      <h3 className="text-sm font-medium mb-2" style={{ color: currentTheme.colors.textSecondary }}>
        {title}
      </h3>
      <p className="text-3xl font-bold font-mono" style={{ color: currentTheme.colors.text }}>
        {typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 1) : value}{suffix}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* System Overview */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <Server className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
          <span style={{ color: currentTheme.colors.text }}>Technology Dashboard</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TechMetricCard
            title="System Uptime"
            value={metrics.uptime}
            icon={Server}
            suffix="%"
            status="excellent"
          />
          <TechMetricCard
            title="Deployments Today"
            value={metrics.deployments}
            icon={GitBranch}
            status="good"
          />
          <TechMetricCard
            title="Code Quality Score"
            value={metrics.codeQuality}
            icon={Code}
            suffix="%"
            status="excellent"
          />
          <TechMetricCard
            title="Security Rating"
            value={metrics.security}
            icon={Shield}
            suffix="%"
            status="excellent"
          />
          <TechMetricCard
            title="Performance Index"
            value={metrics.performance}
            icon={Zap}
            suffix="%"
            status="good"
          />
          <TechMetricCard
            title="Infrastructure Health"
            value={metrics.infrastructure}
            icon={Cloud}
            suffix="%"
            status="excellent"
          />
        </div>
      </div>

      {/* Development Metrics */}
      <div 
        className="backdrop-blur-xl border rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
          borderColor: currentTheme.colors.border
        }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
          <Code className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
          <span style={{ color: currentTheme.colors.text }}>Development Metrics</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
              Code Statistics
            </h4>
            <div className="space-y-4">
              {[
                { metric: 'Lines of Code', value: '2.4M', change: '+12%' },
                { metric: 'Test Coverage', value: '94.7%', change: '+2.3%' },
                { metric: 'Technical Debt', value: '3.2 days', change: '-15%' },
                { metric: 'Bug Density', value: '0.8/KLOC', change: '-22%' }
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                     style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                  <span style={{ color: currentTheme.colors.textSecondary }}>{stat.metric}</span>
                  <div className="text-right">
                    <div className="font-bold font-mono" style={{ color: currentTheme.colors.text }}>
                      {stat.value}
                    </div>
                    <div className="text-sm" style={{ 
                      color: stat.change.startsWith('+') && stat.metric !== 'Lines of Code' ? 
                             currentTheme.colors.success : currentTheme.colors.success 
                    }}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
              Team Productivity
            </h4>
            <div className="space-y-4">
              {[
                { metric: 'Velocity Points', value: '847', change: '+18%' },
                { metric: 'Sprint Completion', value: '96%', change: '+5%' },
                { metric: 'Code Reviews/Day', value: '23', change: '+8%' },
                { metric: 'Avg Review Time', value: '2.4h', change: '-12%' }
              ].map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                     style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                  <span style={{ color: currentTheme.colors.textSecondary }}>{stat.metric}</span>
                  <div className="text-right">
                    <div className="font-bold font-mono" style={{ color: currentTheme.colors.text }}>
                      {stat.value}
                    </div>
                    <div className="text-sm" style={{ 
                      color: (stat.change.startsWith('+') && stat.metric !== 'Avg Review Time') || 
                             (stat.change.startsWith('-') && stat.metric === 'Avg Review Time') ? 
                             currentTheme.colors.success : currentTheme.colors.warning 
                    }}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          className="backdrop-blur-xl border rounded-2xl p-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border
          }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
            <Database className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            <span style={{ color: currentTheme.colors.text }}>Infrastructure</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { service: 'API Gateway', status: 'Healthy', load: 67 },
              { service: 'Database Cluster', status: 'Optimal', load: 45 },
              { service: 'Cache Layer', status: 'Healthy', load: 78 },
              { service: 'Message Queue', status: 'Healthy', load: 34 }
            ].map((service, idx) => (
              <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium" style={{ color: currentTheme.colors.text }}>
                    {service.service}
                  </span>
                  <span 
                    className="text-sm px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: currentTheme.colors.success + '20',
                      color: currentTheme.colors.success
                    }}
                  >
                    {service.status}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${service.load}%`,
                      backgroundColor: service.load > 80 ? currentTheme.colors.error : 
                                     service.load > 60 ? currentTheme.colors.warning : currentTheme.colors.success
                    }}
                  />
                </div>
                <div className="text-right text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                  {service.load}% load
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
            <Shield className="w-6 h-6" style={{ color: currentTheme.colors.info }} />
            <span style={{ color: currentTheme.colors.text }}>Security Status</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { check: 'Vulnerability Scan', status: 'Passed', lastRun: '2 hours ago' },
              { check: 'Penetration Test', status: 'Passed', lastRun: '1 day ago' },
              { check: 'Compliance Audit', status: 'Passed', lastRun: '3 days ago' },
              { check: 'Access Review', status: 'Passed', lastRun: '1 week ago' }
            ].map((check, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg" 
                   style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
                <div>
                  <div className="font-medium" style={{ color: currentTheme.colors.text }}>
                    {check.check}
                  </div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {check.lastRun}
                  </div>
                </div>
                <span 
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: currentTheme.colors.success + '20',
                    color: currentTheme.colors.success
                  }}
                >
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};