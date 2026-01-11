import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Settings, 
  FileText, 
  ShoppingCart, 
  Star, 
  LogOut, 
  ChevronRight,
  Wallet,
  ShieldCheck
} from 'lucide-react';

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  subLabel?: string;
  hasArrow?: boolean;
  onPress: () => void;
  color?: string;
  iconColor?: string;
}

const ProfileListItem: React.FC<MenuItemProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  subLabel,
  hasArrow = true, 
  onPress, 
  color = '#333333',
  iconColor
}) => {
  return (
    <button 
      onClick={onPress}
      className="w-full flex items-center p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-left group"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-5 transition-transform group-hover:scale-110 ${
        color === '#dc3545' ? 'bg-red-50' : 'bg-amber-50'
      }`}>
        <Icon size={22} color={iconColor || (color === '#dc3545' ? '#dc3545' : '#fdc500')} />
      </div>
      
      <div className="flex-1">
        <span className="block text-lg font-semibold" style={{ color }}>
          {label}
        </span>
        {subLabel && (
          <span className="text-sm text-slate-400">{subLabel}</span>
        )}
      </div>
      
      {value && (
        <span className="text-slate-500 font-bold text-lg mr-4 bg-slate-100 px-3 py-1 rounded-lg">
          {value}
        </span>
      )}
      
      {hasArrow && (
        <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
      )}
    </button>
  );
};

export const AmesieProfile: React.FC = () => {
  const { currentTheme } = useTheme();
  const { logout, user } = useAuth();

  return (
    <div className="h-full bg-slate-50 relative overflow-y-auto">
      
      {/* 1. Full-Width Yellow Hero Section */}
      <div 
        className="w-full h-64 relative"
        style={{ 
          backgroundColor: '#fdc500',
        }}
      >
        <div className="max-w-7xl mx-auto px-8 pt-10">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/80 font-medium">Manage your account and settings</p>
        </div>
      </div>

      {/* 2. Main Content - Overlapping Grid */}
      <div className="max-w-7xl mx-auto px-8 -mt-32 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Identity & Balance */}
          <div className="space-y-8">
            {/* Identity Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <User size={40} className="text-slate-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Amesie Seller</h2>
                <p className="text-slate-500">seller@amesie.com</p>
                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Verified Merchant
                </span>
              </div>
            </div>

            {/* Balance Card (Replicating the Mobile Header functionality) */}
            <div className="bg-slate-900 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 text-white/60 mb-2">
                  <Wallet size={18} />
                  <span className="font-medium">Available Balance</span>
                </div>
                
                <div className="flex items-start space-x-1 mb-8">
                  <span className="text-2xl font-semibold mt-2">₹</span>
                  <span className="text-5xl font-bold">500.00</span>
                </div>

                <button className="w-full py-3 rounded-xl bg-[#fdc500] text-slate-900 font-bold hover:brightness-110 transition-all active:scale-95">
                  Withdraw Funds
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings & Actions Grid */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-[#fdc500] transition-colors">
                  <div>
                    <p className="text-slate-500 font-medium mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-800">29.5K</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingCart size={28} />
                  </div>
               </div>

               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-[#fdc500] transition-colors">
                  <div>
                    <p className="text-slate-500 font-medium mb-1">Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-3xl font-bold text-slate-800">4.8</p>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-[#fdc500] text-[#fdc500]" />)}
                      </div>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star size={28} />
                  </div>
               </div>
            </div>

            {/* Menu Groups */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <ProfileListItem 
                icon={User} 
                label="Personal Information" 
                subLabel="Edit your name, email and phone"
                onPress={() => console.log('Personal Info')} 
              />
              <ProfileListItem 
                icon={Settings} 
                label="General Settings" 
                subLabel="Notifications, password, and preferences"
                onPress={() => console.log('Settings')} 
              />
              <ProfileListItem 
                icon={ShieldCheck} 
                label="Security & Login" 
                subLabel="2FA and login history"
                onPress={() => console.log('Security')} 
              />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <ProfileListItem 
                icon={FileText} 
                label="Withdrawal History" 
                onPress={() => console.log('History')} 
              />
              <ProfileListItem 
                icon={LogOut} 
                label="Log Out" 
                onPress={logout}
                color="#dc3545"
                iconColor="#dc3545"
              />
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>Amesie Seller Dashboard • v2.4.0</p>
        </div>
      </div>
    </div>
  );
};