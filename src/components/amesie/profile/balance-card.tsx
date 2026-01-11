"use client"

import { memo } from "react"
import { Wallet } from "lucide-react"
import { PROFILE_COLORS, BALANCE_INITIAL } from "./constants"

interface BalanceCardProps {
  balance?: number
  onWithdraw?: () => void
}

const BalanceCard = memo<BalanceCardProps>(({ balance = BALANCE_INITIAL, onWithdraw }) => {
  const formattedBalance = balance.toFixed(2)

  return (
    <div className="bg-slate-900 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex items-center space-x-2 text-white/60 mb-2">
          <Wallet size={18} aria-hidden="true" />
          <span className="font-medium">Available Balance</span>
        </div>

        <div className="flex items-start space-x-1 mb-8">
          <span className="text-2xl font-semibold mt-2">₹</span>
          <span className="text-5xl font-bold">{formattedBalance}</span>
        </div>

        <button
          onClick={onWithdraw}
          className="w-full py-3 rounded-xl font-bold transition-all active:scale-95 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ backgroundColor: PROFILE_COLORS.primary, color: "#1f2937" }}
          aria-label="Withdraw funds"
        >
          Withdraw Funds
        </button>
      </div>
    </div>
  )
})

BalanceCard.displayName = "BalanceCard"

export default BalanceCard
