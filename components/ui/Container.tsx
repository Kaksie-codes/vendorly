// -----------------------------------------------------------------------------
// File: Container.tsx
// Path: components/ui/Container.tsx
// -----------------------------------------------------------------------------

import React from 'react'

interface ContainerProps {
  children:   React.ReactNode
  className?: string
  narrow?:    boolean
  as?:        React.ElementType
}

export function Container({ children, className = '', narrow = false, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={[
      'w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12',
      narrow ? 'max-w-3xl' : '',
      className,
    ].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items:      BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <React.Fragment key={i}>
            {isLast || !item.href ? (
              <span
                className={isLast ? 'text-sm text-[#111111] font-medium' : 'text-sm text-[#9ca3af]'}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <a href={item.href} className="text-sm text-[#9ca3af] hover:text-[#111111] transition-colors">
                {item.label}
              </a>
            )}
            {!isLast && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9ca3af] shrink-0">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}