import React from 'react';
import { Brain, Sparkles, Shield, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { GoogleLoginButton } from './GoogleLoginButton';

export const LoginPage: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[40rem] h-[40rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[36rem] h-[36rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[38rem] h-[38rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div 
              className="absolute -inset-6 rounded-full blur-2xl opacity-40 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
            />
            <Brain 
              className="w-16 h-16 mx-auto relative animate-pulse" 
              style={{ color: currentTheme.colors.primary }}
            />
          </div>
          
          <h1 
            className="text-4xl font-bold bg-clip-text text-transparent mb-2"
            style={{
              backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            }}
          >
            Sarah AI
          </h1>
          
          <p className="text-lg font-light mb-4" style={{ color: currentTheme.colors.textSecondary }}>
            Your Advanced AI Assistant
          </p>
          
          <div className="flex items-center justify-center space-x-2" style={{ color: currentTheme.colors.secondary }}>
            <Sparkles className="w-4 h-4 animate-spin" />
            <span className="text-sm font-mono">Powered by Advanced AI</span>
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
        </div>

        {/* Login Card */}
        <div 
          className="backdrop-blur-xl border rounded-2xl p-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
            borderColor: currentTheme.colors.border,
            boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
          }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
              Welcome Back
            </h2>
            <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Sign in with your Google account to continue
            </p>
          </div>

          <GoogleLoginButton />

          {/* Why Sign In Section */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: currentTheme.colors.surface + '40' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: currentTheme.colors.text }}>
              Why sign in?
            </h3>
            <div className="space-y-2 text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3" style={{ color: currentTheme.colors.success }} />
                <span>Secure and private conversations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
                <span>Save and access your chat history</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-3 h-3" style={{ color: currentTheme.colors.secondary }} />
                <span>Personalized AI responses</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-xs space-x-4" style={{ color: currentTheme.colors.textSecondary }}>
            <button className="hover:underline">Privacy Policy</button>
            <span>•</span>
            <button className="hover:underline">Terms of Service</button>
          </div>
        </div>
      </div>
    </div>
  );
};