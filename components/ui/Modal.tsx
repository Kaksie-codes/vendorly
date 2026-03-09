// -----------------------------------------------------------------------------
// File: Modal.tsx
// Path: components/ui/Modal.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useEffect, useCallback } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ModalProps {
  open:         boolean
  onClose:      () => void
  title?:       string
  description?: string
  size?:        ModalSize
  children:     React.ReactNode
  footer?:      React.ReactNode
  hideClose?:   boolean
}

const sizeMap: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-xl',
  full: 'max-w-4xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size      = 'md',
  children,
  footer,
  hideClose = false,
}: ModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={[
        'relative w-full bg-white rounded-2xl shadow-2xl',
        'animate-[scale-in_0.2s_ease-out] flex flex-col max-h-[90vh]',
        sizeMap[size],
      ].join(' ')}>

        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[#e5e5e5] shrink-0">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 className="font-serif text-xl font-semibold text-[#111111]">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-[#6b6b6b]">{description}</p>
              )}
            </div>

            {!hideClose && (
              <button
                onClick={onClose}
                className="shrink-0 p-1.5 rounded-lg text-[#9ca3af] hover:text-[#111111] hover:bg-[#f5f5f4] transition-colors -mt-1 -mr-1"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#e5e5e5] shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────

interface ConfirmModalProps {
  open:          boolean
  onClose:       () => void
  onConfirm:     () => void
  title:         string
  description:   string
  confirmLabel?: string
  cancelLabel?:  string
  variant?:      'danger' | 'primary'
  loading?:      boolean
}

export function ConfirmModal({
  open, onClose, onConfirm,
  title, description,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant      = 'primary',
  loading      = false,
}: ConfirmModalProps) {
  const confirmClass = variant === 'danger'
    ? 'bg-[#dc2626] text-white border border-[#dc2626] hover:bg-red-700 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50'
    : 'bg-[#111111] text-white border border-[#111111] hover:bg-[#2a2a2a] px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-transparent text-[#111111] border border-[#d1d5db] hover:bg-[#f5f5f4] px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={loading} className={confirmClass}>
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-[#6b6b6b]">{description}</p>
    </Modal>
  )
}