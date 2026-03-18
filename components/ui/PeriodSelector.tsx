// -----------------------------------------------------------------------------
// File: PeriodSelector.tsx
// Path: components/ui/PeriodSelector.tsx
// Reusable time-period toggle (7d / 30d / 90d) — eliminates the copy-pasted
// period selector in vendor/dashboard and admin/dashboard.
// -----------------------------------------------------------------------------

'use client'

import React from 'react'

export type Period = '7d' | '30d' | '90d'

const OPTIONS: { value: Period; label: string }[] = [
  { value: '7d',  label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
]

interface PeriodSelectorProps {
  value:    Period
  onChange: (p: Period) => void
  className?: string
}

export function PeriodSelector({ value, onChange, className = '' }: PeriodSelectorProps) {
  return (
    <div className={`flex gap-1 p-1 bg-[#f5f5f4] rounded-xl ${className}`}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={[
            'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
            value === o.value
              ? 'bg-white text-[#111111] shadow-sm'
              : 'text-[#9ca3af] hover:text-[#6b6b6b]',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
