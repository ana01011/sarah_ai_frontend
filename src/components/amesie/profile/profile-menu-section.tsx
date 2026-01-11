"use client"

import type React from "react"
import { memo } from "react"
import ProfileListItem from "./profile-list-item"
import { PROFILE_COLORS } from "./constants"

interface MenuItem {
  icon: React.ComponentType<{ size: number; color?: string }>
  label: string
  subLabel?: string
  onPress: () => void
  isDangerous?: boolean
}

interface ProfileMenuSectionProps {
  items: MenuItem[]
}

const ProfileMenuSection = memo<ProfileMenuSectionProps>(({ items }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {items.map((item, index) => (
        <ProfileListItem
          key={`${item.label}-${index}`}
          icon={item.icon}
          label={item.label}
          subLabel={item.subLabel}
          onPress={item.onPress}
          color={item.isDangerous ? PROFILE_COLORS.destructive : undefined}
          iconColor={item.isDangerous ? PROFILE_COLORS.destructive : undefined}
        />
      ))}
    </div>
  )
})

ProfileMenuSection.displayName = "ProfileMenuSection"

export default ProfileMenuSection
