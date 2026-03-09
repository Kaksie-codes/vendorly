// -----------------------------------------------------------------------------
// File: Pagination.tsx
// Path: components/ui/Pagination.tsx
// -----------------------------------------------------------------------------

'use client'

import React from 'react'

interface PaginationProps {
  page:          number
  totalPages:    number
  onPageChange:  (page: number) => void
  showFirstLast?: boolean
  className?:    string
}

function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  if (current > 3)         pages.push('...')
  if (current > 2)         pages.push(current - 1)
  if (current !== 1 && current !== total) pages.push(current)
  if (current < total - 1) pages.push(current + 1)
  if (current < total - 2) pages.push('...')
  pages.push(total)

  // Deduplicate while preserving order
  return pages.filter((v, i, arr) => v === '...' || arr.indexOf(v) === i)
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  showFirstLast = false,
  className     = '',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages  = getPages(page, totalPages)
  const navBtn = (disabled: boolean) => [
    'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm',
    'border border-[#e5e5e5] transition-all duration-150',
    disabled
      ? 'text-[#9ca3af] cursor-not-allowed opacity-40'
      : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111] cursor-pointer',
  ].join(' ')

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1 ${className}`}>

      {showFirstLast && (
        <button className={navBtn(page === 1)} onClick={() => onPageChange(1)} disabled={page === 1} aria-label="First page">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" /></svg>
        </button>
      )}

      <button className={navBtn(page === 1)} onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className="px-1 text-[#9ca3af] text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-current={page === p ? 'page' : undefined}
            className={[
              'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium',
              'border transition-all duration-150',
              page === p
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'border-[#e5e5e5] text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]',
            ].join(' ')}
          >
            {p}
          </button>
        )
      )}

      <button className={navBtn(page === totalPages)} onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {showFirstLast && (
        <button className={navBtn(page === totalPages)} onClick={() => onPageChange(totalPages)} disabled={page === totalPages} aria-label="Last page">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 17l5-5-5-5M6 17l5-5-5-5" /></svg>
        </button>
      )}
    </nav>
  )
}