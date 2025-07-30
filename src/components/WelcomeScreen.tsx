import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, Sparkles, Zap, Shield, Cpu } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentSystem, setCurrentSystem] = useState(0);

  const systems = [
    'Neural Networks',
    'Data Pipeline',
    'GPU Clusters',
    'Model Registry',
    'Security Layer',
    'API Gateway'
  ];

  useEffect(() => {
    const loadingTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsLoading(false);
          clearInterval(loadingTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const systemTimer = setInterval(() => {
      setCurrentSystem(prev => (prev + 1) % systems.length);
    }, 800);

    return () => {
      clearInterval(loadingTimer);
      clearInterval(systemTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000 opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000 opacity-20"></div>
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Logo and Branding */}
          <div className="mb-12">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <Brain className="w-24 h-24 text-blue-400 mx-auto relative animate-pulse" />
            </div>
            
            <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent mt-8 mb-4 animate-pulse">
              SARAH
            </h1>
            
            <p className="text-2xl text-slate-300 mb-2 font-light">
              Synthetic Autonomous Reasoning & Analysis Hub
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span className="text-lg font-mono">AI Operations Platform v3.7.2</span>
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
          </div>

          {/* Loading Section */}
          {isLoading ? (
            <div className="space-y-8">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Cpu className="w-6 h-6 text-blue-400 animate-spin" />
                    <span className="text-lg font-medium">Initializing Systems</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Loading {systems[currentSystem]}...</span>
                      <span className="text-emerald-400 font-mono">{progress}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="text-center">
                      <Shield className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <span className="text-slate-400">Secure</span>
                    </div>
                    <div className="text-center">
                      <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-slate-400">Fast</span>
                    </div>
                    <div className="text-center">
                      <Brain className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <span className="text-slate-400">Smart</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-2 text-emerald-400">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-lg font-medium">All Systems Online</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">GPU Clusters</span>
                        <span className="text-emerald-400">✓ Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Neural Networks</span>
                        <span className="text-emerald-400">✓ Ready</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Data Pipeline</span>
                        <span className="text-emerald-400">✓ Streaming</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Model Registry</span>
                        <span className="text-emerald-400">✓ Synced</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Security Layer</span>
                        <span className="text-emerald-400">✓ Protected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">API Gateway</span>
                        <span className="text-emerald-400">✓ Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={onEnter}
                    className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 
                             text-white font-semibold py-5 px-8 rounded-xl transition-all duration-300 
                             hover:scale-110 active:scale-95 hover:shadow-2xl hover:shadow-blue-500/30 
                             flex items-center justify-center space-x-3 group relative overflow-hidden
                             backdrop-blur-sm border border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="text-lg">Enter Dashboard</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                  </button>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm">
                Advanced AI Operations • Real-time Analytics • Neural Network Management
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};