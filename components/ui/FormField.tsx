// -----------------------------------------------------------------------------
// File: FormField.tsx
// Path: components/ui/FormField.tsx
// Shared form primitives — replaces duplicated Field/F, Textarea/TextAreaField,
// SelectField, Toggle, and SaveBar helpers scattered across ProductForm.tsx
// and vendor/settings/page.tsx.
// -----------------------------------------------------------------------------

'use client'

import React from 'react'
import { Select } from '@/components/ui/Select'

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label:        string
  value:        string
  onChange:     (v: string) => void
  type?:        string
  required?:    boolean
  placeholder?: string
  /** Helper text shown below the input */
  helper?:      string
  /** Makes the field span 2 columns inside a sm:grid-cols-2 grid */
  span?:        boolean
  disabled?:    boolean
}

export function FormField({
  label, value, onChange, type = 'text',
  required, placeholder, helper, span, disabled,
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${span ? 'sm:col-span-2' : ''}`}>
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
        {label}{required && <span className="text-[#dc2626] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {helper && <p className="text-xs text-[#9ca3af]">{helper}</p>}
    </div>
  )
}

// ─── FormTextarea ─────────────────────────────────────────────────────────────

interface FormTextareaProps {
  label:        string
  value:        string
  onChange:     (v: string) => void
  rows?:        number
  required?:    boolean
  placeholder?: string
}

export function FormTextarea({ label, value, onChange, rows = 4, required, placeholder }: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
        {label}{required && <span className="text-[#dc2626] ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
      />
    </div>
  )
}

// ─── FormSelect ───────────────────────────────────────────────────────────────

interface FormSelectProps {
  label:    string
  value:    string
  onChange: (v: string) => void
  options:  { value: string; label: string }[]
}

export function FormSelect({ label, value, onChange, options }: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">{label}</label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder="Select…"
      />
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked:  boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${checked ? 'bg-[#c8a951]' : 'bg-[#d1d5db]'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

// ─── SaveBar ──────────────────────────────────────────────────────────────────

interface SaveBarProps {
  saved:   boolean
  onSave:  () => void
  loading?: boolean
}

export function SaveBar({ saved, onSave, loading }: SaveBarProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onSave}
        disabled={loading}
        className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 ${
          saved
            ? 'bg-[#16a34a] text-white'
            : 'bg-[#111111] text-white hover:bg-[#2a2a2a]'
        }`}
      >
        {loading ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
      </button>
      {saved && <p className="text-xs text-[#16a34a] font-medium animate-pulse">All changes saved.</p>}
    </div>
  )
}
