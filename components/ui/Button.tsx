// -----------------------------------------------------------------------------
// File: Button.tsx
// Path: components/ui/Button.tsx
// -----------------------------------------------------------------------------

import React from 'react'

type ButtonVariant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger'
type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  loading?:   boolean
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  href?:      string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#111111] text-white border-[#111111] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]',
  gold:    'bg-[#c8a951] text-white border-[#c8a951] hover:bg-[#a8892f] hover:border-[#a8892f] shadow-[0_2px_8px_-2px_rgb(200_169_81_/_0.35)]',
  outline: 'bg-transparent text-[#111111] border-[#d1d5db] hover:bg-[#f5f5f4] hover:border-[#111111]',
  ghost:   'bg-transparent text-[#6b6b6b] border-transparent hover:bg-[#f5f5f4] hover:text-[#111111]',
  danger:  'bg-[#dc2626] text-white border-[#dc2626] hover:bg-red-700 hover:border-red-700',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-xs gap-1',
  sm: 'px-4 py-2 text-[0.8125rem] gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  xl: 'px-8 py-3.5 text-base gap-2.5',
}

export function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  href,
  ...props
}: ButtonProps) {
  const base = [
    'inline-flex items-center justify-center font-medium leading-none',
    'whitespace-nowrap border rounded-lg cursor-pointer select-none no-underline',
    'transition-all duration-200 active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <>
      {loading ? (
        <ButtonSpinner />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </>
  )

  if (href) {
    return <a href={href} className={base}>{content}</a>
  }

  return (
    <button className={base} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
}

function ButtonSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}