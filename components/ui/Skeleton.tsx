// -----------------------------------------------------------------------------
// File: Skeleton.tsx
// Path: components/ui/Skeleton.tsx
// -----------------------------------------------------------------------------

import React from 'react'

interface SkeletonProps {
  className?: string
  rounded?:   'sm' | 'md' | 'lg' | 'xl' | 'full'
  style?:     React.CSSProperties
}

const roundedMap = {
  sm:   'rounded',
  md:   'rounded-md',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  full: 'rounded-full',
}

export function Skeleton({ className = '', rounded = 'md', style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={[
        'bg-gradient-to-r from-[#f5f5f4] via-[#fafaf9] to-[#f5f5f4]',
        'bg-[length:200%_100%] animate-[shimmer_2s_infinite_linear]',
        roundedMap[rounded],
        className,
      ].filter(Boolean).join(' ')}
    />
  )
}

// ─── Pre-built compositions ───────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-[3/4]" rounded="xl" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton className="w-2/3 h-3" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-1/3 h-4" />
      </div>
    </div>
  )
}

export function VendorCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full h-28" rounded="xl" />
      <div className="flex items-center gap-3 px-1">
        <Skeleton className="w-12 h-12 shrink-0" rounded="full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
    </div>
  )
}

export function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-[#e5e5e5]">
      <Skeleton className="w-12 h-12 shrink-0" rounded="lg" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-1/4 h-3" />
      </div>
      <Skeleton className="w-20 h-6" rounded="full" />
      <Skeleton className="w-16 h-4" />
    </div>
  )
}

export function ReviewSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 shrink-0" rounded="full" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="w-1/4 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-5/6 h-3" />
      <Skeleton className="w-4/6 h-3" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-3/4" />
        </td>
      ))}
    </tr>
  )
}