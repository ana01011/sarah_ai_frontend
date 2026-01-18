import React from 'react';
import { useAgent } from '../contexts/AgentContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, ShoppingBag, Utensils, 
  BrainCircuit, Home, LogOut, User, Sparkles, X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView } = useAgent();
  const { currentTheme } = useTheme();
  const { logout } = useAuth();

  const navItems = [
    { id: 'welcome', label: 'Home', icon: Home, group: 'General' },
    { id: 'dashboard', label: 'AI Analytics', icon: BrainCircuit, group: 'Amesie AI' },
    { id: 'selector', label: 'Agent Selector', icon: Sparkles, group: 'Amesie AI' },
    { id: 'amesie-dashboard', label: 'Seller Stats', icon: LayoutDashboard, group: 'Amesie Seller' },
    { id: 'amesie-orders', label: 'Orders', icon: ShoppingBag, group: 'Amesie Seller' },
    { id: 'amesie-menu', label: 'Menu Items', icon: Utensils, group: 'Amesie Seller' },
    { id: 'profile', label: 'My Account', icon: User, group: 'General' },
  ];

  const handleNavigation = (viewId: string) => {
    setCurrentView(viewId as any);
    onClose(); // Close sidebar on mobile when item clicked
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 h-full 
          transform transition-transform duration-300 ease-in-out
          flex flex-col border-r
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border 
        }}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 
            className="text-xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(to r, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
          >
            AMESIE
          </h1>
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={onClose}
            className="md:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-6">
          {['General', 'Amesie AI', 'Amesie Seller'].map(group => (
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
                      onClick={() => handleNavigation(item.id)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 group"
                      style={{ 
                        backgroundColor: isActive ? currentTheme.colors.primary + '20' : 'transparent',
                        color: isActive ? currentTheme.colors.primary : currentTheme.colors.text
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
    </>
  );
};