'use client'

// -----------------------------------------------------------------------------
// File: Select.tsx
// Path: components/ui/Select.tsx
// -----------------------------------------------------------------------------

import React, { useState, useRef, useEffect, useId } from 'react'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface SelectProps {
  options:      SelectOption[]
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  label?:       string
  size?:        'sm' | 'md' | 'lg'
  disabled?:    boolean
  className?:   string
  /** Show a gold accent on the selected item */
  accentSelected?: boolean
}

const sizeStyles = {
  sm: { trigger: 'px-3 py-1.5 text-xs gap-1.5',  chevron: 12, item: 'px-3 py-1.5 text-xs' },
  md: { trigger: 'px-3.5 py-2.5 text-sm gap-2',   chevron: 14, item: 'px-3.5 py-2 text-sm'  },
  lg: { trigger: 'px-4 py-3 text-base gap-2.5',   chevron: 16, item: 'px-4 py-2.5 text-sm'  },
}

export function Select({
  options,
  value,
  onChange,
  placeholder  = 'Select…',
  label,
  size         = 'md',
  disabled     = false,
  className    = '',
  accentSelected = true,
}: SelectProps) {
  const [open,    setOpen]    = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const containerRef          = useRef<HTMLDivElement>(null)
  const listRef               = useRef<HTMLUListElement>(null)
  const id                    = useId()

  const selected = options.find((o) => o.value === value)
  const sz       = sizeStyles[size]

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    const currentIndex = options.findIndex((o) => o.value === (focused ?? value))

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (open && focused) { onChange(focused); setOpen(false) }
        else setOpen(true)
        break
      case 'Escape':
        setOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!open) { setOpen(true); break }
        const next = options.findIndex((o, i) => i > currentIndex && !o.disabled)
        if (next !== -1) setFocused(options[next].value)
        break
      case 'ArrowUp':
        e.preventDefault()
        const prev = [...options].reverse().findIndex((o, i) => options.length - 1 - i < currentIndex && !o.disabled)
        if (prev !== -1) setFocused(options[options.length - 1 - prev].value)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return
    onChange(opt.value)
    setOpen(false)
    setFocused(null)
  }

  return (
    <div ref={containerRef} className={`relative z-50 ${className}`}>
      {/* Optional label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={[
          'relative flex items-center w-full',
          'bg-bg-primary border rounded-xl',
          'font-medium text-text-primary',
          'cursor-pointer select-none',
          'transition-all duration-150',
          open
            ? 'border-accent-gold shadow-[0_0_0_3px_rgb(200_169_81/0.12)]'
            : 'border-border-subtle hover:border-border-medium',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          sz.trigger,
        ].filter(Boolean).join(' ')}
      >
        {/* Selected icon */}
        {selected?.icon && (
          <span className="shrink-0 text-text-secondary">{selected.icon}</span>
        )}

        {/* Label */}
        <span className={`flex-1 text-left truncate ${!selected ? 'text-text-muted' : ''}`}>
          {selected?.label ?? placeholder}
        </span>

        {/* Chevron */}
        <span
          className={`shrink-0 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <svg
            width={sz.chevron}
            height={sz.chevron}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label ?? placeholder}
          className={[
            'absolute z-dropdown mt-1.5 w-full min-w-40',
            'bg-bg-primary border border-border-subtle rounded-xl',
            'shadow-lg overflow-hidden',
            'animate-[scale-in_0.15s_ease-out]',
            'origin-top',
            'py-1',
          ].join(' ')}
          style={{ transformOrigin: 'top center' }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            const isFocused  = opt.value === focused

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                onMouseEnter={() => !opt.disabled && setFocused(opt.value)}
                onMouseLeave={() => setFocused(null)}
                onClick={() => handleSelect(opt)}
                className={[
                  'flex items-center gap-2.5 cursor-pointer select-none transition-colors duration-100',
                  sz.item,
                  opt.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : isFocused
                      ? 'bg-bg-subtle'
                      : '',
                  isSelected && accentSelected
                    ? 'text-accent-gold-dark'
                    : isSelected
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary',
                ].filter(Boolean).join(' ')}
              >
                {/* Option icon */}
                {opt.icon && (
                  <span className="shrink-0">{opt.icon}</span>
                )}

                {/* Option label */}
                <span className="flex-1 truncate">{opt.label}</span>

                {/* Selected checkmark */}
                {isSelected && (
                  <span className="shrink-0 ml-auto">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-accent-gold)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}