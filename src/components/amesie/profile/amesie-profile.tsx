// "use client"

// import type React from "react"
// import { User, Settings, FileText, LogOut, ShieldCheck } from "lucide-react"
// import ProfileHeader from "./profile-header"
// import BalanceCard from "./balance-card"
// import ProfileStats from "./profile-stats"
// import ProfileMenuSection from "./profile-menu-section"
// import { PROFILE_COLORS, PROFILE_VERSION } from "./constants"

// interface AmesieProfileProps {
//   userName?: string
//   email?: string
//   balance?: number
//   ordersCount?: string
//   rating?: number
//   onLogout?: () => void
//   onPersonalInfo?: () => void
//   onSettings?: () => void
//   onSecurity?: () => void
//   onHistory?: () => void
//   onWithdraw?: () => void
// }

// const AmesieProfile: React.FC<AmesieProfileProps> = ({
//   userName = "Amesie Seller",
//   email = "seller@amesie.com",
//   balance,
//   ordersCount,
//   rating,
//   onLogout = () => console.log("Logout"),
//   onPersonalInfo = () => console.log("Personal Info"),
//   onSettings = () => console.log("Settings"),
//   onSecurity = () => console.log("Security"),
//   onHistory = () => console.log("History"),
//   onWithdraw,
// }) => {
//   const menuItems = [
//     {
//       icon: User,
//       label: "Personal Information",
//       subLabel: "Edit your name, email and phone",
//       onPress: onPersonalInfo,
//     },
//     {
//       icon: Settings,
//       label: "General Settings",
//       subLabel: "Notifications, password, and preferences",
//       onPress: onSettings,
//     },
//     {
//       icon: ShieldCheck,
//       label: "Security & Login",
//       subLabel: "2FA and login history",
//       onPress: onSecurity,
//     },
//   ]

//   const bottomMenuItems = [
//     {
//       icon: FileText,
//       label: "Withdrawal History",
//       onPress: onHistory,
//     },
//     {
//       icon: LogOut,
//       label: "Log Out",
//       onPress: onLogout,
//       isDangerous: true,
//     },
//   ]

//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50">
//       {/* Hero Section */}
//       {/* <div className="w-full h-64 flex-shrink-0" style={{ backgroundColor: PROFILE_COLORS.primary }} role="banner">
//         <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
//           <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
//           <p className="text-white/80 font-medium">Manage your account and settings</p>
//         </div>
//       </div> */}

//       {/* Main Content */}
//       <div className="flex-1">
//         {/* <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-32 pb-12 relative z-10">
//          */}
//          <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-20 sm:-mt-32 pb-12 relative z-10">
//           {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//            */}
//            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
//             {/* Sidebar */}
//             <div className="space-y-8">
//               <ProfileHeader userName={userName} email={email} />
//               <BalanceCard balance={balance} onWithdraw={onWithdraw} />
//             </div>

//             {/* Main Content Area */}
//             <div className="lg:col-span-2 space-y-8">
//               <ProfileStats ordersCount={ordersCount} rating={rating} primaryColor={PROFILE_COLORS.primary} />
//               <ProfileMenuSection items={menuItems} />
//               <ProfileMenuSection items={bottomMenuItems} />
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-center mt-12 text-slate-400 text-sm">
//             <p>Amesie Seller Dashboard • {PROFILE_VERSION}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AmesieProfile

import React from 'react';
// import { useTheme } from '../../contexts/ThemeContext';
import { useTheme } from '../../../contexts/ThemeContext';
// import { useAuth } from '../../contexts/AuthContext';
import { useAuth } from '../../../contexts/AuthContext';
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
      className="w-full flex items-center p-4 sm:p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-left group"
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mr-3 sm:mr-5 transition-transform group-hover:scale-110 ${
        color === '#dc3545' ? 'bg-red-50' : 'bg-amber-50'
      }`}>
        <Icon size={20} className="sm:w-6 sm:h-6" color={iconColor || (color === '#dc3545' ? '#dc3545' : '#fdc500')} />
      </div>
      
      <div className="flex-1 min-w-0">
        <span className="block text-base sm:text-lg font-semibold truncate" style={{ color }}>
          {label}
        </span>
        {subLabel && (
          <span className="text-xs sm:text-sm text-slate-400 truncate block">{subLabel}</span>
        )}
      </div>
      
      {value && (
        <span className="text-slate-500 font-bold text-sm sm:text-lg mr-2 sm:mr-4 bg-slate-100 px-2 sm:px-3 py-1 rounded-lg">
          {value}
        </span>
      )}
      
      {hasArrow && (
        <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors sm:w-5 sm:h-5" />
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
        className="w-full h-48 sm:h-64 relative transition-all duration-300"
        style={{ 
          backgroundColor: '#fdc500',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10">
          {/* UPDATED: Smaller fonts on mobile (text-2xl), larger on desktop (md:text-3xl) */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">My Profile</h1>
          <p className="text-sm md:text-base text-white/80 font-medium">Manage your account and settings</p>
        </div>
      </div>

      {/* 2. Main Content - Overlapping Grid */}
      {/* UPDATED: Adjusted negative margin for mobile (-mt-24) vs desktop (-mt-32) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-24 sm:-mt-32 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* LEFT COLUMN: Identity & Balance */}
          <div className="space-y-6 sm:space-y-8">
            {/* Identity Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <User size={32} className="text-slate-400 sm:w-10 sm:h-10" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">Amesie Seller</h2>
                <p className="text-sm sm:text-base text-slate-500 truncate">seller@amesie.com</p>
                <span className="inline-block mt-1 sm:mt-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold rounded-full">
                  Verified Merchant
                </span>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-24 sm:p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 text-white/60 mb-2">
                  <Wallet size={16} className="sm:w-[18px]" />
                  <span className="font-medium text-sm sm:text-base">Available Balance</span>
                </div>
                
                <div className="flex items-start space-x-1 mb-6 sm:mb-8">
                  <span className="text-xl sm:text-2xl font-semibold mt-1 sm:mt-2">₹</span>
                  <span className="text-4xl sm:text-5xl font-bold">500.00</span>
                </div>

                <button className="w-full py-2.5 sm:py-3 rounded-xl bg-[#fdc500] text-slate-900 text-sm sm:text-base font-bold hover:brightness-110 transition-all active:scale-95">
                  Withdraw Funds
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings & Actions Grid */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
               <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer hover:border-[#fdc500] transition-colors">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Total Orders</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800">29.5K</p>
                  </div>
                  <div className="order-1 sm:order-2 w-10 h-10 sm:w-14 sm:h-14 bg-blue-50 text-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-0 group-hover:scale-110 transition-transform">
                    <ShoppingCart size={20} className="sm:w-7 sm:h-7" />
                  </div>
               </div>

               <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer hover:border-[#fdc500] transition-colors">
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800">4.8</p>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-[#fdc500] text-[#fdc500] sm:w-3 sm:h-3" />)}
                      </div>
                    </div>
                  </div>
                  <div className="order-1 sm:order-2 w-10 h-10 sm:w-14 sm:h-14 bg-amber-50 text-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-0 group-hover:scale-110 transition-transform">
                    <Star size={20} className="sm:w-7 sm:h-7" />
                  </div>
               </div>
            </div>

            {/* Menu Groups */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
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

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
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
        <div className="text-center mt-8 sm:mt-12 text-slate-400 text-xs sm:text-sm">
          <p>Amesie Seller Dashboard • v2.4.0</p>
        </div>
      </div>
    </div>
  );
};