"use client"

import type React from "react"
import { User, Settings, FileText, ShoppingCart, Star, LogOut, ChevronRight, Wallet, ShieldCheck } from "lucide-react"
import { memo } from "react"

// Constants
const PROFILE_COLORS = {
  primary: "#fdc500",
  destructive: "#dc3545",
  accent: "#333333",
} as const

const PROFILE_BADGES = {
  verified: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Verified Merchant",
  },
} as const

const BALANCE_INITIAL = 500.0
const PROFILE_VERSION = "v2.4.0"

// ProfileListItem Component
interface MenuItemProps {
  icon: React.ElementType
  label: string
  value?: string
  subLabel?: string
  hasArrow?: boolean
  onPress: () => void
  color?: string
  iconColor?: string
}

const ProfileListItem = memo<MenuItemProps>(
  ({ icon: Icon, label, value, subLabel, hasArrow = true, onPress, color = PROFILE_COLORS.accent, iconColor }) => {
    const bgColor = color === PROFILE_COLORS.destructive ? "bg-red-50" : "bg-amber-50"

    return (
      <button
        onClick={onPress}
        className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-left group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${bgColor}`}
        >
          <Icon
            size={22}
            color={
              iconColor || (color === PROFILE_COLORS.destructive ? PROFILE_COLORS.destructive : PROFILE_COLORS.primary)
            }
            aria-hidden="true"
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="block text-lg font-semibold truncate" style={{ color }}>
            {label}
          </span>
          {subLabel && <span className="text-sm text-slate-400 line-clamp-2">{subLabel}</span>}
        </div>

        {value && (
          <span className="text-slate-500 font-bold text-lg bg-slate-100 px-3 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
            {value}
          </span>
        )}

        {hasArrow && (
          <ChevronRight
            size={20}
            className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0"
            aria-hidden="true"
          />
        )}
      </button>
    )
  },
)
ProfileListItem.displayName = "ProfileListItem"

// Main Component
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
  balance = BALANCE_INITIAL,
  ordersCount = "29.5K",
  rating = 4.8,
  onLogout = () => console.log("Logout"),
  onPersonalInfo = () => console.log("Personal Info"),
  onSettings = () => console.log("Settings"),
  onSecurity = () => console.log("Security"),
  onHistory = () => console.log("History"),
  onWithdraw = () => console.log("Withdraw"),
}) => {
  const formattedBalance = balance.toFixed(2)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="w-full h-64 flex-shrink-0" style={{ backgroundColor: PROFILE_COLORS.primary }} role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/80 font-medium">Manage your account and settings</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-32 pb-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Identity & Balance */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <User size={40} className="text-slate-400" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-slate-800 truncate">{userName}</h2>
                  <p className="text-slate-500 truncate">{email}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 ${PROFILE_BADGES.verified.bg} ${PROFILE_BADGES.verified.text} text-xs font-bold rounded-full whitespace-nowrap`}
                  >
                    {PROFILE_BADGES.verified.label}
                  </span>
                </div>
              </div>

              {/* Balance Card */}
              <div className="bg-slate-900 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <Wallet size={18} aria-hidden="true" />
                    <span className="font-medium">Available Balance</span>
                  </div>

                  <div className="flex items-start gap-1 mb-8">
                    <span className="text-2xl font-semibold mt-2">₹</span>
                    <span className="text-5xl font-bold">{formattedBalance}</span>
                  </div>

                  <button
                    onClick={onWithdraw}
                    className="w-full py-3 rounded-xl font-bold transition-all active:scale-95 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white text-slate-900"
                    style={{ backgroundColor: PROFILE_COLORS.primary }}
                    aria-label="Withdraw funds"
                  >
                    Withdraw Funds
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Settings & Actions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-[#fdc500] transition-colors">
                  <div className="min-w-0">
                    <p className="text-slate-500 font-medium mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-800">{ordersCount}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ShoppingCart size={28} aria-hidden="true" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-[#fdc500] transition-colors">
                  <div className="min-w-0">
                    <p className="text-slate-500 font-medium mb-1">Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-slate-800">{rating}</p>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className="fill-[#fdc500] text-[#fdc500]" aria-hidden="true" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Star size={28} aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Menu Groups */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <ProfileListItem
                  icon={User}
                  label="Personal Information"
                  subLabel="Edit your name, email and phone"
                  onPress={onPersonalInfo}
                />
                <ProfileListItem
                  icon={Settings}
                  label="General Settings"
                  subLabel="Notifications, password, and preferences"
                  onPress={onSettings}
                />
                <ProfileListItem
                  icon={ShieldCheck}
                  label="Security & Login"
                  subLabel="2FA and login history"
                  onPress={onSecurity}
                />
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <ProfileListItem icon={FileText} label="Withdrawal History" onPress={onHistory} />
                <ProfileListItem
                  icon={LogOut}
                  label="Log Out"
                  onPress={onLogout}
                  color={PROFILE_COLORS.destructive}
                  iconColor={PROFILE_COLORS.destructive}
                />
              </div>
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
