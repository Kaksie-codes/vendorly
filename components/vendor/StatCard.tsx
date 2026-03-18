// -----------------------------------------------------------------------------
// File: StatCard.tsx
// Path: components/vendor/StatCard.tsx
// Shared stat card used in both vendor dashboard and admin dashboard.
// iconBg / iconColor are optional — defaults to the gold palette used in
// the vendor portal. Admin dashboard passes its own colours (green, blue, etc.)
// -----------------------------------------------------------------------------

import React from 'react'

type Props = {
  label:       string
  value:       string
  change:      string
  positive:    boolean
  icon:        React.ReactNode
  /** Override icon background (Tailwind class). Defaults to '#f7f1e3' gold tint. */
  iconBg?:     string
  /** Override icon colour (Tailwind class). Defaults to '#c8a951' gold. */
  iconColor?:  string
  /** Optional secondary line below the value (used in admin cards). */
  sub?:        string
}

export function StatCard({ label, value, change, positive, icon, iconBg, iconColor, sub }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg ?? 'bg-[#f7f1e3]'} ${iconColor ?? 'text-[#c8a951]'}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="font-serif text-2xl font-bold text-[#111111] leading-none">{value}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${positive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {positive
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
            }
            {change}
          </span>
          {sub
            ? <span className="text-xs text-[#9ca3af]">{sub}</span>
            : <span className="text-xs text-[#9ca3af]">vs last period</span>
          }
        </div>
      </div>
    </div>
  )
}
