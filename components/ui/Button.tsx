// -----------------------------------------------------------------------------
// File: Button.tsx
// Path: components/ui/Button.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'

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
  primary: 'bg-text-primary text-text-inverse border-text-primary hover:bg-neutral-hover hover:border-neutral-hover',
  gold:    'bg-accent-gold text-text-inverse border-accent-gold hover:bg-accent-gold-dark hover:border-accent-gold-dark shadow-gold-sm',
  outline: 'bg-transparent text-text-primary border-border-medium hover:bg-bg-subtle hover:border-text-primary',
  ghost:   'bg-transparent text-text-secondary border-transparent hover:bg-bg-subtle hover:text-text-primary',
  danger:  'bg-error text-text-inverse border-error hover:bg-red-700 hover:border-red-700',
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
    return <Link href={href} className={base}>{content}</Link>
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