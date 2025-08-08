import React, { useState, useEffect } from 'react';
import { Code, Server, Cpu, Database, Zap, GitBranch, Shield, MessageCircle } from 'lucide-react';
import { AgentDashboardProps } from '../../types/Agent';
import { useTheme } from '../../contexts/ThemeContext';

export const CTODashboard: React.FC<AgentDashboardProps> = ({ agent, onBack, onOpenChat }) => {
  const { currentTheme } = useTheme();
  const [metrics, setMetrics] = useState({
    systemUptime: 99.98,
    deployments: 247,
    codeQuality: 94.7,
    securityScore: 98.2,
    apiLatency: 12.3,
    activeServices: 156
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        deployments: prev.deployments + Math.floor(Math.random() * 3),
        codeQuality: Math.max(90, Math.min(100, prev.codeQuality + (Math.random() - 0.5) * 0.5)),
        apiLatency: Math.max(8, prev.apiLatency + (Math.random() - 0.5) * 2),
        activeServices: prev.activeServices + Math.floor((Math.random() - 0.5) * 4)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
                  <Code className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
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
            <span>Ask CTO</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Tech Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div 
            className="backdrop-blur-md border rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Server className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>System Uptime</h3>
            <p className="text-2xl font-bold font-mono" style={{ color: currentTheme.colors.text }}>
              {metrics.systemUptime.toFixed(2)}%
            </p>
            <p className="text-xs text-green-400">30 days average</p>
          </div>

          <div 
            className="backdrop-blur-md border rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <GitBranch className="w-8 h-8" style={{ color: currentTheme.colors.secondary }} />
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Deployments</h3>
            <p className="text-2xl font-bold font-mono" style={{ color: currentTheme.colors.text }}>
              {metrics.deployments}
            </p>
            <p className="text-xs text-blue-400">This month</p>
          </div>

          <div 
            className="backdrop-blur-md border rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Shield className="w-8 h-8" style={{ color: currentTheme.colors.accent }} />
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>Security Score</h3>
            <p className="text-2xl font-bold font-mono" style={{ color: currentTheme.colors.text }}>
              {metrics.securityScore.toFixed(1)}%
            </p>
            <p className="text-xs text-green-400">Excellent</p>
          </div>

          <div 
            className="backdrop-blur-md border rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Cpu className="w-8 h-8" style={{ color: currentTheme.colors.info }} />
              <div className="text-xs font-mono" style={{ color: currentTheme.colors.textSecondary }}>ms</div>
            </div>
            <h3 className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>API Latency</h3>
            <p className="text-2xl font-bold font-mono" style={{ color: currentTheme.colors.text }}>
              {metrics.apiLatency.toFixed(1)}
            </p>
            <p className="text-xs text-amber-400">Average response</p>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Architecture */}
          <div 
            className="backdrop-blur-md border rounded-xl p-6"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Server className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
              <span>System Architecture</span>
            </h2>
            
            <div className="space-y-4">
              {[
                { name: 'Microservices', count: 156, status: 'healthy' },
                { name: 'API Endpoints', count: 847, status: 'healthy' },
                { name: 'Databases', count: 23, status: 'healthy' },
                { name: 'Load Balancers', count: 12, status: 'healthy' },
                { name: 'CDN Nodes', count: 47, status: 'healthy' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: currentTheme.colors.background + '40' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">{item.count}</div>
                    <div className="text-xs text-green-400">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Metrics */}
          <div 
            className="backdrop-blur-md border rounded-xl p-6"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border
            }}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Code className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
              <span>Development Metrics</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: currentTheme.colors.textSecondary }}>Code Quality</span>
                  <span className="font-mono">{metrics.codeQuality.toFixed(1)}%</span>
                </div>
                <div 
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: currentTheme.colors.background }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                      width: `${metrics.codeQuality}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: currentTheme.colors.textSecondary }}>Test Coverage</span>
                  <span className="font-mono">87.3%</span>
                </div>
                <div 
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: currentTheme.colors.background }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      background: `linear-gradient(90deg, ${currentTheme.colors.secondary}, ${currentTheme.colors.accent})`,
                      width: '87.3%'
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: currentTheme.colors.textSecondary }}>Documentation</span>
                  <span className="font-mono">92.1%</span>
                </div>
                <div 
                  className="w-full rounded-full h-3"
                  style={{ backgroundColor: currentTheme.colors.background }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      background: `linear-gradient(90deg, ${currentTheme.colors.accent}, ${currentTheme.colors.primary})`,
                      width: '92.1%'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div 
          className="backdrop-blur-md border rounded-xl p-6"
          style={{
            backgroundColor: currentTheme.colors.surface + '80',
            borderColor: currentTheme.colors.border
          }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Database className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            <span>Technology Stack</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: currentTheme.colors.primary }}>Frontend</h3>
              <div className="space-y-2">
                {['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'].map((tech, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                    <span className="text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3" style={{ color: currentTheme.colors.secondary }}>Backend</h3>
              <div className="space-y-2">
                {['Node.js', 'Python', 'Go', 'Rust'].map((tech, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                    <span className="text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3" style={{ color: currentTheme.colors.accent }}>Database</h3>
              <div className="space-y-2">
                {['PostgreSQL', 'Redis', 'MongoDB', 'ClickHouse'].map((tech, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.accent }}></div>
                    <span className="text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3" style={{ color: currentTheme.colors.info }}>Infrastructure</h3>
              <div className="space-y-2">
                {['Kubernetes', 'Docker', 'AWS', 'Terraform'].map((tech, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.info }}></div>
                    <span className="text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};