// -----------------------------------------------------------------------------
// File: EmptyState.tsx
// Path: components/ui/EmptyState.tsx
// -----------------------------------------------------------------------------

import React from 'react'

interface EmptyStateProps {
  icon?:        React.ReactNode
  title:        string
  description?: string
  action?:      React.ReactNode
  className?:   string
  size?:        'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { wrapper: 'py-8',  icon: 'w-10 h-10', title: 'text-base', desc: 'text-sm'  },
  md: { wrapper: 'py-12', icon: 'w-12 h-12', title: 'text-lg',   desc: 'text-sm'  },
  lg: { wrapper: 'py-16', icon: 'w-16 h-16', title: 'text-xl',   desc: 'text-base' },
}

export function EmptyState({ icon, title, description, action, className = '', size = 'md' }: EmptyStateProps) {
  const s = sizeMap[size]
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-3 ${s.wrapper} ${className}`}>
      {icon && (
        <div className={`${s.icon} flex items-center justify-center rounded-2xl bg-[#f5f5f4] text-[#9ca3af]`}>
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5 max-w-xs">
        <h3 className={`font-serif font-semibold text-[#111111] ${s.title}`}>{title}</h3>
        {description && <p className={`text-[#6b6b6b] ${s.desc}`}>{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?:      'xs' | 'sm' | 'md' | 'lg'
  className?: string
  label?:     string
}

const spinnerSizes = { xs: 'w-3.5 h-3.5', sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-10 h-10' }

export function Spinner({ size = 'md', className = '', label }: SpinnerProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg className={`${spinnerSizes[size]} animate-spin text-[#c8a951] shrink-0`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {label && <span className="text-sm text-[#6b6b6b]">{label}</span>}
    </div>
  )
}

// ─── Page Loader ──────────────────────────────────────────────────────────────

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Spinner size="lg" label={label} />
    </div>
  )
}