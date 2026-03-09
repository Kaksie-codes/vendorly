// -----------------------------------------------------------------------------
// File: Dropdown.tsx
// Path: components/ui/Dropdown.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

interface DropdownItem {
  label:     string
  icon?:     React.ReactNode
  onClick?:  () => void
  href?:     string
  danger?:   boolean
  disabled?: boolean
  divider?:  boolean
}

interface DropdownProps {
  trigger:    React.ReactNode
  items:      DropdownItem[]
  align?:     'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, align = 'left', className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [close])

  const itemBase = 'flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-left cursor-pointer transition-colors duration-150'

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div className={[
          'absolute top-full mt-2 z-[100] min-w-[180px]',
          'bg-white border border-[#e5e5e5] rounded-xl',
          'shadow-[0_10px_24px_-4px_rgb(0_0_0_/_0.09),_0_4px_8px_-4px_rgb(0_0_0_/_0.06)]',
          'py-1.5 animate-[scale-in_0.15s_ease-out] origin-top',
          align === 'right' ? 'right-0' : 'left-0',
        ].join(' ')}
        role="menu"
        >
          {items.map((item, i) => {
            if (item.divider) return <hr key={i} className="my-1.5 border-[#e5e5e5]" />

            const cls = [
              itemBase,
              item.danger   ? 'text-[#dc2626] hover:bg-[#fef2f2]' : 'text-[#111111] hover:bg-[#f5f5f4]',
              item.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
            ].filter(Boolean).join(' ')

            if (item.href) {
              return (
                <a key={i} href={item.href} className={cls} role="menuitem" onClick={close}>
                  {item.icon && <span className="shrink-0 text-[#9ca3af]">{item.icon}</span>}
                  {item.label}
                </a>
              )
            }

            return (
              <button
                key={i}
                className={cls}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => { item.onClick?.(); close() }}
              >
                {item.icon && <span className="shrink-0 text-[#9ca3af]">{item.icon}</span>}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}