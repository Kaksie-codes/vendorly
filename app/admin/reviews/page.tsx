// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/reviews/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { mockReviews, getVendorById } from '@/lib/mock-data'
import type { ReviewStatus } from '@/types'

type FilterTab = 'all' | ReviewStatus

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',       label: 'All'       },
  { id: 'published', label: 'Published' },
  { id: 'pending',   label: 'Pending'   },
  { id: 'rejected',  label: 'Rejected'  },
]

const STATUS_BADGE: Record<ReviewStatus, { bg: string; color: string; label: string }> = {
  published: { bg: '#dcfce7', color: '#16a34a', label: 'Published' },
  pending:   { bg: '#fef3c7', color: '#d97706', label: 'Pending'   },
  rejected:  { bg: '#fee2e2', color: '#dc2626', label: 'Rejected'  },
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
    </svg>
  )
}

export default function AdminReviewsPage() {
  const [tab, setTab]     = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>(
    Object.fromEntries(mockReviews.map((r) => [r.id, r.status as ReviewStatus]))
  )
  const [loading, setLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const avgRating = mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length

  const counts = useMemo(() => ({
    all:       mockReviews.length,
    published: Object.values(statuses).filter((s) => s === 'published').length,
    pending:   Object.values(statuses).filter((s) => s === 'pending').length,
    rejected:  Object.values(statuses).filter((s) => s === 'rejected').length,
  }), [statuses])

  const filtered = useMemo(() => {
    let list = [...mockReviews]
    if (tab !== 'all') list = list.filter((r) => statuses[r.id] === tab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) =>
        r.product?.name.toLowerCase().includes(q) ||
        r.user?.firstName.toLowerCase().includes(q) ||
        r.user?.lastName.toLowerCase().includes(q) ||
        r.body.toLowerCase().includes(q) ||
        (r.title ?? '').toLowerCase().includes(q)
      )
    }
    return list
  }, [tab, search, statuses])

  const handleStatus = async (id: string, next: ReviewStatus) => {
    setLoading(id + next)
    await new Promise((r) => setTimeout(r, 500))
    setStatuses((prev) => ({ ...prev, [id]: next }))
    setLoading(null)
  }

  return (
    <div className="p-5 lg:p-7 max-w-[1200px] space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="admin-page-title">Reviews</p>
          <p className="text-sm text-[#9ca3af] mt-0.5">Moderate product reviews across the platform</p>
        </div>
        {/* Avg rating badge */}
        <div className="flex items-center gap-2.5 bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 self-start">
          <StarRow rating={Math.round(avgRating)} />
          <span className="text-base font-bold text-[#111111]">{avgRating.toFixed(1)}</span>
          <span className="text-xs text-[#9ca3af]">platform avg</span>
        </div>
      </div>

      {/* ── 4 stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reviews',  value: counts.all,            icon: '⭐', bg: '#f5f5f4',   color: '#111111' },
          { label: 'Published',      value: counts.published,      icon: '✅', bg: '#dcfce7',   color: '#16a34a' },
          { label: 'Pending Review', value: counts.pending,        icon: '⏳', bg: '#fef3c7',   color: '#d97706' },
          { label: 'Rejected',       value: counts.rejected,       icon: '🚫', bg: '#fee2e2',   color: '#dc2626' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e5e5e5] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">{s.label}</p>
              <span className="w-8 h-8 flex items-center justify-center rounded-xl text-base"
                style={{ background: s.bg }}>{s.icon}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Rating distribution ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#111111] mb-4">Rating Distribution</p>
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = mockReviews.filter((r) => r.rating === star).length
            const pct   = mockReviews.length ? (count / mockReviews.length) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-12 shrink-0">
                  <span className="text-sm font-medium text-[#6b6b6b]">{star}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div className="flex-1 h-2.5 bg-[#f5f5f4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f59e0b] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}/>
                </div>
                <div className="flex items-center gap-2 w-16 shrink-0">
                  <span className="text-xs text-[#9ca3af]">{pct.toFixed(0)}%</span>
                  <span className="text-xs font-semibold text-[#111111]">{count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white border border-[#e5e5e5] rounded-xl">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-[#111111] text-white' : 'text-[#9ca3af] hover:text-[#111111]'
              }`}>
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                tab === t.id ? 'bg-white/20 text-white' : 'bg-[#f5f5f4] text-[#9ca3af]'
              }`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, reviewer, content…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl outline-none focus:border-[#ef4444] bg-white transition-all"/>
        </div>
      </div>

      {/* ── Reviews ── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e5e5e5] rounded-2xl py-20 text-center">
          <p className="text-4xl mb-3">⭐</p>
          <p className="text-sm font-semibold text-[#111111]">No reviews found</p>
          <p className="text-xs text-[#9ca3af] mt-1">Try a different filter or search term</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => {
            const badge  = STATUS_BADGE[statuses[review.id] as ReviewStatus]
            const vendor = getVendorById(review.vendorId)
            const isOpen = expanded === review.id

            return (
              <div key={review.id}
                className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden transition-all">

                {/* ── Main row ── */}
                <div className="flex gap-4 p-5">

                  {/* Product thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5f5f4] shrink-0 border border-[#e5e5e5]">
                    {review.product?.images?.[0] ? (
                      <Image src={review.product.images[0].url} alt=""
                        width={64} height={64} className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9ca3af]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top meta row */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#111111] truncate">
                          {review.product?.name ?? 'Unknown product'}
                        </p>
                        <div className="flex items-center flex-wrap gap-1.5 mt-0.5">
                          <Link href={`/admin/vendors/${review.vendorId}`}
                            className="text-xs text-[#9ca3af] hover:text-[#ef4444] transition-colors">
                            {vendor?.storeName ?? review.vendorId}
                          </Link>
                          <span className="text-[#e5e5e5] text-xs">·</span>
                          <span className="text-xs text-[#9ca3af]">
                            {new Date(review.createdAt).toLocaleDateString('en', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                          {review.verifiedPurchase && (
                            <span className="text-[0.65rem] font-semibold text-[#2563eb] bg-[#dbeafe] px-2 py-0.5 rounded-full">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Status badge */}
                      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Stars + reviewer */}
                    <div className="flex items-center gap-3 mb-2">
                      <StarRow rating={review.rating} />
                      {review.user && (
                        <div className="flex items-center gap-1.5">
                          {review.user.avatar && (
                            <Image src={review.user.avatar} alt="" width={18} height={18}
                              className="w-4.5 h-4.5 rounded-full object-cover"/>
                          )}
                          <span className="text-xs text-[#6b6b6b]">
                            {review.user.firstName} {review.user.lastName}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-[#9ca3af]">{review.helpfulCount} found helpful</span>
                    </div>

                    {/* Review title + body */}
                    {review.title && (
                      <p className="text-sm font-semibold text-[#111111] mb-1">{review.title}</p>
                    )}
                    <p className={`text-sm text-[#6b6b6b] leading-relaxed ${isOpen ? '' : 'line-clamp-2'}`}>
                      {review.body}
                    </p>

                    {/* Expand/collapse */}
                    {review.body.length > 120 && (
                      <button onClick={() => setExpanded(isOpen ? null : review.id)}
                        className="text-xs text-[#9ca3af] hover:text-[#111111] mt-1 transition-colors">
                        {isOpen ? 'Show less ↑' : 'Read more ↓'}
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Action bar ── */}
                <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[#f5f5f4] bg-[#fafaf9]">
                  <Link href={`/products/${review.productId}`}
                    className="text-xs text-[#9ca3af] hover:text-[#111111] transition-colors flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    View product
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* Approve */}
                    {statuses[review.id] !== 'published' && (
                      <button
                        onClick={() => handleStatus(review.id, 'published')}
                        disabled={loading === review.id + 'published'}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#dcfce7] text-[#16a34a] hover:bg-[#bbf7d0] disabled:opacity-50 transition-colors">
                        {loading === review.id + 'published' ? <Spinner /> : (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        Approve
                      </button>
                    )}

                    {/* Reject */}
                    {statuses[review.id] !== 'rejected' && (
                      <button
                        onClick={() => handleStatus(review.id, 'rejected')}
                        disabled={loading === review.id + 'rejected'}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] disabled:opacity-50 transition-colors">
                        {loading === review.id + 'rejected' ? <Spinner /> : (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        )}
                        Reject
                      </button>
                    )}

                    {/* Reset to pending */}
                    {statuses[review.id] !== 'pending' && (
                      <button
                        onClick={() => handleStatus(review.id, 'pending')}
                        disabled={!!loading}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-[#e5e5e5] text-[#9ca3af] hover:text-[#6b6b6b] hover:bg-[#f5f5f4] disabled:opacity-50 transition-colors">
                        Reset
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}