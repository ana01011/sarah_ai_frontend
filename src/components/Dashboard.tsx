import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, Settings, Bell, Search, Download, Share, Users, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useAgent } from '../contexts/AgentContext';
import { ThemeSelector } from './ThemeSelector';
import { MetricsCard } from './MetricsCard';
import { SystemStatus } from './SystemStatus';
import { PerformanceChart } from './PerformanceChart';
import { NeuralNetworkViz } from './NeuralNetworkViz';
import { ProcessingPipeline } from './ProcessingPipeline';
import { AIChat } from './AIChat';

export const Dashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setCurrentView } = useAgent();
  const { logout, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    accuracy: 94.7,
    throughput: 12847,
    latency: 23.4,
    gpuUtilization: 78.2,
    memoryUsage: 67.8,
    activeModels: 12,
    uptime: 99.97,
    cpuUsage: 45.3,
    diskUsage: 34.2,
    networkTraffic: 2.4,
    activeUsers: 1247,
    globalReach: 89,
    dataProcessed: 847.2,
    totalProcessed: 2.4,
    successRate: 99.7
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        accuracy: Math.max(90, Math.min(100, prev.accuracy + (Math.random() - 0.5) * 0.5)),
        throughput: prev.throughput + Math.floor((Math.random() - 0.5) * 200),
        latency: Math.max(15, Math.min(50, prev.latency + (Math.random() - 0.5) * 2)),
        gpuUtilization: Math.max(60, Math.min(95, prev.gpuUtilization + (Math.random() - 0.5) * 3)),
        memoryUsage: Math.max(50, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 2)),
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 50),
        dataProcessed: prev.dataProcessed + (Math.random() * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    setNotifications(0);
  };

  const handleExportData = () => {
    console.log('Exporting dashboard data...');
  };

  const handleShareDashboard = () => {
    console.log('Sharing dashboard...');
  };

  const handleAgentsClick = () => {
    setCurrentView('selector');
  };

  return (
    <div 
      className="min-h-screen overflow-hidden transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[32rem] h-[32rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[30rem] h-[30rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
        <div 
          className="absolute -bottom-10 -right-10 w-[24rem] h-[24rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-3000"
          style={{ backgroundColor: currentTheme.colors.primary + '40' }}
        />
      </div>

      {/* Header */}
      <header 
        className="relative z-40 backdrop-blur-md border-b"
        style={{ 
          backgroundColor: currentTheme.colors.surface + '80',
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <div 
                  className="absolute -inset-2 rounded-full blur opacity-30 animate-pulse"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
                />
                <Brain 
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 animate-pulse relative z-10" 
                  style={{ color: currentTheme.colors.primary }}
                />
                <div 
                  className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full animate-ping"
                  style={{ backgroundColor: currentTheme.colors.secondary }}
                />
                <div 
                  className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full"
                  style={{ backgroundColor: currentTheme.colors.secondary }}
                />
              </div>
              <div>
                <h1 
                  className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                  }}
                >
                  SARAH
                </h1>
                <p className="text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2" style={{ color: currentTheme.colors.textSecondary }}>
                  <span className="hidden sm:inline">AI Operations Dashboard</span>
                  <span className="sm:hidden">AI Dashboard</span>
                  <span>•</span>
                  <span style={{ color: currentTheme.colors.secondary }}>v3.7.2</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              <ThemeSelector />
              
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 lg:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <Search 
                    className="w-4 h-4 lg:w-5 lg:h-5 hover:text-white transition-colors" 
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                </button>
                {isSearchOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-80 backdrop-blur-md border rounded-xl p-4 shadow-2xl z-50"
                    style={{ 
                      backgroundColor: currentTheme.colors.surface + 'f0',
                      borderColor: currentTheme.colors.border
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search metrics, models, or data..."
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none transition-colors"
                      style={{ 
                        backgroundColor: currentTheme.colors.background + '80',
                        borderColor: currentTheme.colors.border,
                        color: currentTheme.colors.text,
                        fontSize: '16px'
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleNotificationClick}
                className="relative p-1.5 sm:p-2 lg:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Bell 
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 hover:text-white transition-colors" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
                {notifications > 0 && (
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white text-xs rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: currentTheme.colors.error, fontSize: '10px' }}
                  >
                    {notifications}
                  </div>
                )}
              </button>

              <button
                onClick={handleExportData}
                className="p-1.5 sm:p-2 lg:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center"
              >
                <Download 
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 hover:text-white transition-colors" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
              </button>

              <button
                onClick={handleShareDashboard}
                className="p-1.5 sm:p-2 lg:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center"
              >
                <Share 
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 hover:text-white transition-colors" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
              </button>

              <button 
                onClick={handleAgentsClick}
                className="relative p-1.5 sm:p-2 lg:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Users 
                    className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 hover:text-white transition-colors" 
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                  <span
                    className="text-xs sm:text-sm font-semibold transition-colors relative z-10 hidden sm:inline"
                    style={{ color: currentTheme.colors.text }}
                  >
                    <span className="hidden lg:inline">AI Agents</span>
                    <span className="lg:hidden">Agents</span>
                  </span>
                </div>
              </button>

              <button className="p-1.5 sm:p-2 lg:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center">
                <Settings 
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 hover:text-white transition-colors" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
              </button>

              <button
                onClick={logout}
                className="p-1.5 sm:p-2 lg:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <LogOut 
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 hover:text-white transition-colors" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
              </button>

              <div className="text-right hidden lg:block">
                <p className="text-xs sm:text-sm font-semibold" style={{ color: currentTheme.colors.text }}>
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                  {currentTime.toLocaleDateString()}
                </p>
                {user && (
                  <p className="text-xs mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                    {user.name}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2 hidden xl:flex">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: currentTheme.colors.success }} />
                <span className="text-xs sm:text-sm" style={{ color: currentTheme.colors.success }}>All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
            <MetricsCard
              title="Model Accuracy"
              value={metrics.accuracy.toFixed(1)}
              change="+2.3"
              icon={Brain}
              color="primary"
              suffix="%"
            />
            <MetricsCard
              title="Throughput"
              value={metrics.throughput.toLocaleString()}
              change="+12.7"
              icon={CheckCircle}
              color="success"
              suffix="/hr"
            />
            <MetricsCard
              title="Latency"
              value={metrics.latency.toFixed(1)}
              change="-8.4"
              icon={Settings}
              color="warning"
              suffix="ms"
            />
            <MetricsCard
              title="GPU Usage"
              value={metrics.gpuUtilization.toFixed(0)}
              change="+5.2"
              icon={Bell}
              color="info"
              suffix="%"
            />
            <MetricsCard
              title="Active Users"
              value={metrics.activeUsers.toLocaleString()}
              change="+18.9"
              icon={Users}
              color="secondary"
            />
          </div>

          {/* Charts and Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2">
              <PerformanceChart metrics={metrics} />
            </div>
            <SystemStatus />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <NeuralNetworkViz />
            <ProcessingPipeline />
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 z-50"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          boxShadow: `0 8px 32px -8px ${currentTheme.shadows.primary}`
        }}
      >
        <Brain className="w-6 h-6 text-white" />
      </button>

      {/* AI Chat Modal */}
      <AIChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};