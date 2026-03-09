// -----------------------------------------------------------------------------
// File: Badge.tsx
// Path: components/ui/Badge.tsx
// -----------------------------------------------------------------------------

import React from 'react'

type BadgeVariant = 'default' | 'gold' | 'success' | 'warning' | 'error' | 'info' | 'outline'
type BadgeSize    = 'sm' | 'md'

interface BadgeProps {
  variant?:   BadgeVariant
  size?:      BadgeSize
  dot?:       boolean
  children:   React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#f5f5f4] text-[#6b6b6b] border-[#e5e5e5]',
  gold:    'bg-[#f7f1e3] text-[#a8892f] border-[#e8d5a3]',
  success: 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]',
  warning: 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]',
  error:   'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
  info:    'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]',
  outline: 'bg-transparent text-[#6b6b6b] border-[#d1d5db]',
}

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#9ca3af]',
  gold:    'bg-[#c8a951]',
  success: 'bg-[#16a34a]',
  warning: 'bg-[#d97706]',
  error:   'bg-[#dc2626]',
  info:    'bg-[#2563eb]',
  outline: 'bg-[#9ca3af]',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[0.625rem] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
}

export function Badge({
  variant   = 'default',
  size      = 'md',
  dot       = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium border rounded-full leading-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {dot && (
        <span className={[
          'rounded-full shrink-0',
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
          dotClasses[variant],
        ].join(' ')} />
      )}
      {children}
    </span>
  )
}

// ─── Status badge helpers ─────────────────────────────────────────────────────

const orderStatusMap: Record<string, { variant: BadgeVariant; label: string }> = {
  pending:          { variant: 'warning', label: 'Pending' },
  confirmed:        { variant: 'info',    label: 'Confirmed' },
  processing:       { variant: 'info',    label: 'Processing' },
  shipped:          { variant: 'info',    label: 'Shipped' },
  out_for_delivery: { variant: 'gold',    label: 'Out for Delivery' },
  delivered:        { variant: 'success', label: 'Delivered' },
  cancelled:        { variant: 'error',   label: 'Cancelled' },
  refunded:         { variant: 'outline', label: 'Refunded' },
  return_requested: { variant: 'warning', label: 'Return Requested' },
  returned:         { variant: 'outline', label: 'Returned' },
}

export function OrderStatusBadge({ status }: { status: string }) {
  const config = orderStatusMap[status] ?? { variant: 'default' as BadgeVariant, label: status }
  return <Badge variant={config.variant} dot>{config.label}</Badge>
}

const vendorStatusMap: Record<string, { variant: BadgeVariant; label: string }> = {
  active:    { variant: 'success', label: 'Active' },
  pending:   { variant: 'warning', label: 'Pending' },
  suspended: { variant: 'error',   label: 'Suspended' },
  rejected:  { variant: 'error',   label: 'Rejected' },
}

export function VendorStatusBadge({ status }: { status: string }) {
  const config = vendorStatusMap[status] ?? { variant: 'default' as BadgeVariant, label: status }
  return <Badge variant={config.variant} dot>{config.label}</Badge>
}