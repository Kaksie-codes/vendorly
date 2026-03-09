// -----------------------------------------------------------------------------
// File: Tabs.tsx
// Path: components/ui/Tabs.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'

interface Tab {
  key:       string
  label:     string
  icon?:     React.ReactNode
  count?:    number
  disabled?: boolean
}

type TabsVariant = 'line' | 'pill' | 'boxed'

interface TabsProps {
  tabs:           Tab[]
  defaultActive?: string
  active?:        string
  onChange?:      (key: string) => void
  variant?:       TabsVariant
  className?:     string
}

export function Tabs({
  tabs,
  defaultActive,
  active: controlled,
  onChange,
  variant   = 'line',
  className = '',
}: TabsProps) {
  const [internal, setInternal] = useState(defaultActive ?? tabs[0]?.key ?? '')
  const active = controlled ?? internal

  const select = (key: string) => { setInternal(key); onChange?.(key) }

  // ── Pill ──────────────────────────────────────────────────────────────────
  if (variant === 'pill') {
    return (
      <div className={`flex items-center gap-1 bg-[#f5f5f4] rounded-xl p-1 ${className}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            disabled={tab.disabled}
            onClick={() => select(tab.key)}
            className={[
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg',
              'transition-all duration-200 whitespace-nowrap',
              active === tab.key
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-[#6b6b6b] hover:text-[#111111]',
              tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ].filter(Boolean).join(' ')}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                active === tab.key ? 'bg-[#f5f5f4] text-[#6b6b6b]' : 'bg-[#e5e5e5] text-[#9ca3af]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  // ── Boxed ─────────────────────────────────────────────────────────────────
  if (variant === 'boxed') {
    return (
      <div className={`flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden ${className}`} role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            disabled={tab.disabled}
            onClick={() => select(tab.key)}
            className={[
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap',
              'transition-colors duration-150 flex-1 justify-center',
              i > 0 ? 'border-l border-[#e5e5e5]' : '',
              active === tab.key
                ? 'bg-[#111111] text-white'
                : 'bg-white text-[#6b6b6b] hover:bg-[#f5f5f4]',
              tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ].filter(Boolean).join(' ')}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  // ── Line (default) ────────────────────────────────────────────────────────
  return (
    <div className={`border-b border-[#e5e5e5] ${className}`} role="tablist">
      <div className="flex items-end -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            disabled={tab.disabled}
            onClick={() => select(tab.key)}
            className={[
              'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap',
              'border-b-2 transition-all duration-150',
              active === tab.key
                ? 'border-[#c8a951] text-[#111111]'
                : 'border-transparent text-[#6b6b6b] hover:text-[#111111] hover:border-[#d1d5db]',
              tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ].filter(Boolean).join(' ')}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-xs bg-[#f5f5f4] text-[#9ca3af] px-1.5 py-0.5 rounded-full font-medium">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}