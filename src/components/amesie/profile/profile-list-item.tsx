"use client"

import { memo } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { PROFILE_COLORS } from "./constants"

interface ProfileListItemProps {
  icon: LucideIcon
  label: string
  value?: string
  subLabel?: string
  hasArrow?: boolean
  onPress: () => void
  color?: string
  iconColor?: string
  ariaLabel?: string
}

const getBackgroundColor = (color: string): string => {
  if (color === PROFILE_COLORS.destructive) return "bg-red-50"
  return "bg-amber-50"
}

const ProfileListItem = memo<ProfileListItemProps>(
  ({
    icon: Icon,
    label,
    value,
    subLabel,
    hasArrow = true,
    onPress,
    color = PROFILE_COLORS.accent,
    iconColor,
    ariaLabel,
  }) => {
    return (
      <button
        onClick={onPress}
        aria-label={ariaLabel || label}
        className="w-full flex items-center p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 text-left group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-5 transition-transform group-hover:scale-110 ${getBackgroundColor(color)}`}
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
          <span className="text-slate-500 font-bold text-lg mr-4 bg-slate-100 px-3 py-1 rounded-lg whitespace-nowrap">
            {value}
          </span>
        )}

        {hasArrow && (
          <ChevronRight
            size={20}
            className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0"
          />
        )}
      </button>
    )
  },
)

ProfileListItem.displayName = "ProfileListItem"

export default ProfileListItem
