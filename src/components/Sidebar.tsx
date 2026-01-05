import React from 'react';
import { useAgent } from '../contexts/AgentContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, ShoppingBag, Utensils, 
  BrainCircuit, Home, LogOut, User, Sparkles 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useAgent();
  const { currentTheme } = useTheme();
  const { logout } = useAuth();

  const navItems = [
    { id: 'welcome', label: 'Home', icon: Home, group: 'General' },
    { id: 'dashboard', label: 'AI Analytics', icon: BrainCircuit, group: 'Sarah AI' },
    { id: 'selector', label: 'Agent Selector', icon: Sparkles, group: 'Sarah AI' },
    { id: 'amesie-dashboard', label: 'Seller Stats', icon: LayoutDashboard, group: 'Amesie Seller' },
    { id: 'amesie-orders', label: 'Orders', icon: ShoppingBag, group: 'Amesie Seller' },
    { id: 'amesie-menu', label: 'Menu Items', icon: Utensils, group: 'Amesie Seller' },
    { id: 'profile', label: 'My Account', icon: User, group: 'General' },
  ];

  return (
    <div 
      // ADDED: 'relative z-50' to ensure it stays clickable above other layers
      className="w-64 h-screen flex flex-col border-r transition-colors duration-300 relative z-50"
      style={{ 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border 
      }}
    >
      <div className="p-6">
        <h1 
          className="text-xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(to r, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
        >
          SARAH & AMESIE
        </h1>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto space-y-6">
        {['General', 'Sarah AI', 'Amesie Seller'].map(group => (
          <div key={group}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-3" style={{ color: currentTheme.colors.textSecondary }}>
              {group}
            </p>
            <div className="space-y-1">
              {navItems.filter(item => item.group === group).map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 group"
                    style={{ 
                      backgroundColor: isActive ? currentTheme.colors.primary + '20' : 'transparent',
                      color: isActive ? currentTheme.colors.primary : currentTheme.colors.text,
                      cursor: 'pointer' // Explicit cursor pointer
                    }}
                  >
                    <item.icon size={20} className={isActive ? '' : 'opacity-60 group-hover:opacity-100'} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div 
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};