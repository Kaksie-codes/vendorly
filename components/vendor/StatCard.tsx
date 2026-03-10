// -----------------------------------------------------------------------------
// File: StatCard.tsx
// Path: components/vendor/StatCard.tsx
// -----------------------------------------------------------------------------

import React from 'react'

type Props = {
  label:    string
  value:    string
  change:   string
  positive: boolean
  icon:     React.ReactNode
}

export function StatCard({ label, value, change, positive, icon }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-[#f7f1e3] flex items-center justify-center text-[#c8a951]">
          {icon}
        </div>
      </div>
      <div>
        <p className="font-serif text-2xl font-bold text-[#111111] leading-none">{value}</p>
        <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1.5 ${positive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
          {positive
            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
            : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
          }
          {change} vs last period
        </span>
      </div>
    </div>
  )
}