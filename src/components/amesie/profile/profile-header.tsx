"use client"

import { memo } from "react"
import { User } from "lucide-react"
import { PROFILE_BADGES } from "./constants"

interface ProfileHeaderProps {
  userName: string
  email: string
}

const ProfileHeader = memo<ProfileHeaderProps>(({ userName, email }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0">
        <User size={40} className="text-slate-400" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-slate-800">{userName}</h2>
        <p className="text-slate-500">{email}</p>
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full ${PROFILE_BADGES.verified.bg} ${PROFILE_BADGES.verified.text}`}
        >
          {PROFILE_BADGES.verified.label}
        </span>
      </div>
    </div>
  )
})

ProfileHeader.displayName = "ProfileHeader"

export default ProfileHeader
