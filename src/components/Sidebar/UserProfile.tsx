import React, { useState } from 'react';
import { LogOut, MoreVertical, Settings, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  return (
    <div className="p-4 border-b border-gray-200 relative">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name}
              className="w-10 h-10 rounded-full ring-2 ring-blue-500 ring-offset-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ display: user.picture ? 'none' : 'flex' }}
          >
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{user.name}</p>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 transition-colors text-gray-700"
          >
            <Settings className="w-3 h-3" />
            <span>Settings</span>
          </button>
          
          <button
            onClick={() => setShowMenu(false)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 transition-colors text-gray-700"
          >
            <User className="w-3 h-3" />
            <span>Profile</span>
          </button>
          
          <hr className="my-1 border-gray-200" />
          
          <button
            onClick={() => {
              logout();
              setShowMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center space-x-2 transition-colors text-red-600"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};