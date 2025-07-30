import React, { useState, useEffect } from 'react';
import { Activity, Brain, Cpu, Database, Zap, TrendingUp, AlertTriangle, CheckCircle, MessageCircle, Settings, Bell, Search, Filter, Download, Share, Maximize, BarChart3, Users, Globe } from 'lucide-react';
import { MetricsCard } from './MetricsCard';
import { NeuralNetworkViz } from './NeuralNetworkViz';
import { PerformanceChart } from './PerformanceChart';
import { SystemStatus } from './SystemStatus';
import { ProcessingPipeline } from './ProcessingPipeline';
import { AIChat } from './AIChat';

interface DashboardProps {
  onBackToWelcome?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onBackToWelcome }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [aiMetrics, setAiMetrics] = useState({
    accuracy: 94.7,
    throughput: 2847,
    latency: 12.3,
    gpuUtilization: 78,
    memoryUsage: 65,
    activeModels: 12
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Simulate real-time metrics updates
    const metricsTimer = setInterval(() => {
      setAiMetrics(prev => ({
        accuracy: prev.accuracy + (Math.random() - 0.5) * 0.2,
        throughput: prev.throughput + Math.floor((Math.random() - 0.5) * 100),
        latency: Math.max(8, prev.latency + (Math.random() - 0.5) * 2),
        gpuUtilization: Math.max(0, Math.min(100, prev.gpuUtilization + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        activeModels: prev.activeModels + Math.floor((Math.random() - 0.5) * 2)
      }));
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(metricsTimer);
    };
  }, []);

  const handleNotificationClick = () => {
    setNotifications(0);
    // Show notifications panel
  };

  const handleExportData = () => {
    // Export dashboard data
    console.log('Exporting dashboard data...');
  };

  const handleShareDashboard = () => {
    // Share dashboard
    console.log('Sharing dashboard...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur opacity-30 animate-pulse"></div>
                <Brain className="w-10 h-10 text-blue-400 animate-pulse relative z-10" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  SARAH
                </h1>
                <p className="text-sm text-slate-400 flex items-center space-x-2">
                  <span>AI Operations Dashboard</span>
                  <span>•</span>
                  <span className="text-emerald-400">v3.7.2</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <Search className="w-5 h-5 text-slate-400 hover:text-white" />
                </button>
                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl">
                    <input
                      type="text"
                      placeholder="Search metrics, models, or data..."
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button
                onClick={handleNotificationClick}
                className="relative p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Bell className="w-5 h-5 text-slate-400 hover:text-white" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </div>
                )}
              </button>

              {/* Export */}
              <button
                onClick={handleExportData}
                className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Download className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>

              {/* Share */}
              <button
                onClick={handleShareDashboard}
                className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Share className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>

              {/* Settings */}
              <button className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95">
                <Settings className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>

              <div className="text-right">
                <p className="text-sm font-mono text-emerald-400">
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-xs text-slate-400">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">All Systems Operational</span>
              </div>
              
              {/* AI Chat Button */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative group bg-gradient-to-r from-blue-500/20 to-emerald-500/20 
                         hover:from-blue-500/30 hover:to-emerald-500/30 border border-blue-500/30 
                         hover:border-emerald-500/50 rounded-xl px-6 py-3 transition-all duration-300 
                         hover:scale-110 active:scale-95 hover:shadow-xl hover:shadow-blue-500/30
                         backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <MessageCircle className="w-5 h-5 text-blue-400 group-hover:text-emerald-400 transition-colors" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></div>
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors relative z-10">
                    Ask Sarah
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Bar */}
        <div className="mb-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group cursor-pointer hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-400">Active Users</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">1,247</p>
              <p className="text-xs text-emerald-400">+12% today</p>
            </div>
            <div className="text-center group cursor-pointer hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-400">Global Reach</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">47</p>
              <p className="text-xs text-emerald-400">countries</p>
            </div>
            <div className="text-center group cursor-pointer hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-slate-400">Data Processed</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">2.4TB</p>
              <p className="text-xs text-emerald-400">today</p>
            </div>
            <div className="text-center group cursor-pointer hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-slate-400">Uptime</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">99.98%</p>
              <p className="text-xs text-emerald-400">30 days</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricsCard
            title="Model Accuracy"
            value={`${aiMetrics.accuracy.toFixed(1)}%`}
            change="+2.3%"
            icon={TrendingUp}
            color="emerald"
          />
          <MetricsCard
            title="Throughput"
            value={`${aiMetrics.throughput.toLocaleString()}`}
            change="+15.2%"
            icon={Zap}
            color="blue"
            suffix=" req/s"
          />
          <MetricsCard
            title="Avg Latency"
            value={`${aiMetrics.latency.toFixed(1)}`}
            change="-8.7%"
            icon={Activity}
            color="amber"
            suffix="ms"
          />
          <MetricsCard
            title="GPU Usage"
            value={`${aiMetrics.gpuUtilization.toFixed(0)}%`}
            change="+5.1%"
            icon={Cpu}
            color="purple"
          />
          <MetricsCard
            title="Memory"
            value={`${aiMetrics.memoryUsage.toFixed(0)}%`}
            change="-2.4%"
            icon={Database}
            color="rose"
          />
          <MetricsCard
            title="Active Models"
            value={aiMetrics.activeModels.toString()}
            change="+3"
            icon={Brain}
            color="cyan"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Neural Network Visualization */}
          <div className="lg:col-span-2">
            <NeuralNetworkViz />
          </div>

          {/* System Status */}
          <div>
            <SystemStatus />
          </div>
        </div>

        {/* Performance Charts and Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PerformanceChart metrics={aiMetrics} />
          <ProcessingPipeline />
        </div>
      </main>
      
      {/* AI Chat */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};