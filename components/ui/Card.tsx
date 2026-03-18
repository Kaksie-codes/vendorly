// -----------------------------------------------------------------------------
// File: Card.tsx
// Path: components/ui/Card.tsx
// Shared card wrapper — replaces inline Card() in vendor/settings and
// FormSection() in vendor/ProductForm. Use this everywhere a white, bordered,
// rounded section with a titled header is needed.
// -----------------------------------------------------------------------------

import React from 'react'

interface CardProps {
  title?:     string
  children:   React.ReactNode
  className?: string
  /** Optional element rendered in the top-right corner of the header */
  action?:    React.ReactNode
}

export function Card({ title, children, className = '', action }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#e5e5e5] p-5 sm:p-6 flex flex-col gap-4 ${className}`}>
      {title && (
        <div className="flex items-center justify-between pb-3 border-b border-[#f5f5f4]">
          <h3 className="font-semibold text-[#111111] text-base">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
