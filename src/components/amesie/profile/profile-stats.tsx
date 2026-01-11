"use client"

import type React from "react"
import { memo } from "react"
import { ShoppingCart, Star } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}

const StatCard = memo<StatCardProps>(({ title, value, icon, color }) => (
  <div
    className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-${color}-500 transition-colors`}
  >
    <div>
      <p className="text-slate-500 font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
      style={{ backgroundColor: `${color}15` }}
    >
      {icon}
    </div>
  </div>
))

StatCard.displayName = "StatCard"

interface ProfileStatsProps {
  ordersCount?: string
  rating?: number
  primaryColor?: string
}

const ProfileStats = memo<ProfileStatsProps>(({ ordersCount = "29.5K", rating = 4.8, primaryColor = "#fdc500" }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        title="Total Orders"
        value={ordersCount}
        icon={<ShoppingCart size={28} className="text-blue-500" aria-hidden="true" />}
        color="blue"
      />
      <StatCard
        title="Rating"
        value={`${rating}`}
        icon={
          <div className="flex" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={12} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
        }
        color="amber"
      />
    </div>
  )
})

ProfileStats.displayName = "ProfileStats"

export default ProfileStats
