// -----------------------------------------------------------------------------
// File: Toast.tsx
// Path: components/ui/Toast.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useCallback, createContext, useContext } from 'react'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id:        string
  message:   string
  variant:   ToastVariant
  duration?: number
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const variantClasses: Record<ToastVariant, string> = {
  success: 'bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a]',
  error:   'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]',
  warning: 'bg-[#fffbeb] border-[#fde68a] text-[#d97706]',
  info:    'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]',
}

const ToastIcon = ({ variant }: { variant: ToastVariant }) => {
  const paths: Record<ToastVariant, React.ReactNode> = {
    success: <path d="M20 6L9 17l-5-5" />,
    error:   <><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></>,
    warning: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    info:    <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
      {paths[variant]}
    </svg>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, variant: ToastVariant = 'info', duration = 4000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, variant, duration }])
    if (duration > 0) setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-lg',
              'pointer-events-auto animate-[fade-up_0.3s_ease-out]',
              'min-w-[280px] max-w-[380px]',
              variantClasses[t.variant],
            ].join(' ')}
          >
            <ToastIcon variant={t.variant} />
            <p className="text-sm font-medium leading-snug flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity -mr-1 -mt-0.5"
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

// ─── Inline Alert ─────────────────────────────────────────────────────────────

interface AlertProps {
  variant?:   ToastVariant
  title?:     string
  children:   React.ReactNode
  onClose?:   () => void
  className?: string
}

export function Alert({ variant = 'info', title, children, onClose, className = '' }: AlertProps) {
  return (
    <div
      className={[
        'flex items-start gap-3 px-4 py-3.5 rounded-xl border',
        variantClasses[variant],
        className,
      ].filter(Boolean).join(' ')}
      role="alert"
    >
      <ToastIcon variant={variant} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity" aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}