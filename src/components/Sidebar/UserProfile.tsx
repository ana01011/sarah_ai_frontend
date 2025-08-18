import React, { useState } from 'react';
import { LogOut, MoreVertical, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  return (
    <div 
      className="p-4 border-b relative"
      style={{ borderColor: currentTheme.colors.border }}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={user.picture} 
            alt={user.name}
            className="w-10 h-10 rounded-full ring-2 ring-offset-2"
            style={{ 
              ringColor: currentTheme.colors.primary + '50',
              ringOffsetColor: currentTheme.colors.surface
            }}
            onError={(e) => {
              // Fallback to initials if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div 
            className="w-10 h-10 rounded-full hidden items-center justify-center text-sm font-semibold"
            style={{ 
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
          >
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div 
            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
            style={{ 
              backgroundColor: currentTheme.colors.success,
              borderColor: currentTheme.colors.surface
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate" style={{ color: currentTheme.colors.text }}>
            {user.name}
          </p>
          <p className="text-sm truncate" style={{ color: currentTheme.colors.textSecondary }}>
            {user.email}
          </p>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded-lg transition-colors hover:bg-white/10"
        >
          <MoreVertical className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          className="absolute top-full left-4 right-4 mt-2 backdrop-blur-md border rounded-lg shadow-lg py-1 z-50"
          style={{
            backgroundColor: currentTheme.colors.surface + 'f0',
            borderColor: currentTheme.colors.border
          }}
        >
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center space-x-2 transition-colors"
            style={{ color: currentTheme.colors.text }}
          >
            <Settings className="w-3 h-3" />
            <span>Settings</span>
          </button>
          
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center space-x-2 transition-colors"
            style={{ color: currentTheme.colors.text }}
          >
            <User className="w-3 h-3" />
            <span>Profile</span>
          </button>
          
          <hr className="my-1" style={{ borderColor: currentTheme.colors.border }} />
          
          <button
            onClick={() => {
              logout();
              setShowMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-500/20 flex items-center space-x-2 transition-colors"
            style={{ color: currentTheme.colors.error }}
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};