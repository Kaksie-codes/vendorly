// -----------------------------------------------------------------------------
// File: Input.tsx
// Path: components/ui/Input.tsx
// -----------------------------------------------------------------------------

import React from 'react'

// ─── Shared focus ring class ──────────────────────────────────────────────────
const focusRing = 'focus:outline-none focus:border-[#c8a951] focus:shadow-[0_0_0_3px_rgb(200_169_81_/_0.12)]'
const errorRing = 'border-[#dc2626] focus:border-[#dc2626] focus:shadow-[0_0_0_3px_rgb(220_38_38_/_0.12)]'
const baseField = 'w-full text-sm text-[#111111] bg-white border border-[#e5e5e5] rounded-lg transition-all duration-150 placeholder:text-[#9ca3af] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f5f5f4]'

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:            string
  error?:            string
  hint?:             string
  leftIcon?:         React.ReactNode
  rightIcon?:        React.ReactNode
  onRightIconClick?: () => void
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconClick,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#111111]">
          {label}
          {props.required && <span className="text-[#dc2626] ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[#9ca3af] pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          className={[
            baseField,
            'py-2.5',
            leftIcon  ? 'pl-9'   : 'pl-3.5',
            rightIcon ? 'pr-9'   : 'pr-3.5',
            error ? errorRing : focusRing,
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />

        {rightIcon && (
          <span
            className={[
              'absolute right-3 text-[#9ca3af]',
              onRightIconClick
                ? 'cursor-pointer hover:text-[#111111] transition-colors'
                : 'pointer-events-none',
            ].join(' ')}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </span>
        )}
      </div>

      {error   && <p className="text-xs text-[#dc2626]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?:  string
}

export function Textarea({ label, error, hint, className = '', id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#111111]">
          {label}
          {props.required && <span className="text-[#dc2626] ml-1">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        className={[
          baseField,
          'px-3.5 py-2.5 min-h-[100px] resize-y',
          error ? errorRing : focusRing,
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      />

      {error   && <p className="text-xs text-[#dc2626]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectOption {
  value:     string
  label:     string
  disabled?: boolean
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string
  error?:       string
  hint?:        string
  options:      SelectOption[]
  placeholder?: string
}

export function Select({ label, error, hint, options, placeholder, className = '', id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#111111]">
          {label}
          {props.required && <span className="text-[#dc2626] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={inputId}
          className={[
            baseField,
            'pl-3.5 pr-9 py-2.5 appearance-none cursor-pointer',
            error ? errorRing : focusRing,
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>

      {error   && <p className="text-xs text-[#dc2626]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#9ca3af]">{hint}</p>}
    </div>
  )
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?:       string
  description?: string
  error?:       string
}

export function Checkbox({ label, description, error, className = '', id, ...props }: CheckboxProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input type="checkbox" id={inputId} className="sr-only peer" {...props} />
          <div className={[
            'w-[18px] h-[18px] rounded-[4px] border-2 border-[#d1d5db] bg-white',
            'peer-checked:bg-[#111111] peer-checked:border-[#111111]',
            'peer-focus-visible:shadow-[0_0_0_3px_rgb(200_169_81_/_0.2)]',
            'group-hover:border-[#6b6b6b] transition-all duration-150',
            'flex items-center justify-center',
            error ? 'border-[#dc2626]' : '',
          ].filter(Boolean).join(' ')}>
            <svg
              className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 12 10"
              fill="none"
            >
              <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-[#111111] leading-snug">{label}</span>
          )}
          {description && (
            <span className="text-xs text-[#9ca3af] mt-0.5">{description}</span>
          )}
        </div>
      </label>

      {error && <p className="text-xs text-[#dc2626] ml-7">{error}</p>}
    </div>
  )
}