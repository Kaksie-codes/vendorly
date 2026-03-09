// -----------------------------------------------------------------------------
// File: Avatar.tsx
// Path: components/ui/Avatar.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Image from 'next/image'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface AvatarProps {
  src?:       string
  alt?:       string
  fallback?:  string
  size?:      AvatarSize
  className?: string
  online?:    boolean
}

const sizeMap: Record<AvatarSize, { wrapper: string; text: string; indicator: string }> = {
  xs:  { wrapper: 'w-6 h-6',   text: 'text-[0.5rem]', indicator: 'w-1.5 h-1.5 border' },
  sm:  { wrapper: 'w-8 h-8',   text: 'text-xs',        indicator: 'w-2 h-2 border' },
  md:  { wrapper: 'w-10 h-10', text: 'text-sm',         indicator: 'w-2.5 h-2.5 border-2' },
  lg:  { wrapper: 'w-12 h-12', text: 'text-base',       indicator: 'w-3 h-3 border-2' },
  xl:  { wrapper: 'w-16 h-16', text: 'text-lg',         indicator: 'w-3.5 h-3.5 border-2' },
  '2xl': { wrapper: 'w-20 h-20', text: 'text-xl',       indicator: 'w-4 h-4 border-2' },
}

const colorPool = [
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
]

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function pickColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colorPool[Math.abs(hash) % colorPool.length]
}

export function Avatar({ src, alt = '', fallback, size = 'md', className = '', online }: AvatarProps) {
  const { wrapper, text, indicator } = sizeMap[size]
  const initials   = fallback ?? getInitials(alt)
  const colorClass = pickColor(initials)

  return (
    <div className={`relative inline-flex shrink-0 ${wrapper} ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill className="rounded-full object-cover" sizes="80px" />
      ) : (
        <div className={`w-full h-full rounded-full flex items-center justify-center font-semibold select-none ${text} ${colorClass}`}>
          {initials}
        </div>
      )}

      {online !== undefined && (
        <span className={[
          'absolute bottom-0 right-0 rounded-full border-white',
          indicator,
          online ? 'bg-[#16a34a]' : 'bg-[#9ca3af]',
        ].join(' ')} />
      )}
    </div>
  )
}

// ─── Avatar Group ─────────────────────────────────────────────────────────────

interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt?: string }>
  max?:    number
  size?:   AvatarSize
}

export function AvatarGroup({ avatars, max = 4, size = 'sm' }: AvatarGroupProps) {
  const { wrapper, text } = sizeMap[size]
  const visible  = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div className="flex items-center">
      {visible.map((a, i) => (
        <div key={i} className={`${wrapper} relative -ml-2 first:ml-0 rounded-full ring-2 ring-white`}>
          <Avatar src={a.src} alt={a.alt} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div className={`${wrapper} ${text} -ml-2 rounded-full ring-2 ring-white bg-[#f5f5f4] text-[#6b6b6b] font-medium flex items-center justify-center`}>
          +{overflow}
        </div>
      )}
    </div>
  )
}