"use client"

import type React from "react"
import { User, Settings, FileText, LogOut, ShieldCheck } from "lucide-react"
import ProfileHeader from "./profile-header"
import BalanceCard from "./balance-card"
import ProfileStats from "./profile-stats"
import ProfileMenuSection from "./profile-menu-section"
import { PROFILE_COLORS, PROFILE_VERSION } from "./constants"

interface AmesieProfileProps {
  userName?: string
  email?: string
  balance?: number
  ordersCount?: string
  rating?: number
  onLogout?: () => void
  onPersonalInfo?: () => void
  onSettings?: () => void
  onSecurity?: () => void
  onHistory?: () => void
  onWithdraw?: () => void
}

const AmesieProfile: React.FC<AmesieProfileProps> = ({
  userName = "Amesie Seller",
  email = "seller@amesie.com",
  balance,
  ordersCount,
  rating,
  onLogout = () => console.log("Logout"),
  onPersonalInfo = () => console.log("Personal Info"),
  onSettings = () => console.log("Settings"),
  onSecurity = () => console.log("Security"),
  onHistory = () => console.log("History"),
  onWithdraw,
}) => {
  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      subLabel: "Edit your name, email and phone",
      onPress: onPersonalInfo,
    },
    {
      icon: Settings,
      label: "General Settings",
      subLabel: "Notifications, password, and preferences",
      onPress: onSettings,
    },
    {
      icon: ShieldCheck,
      label: "Security & Login",
      subLabel: "2FA and login history",
      onPress: onSecurity,
    },
  ]

  const bottomMenuItems = [
    {
      icon: FileText,
      label: "Withdrawal History",
      onPress: onHistory,
    },
    {
      icon: LogOut,
      label: "Log Out",
      onPress: onLogout,
      isDangerous: true,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="w-full h-64 flex-shrink-0" style={{ backgroundColor: PROFILE_COLORS.primary }} role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/80 font-medium">Manage your account and settings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-32 pb-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-8">
              <ProfileHeader userName={userName} email={email} />
              <BalanceCard balance={balance} onWithdraw={onWithdraw} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              <ProfileStats ordersCount={ordersCount} rating={rating} primaryColor={PROFILE_COLORS.primary} />
              <ProfileMenuSection items={menuItems} />
              <ProfileMenuSection items={bottomMenuItems} />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-slate-400 text-sm">
            <p>Amesie Seller Dashboard • {PROFILE_VERSION}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmesieProfile
