// -----------------------------------------------------------------------------
// File: Rating.tsx
// Path: components/ui/Rating.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'

interface RatingProps {
  value:        number
  max?:         number
  size?:        'sm' | 'md' | 'lg'
  showValue?:   boolean
  showCount?:   number
  interactive?: boolean
  onChange?:    (value: number) => void
  className?:   string
}

const sizeMap = {
  sm: { star: 'w-3 h-3',   text: 'text-xs'  },
  md: { star: 'w-4 h-4',   text: 'text-sm'  },
  lg: { star: 'w-5 h-5',   text: 'text-base' },
}

export function Rating({
  value,
  max         = 5,
  size        = 'md',
  showValue   = false,
  showCount,
  interactive = false,
  onChange,
  className   = '',
}: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const { star, text } = sizeMap[size]
  const display = hovered ?? value

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHovered(null)}
      >
        {Array.from({ length: max }).map((_, i) => {
          const starVal   = i + 1
          const filled    = display >= starVal
          const half      = !filled && display >= starVal - 0.5

          return (
            <span
              key={i}
              className={[
                star,
                'relative shrink-0',
                interactive ? 'cursor-pointer' : '',
              ].filter(Boolean).join(' ')}
              onMouseEnter={() => interactive && setHovered(starVal)}
              onClick={() => interactive && onChange?.(starVal)}
            >
              {/* Empty star */}
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#e5e5e5]" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>

              {/* Filled overlay */}
              {(filled || half) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: half ? '50%' : '100%' }}>
                  <svg viewBox="0 0 24 24" className="w-full h-full text-[#c8a951]" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
              )}
            </span>
          )
        })}
      </div>

      {showValue && (
        <span className={`font-semibold text-[#111111] ${text}`}>{value.toFixed(1)}</span>
      )}
      {showCount !== undefined && (
        <span className={`text-[#9ca3af] ${text}`}>({showCount.toLocaleString()})</span>
      )}
    </div>
  )
}