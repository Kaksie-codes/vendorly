// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/reviews/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import { getReviewsByVendor, getAverageRating } from '@/lib/mock-data'
import type { Review } from '@/types'

const VENDOR_ID = 'vendor-1'

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-[#dcfce7] text-[#16a34a]',
  pending:   'bg-[#fef3c7] text-[#d97706]',
  rejected:  'bg-[#fee2e2] text-[#dc2626]',
}

export default function VendorReviewsPage() {
  const reviews = getReviewsByVendor(VENDOR_ID)
  const avgRating = getAverageRating ? reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1) : 4.7

  const [filter,    setFilter]    = useState<'all' | 'published' | 'pending' | 'rejected'>('all')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [sort,      setSort]      = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest')
  const [reply,     setReply]     = useState<Record<string, string>>({})
  const [replied,   setReplied]   = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let list = [...reviews]
    if (filter !== 'all')  list = list.filter((r) => r.status === filter)
    if (ratingFilter > 0)  list = list.filter((r) => r.rating === ratingFilter)
    switch (sort) {
      case 'newest':  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'highest': list.sort((a, b) => b.rating - a.rating); break
      case 'lowest':  list.sort((a, b) => a.rating - b.rating); break
      case 'helpful': list.sort((a, b) => b.helpfulCount - a.helpfulCount); break
    }
    return list
  }, [reviews, filter, ratingFilter, sort])

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count:  reviews.filter((rv) => rv.rating === r).length,
    pct:    reviews.length ? Math.round((reviews.filter((rv) => rv.rating === r).length / reviews.length) * 100) : 0,
  }))

  const handleReply = (reviewId: string) => {
    if (!reply[reviewId]?.trim()) return
    setReplied((prev) => new Set(prev).add(reviewId))
    setReply((prev) => ({ ...prev, [reviewId]: '' }))
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1000px]">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[#111111]">Reviews</h1>
        <p className="text-sm text-[#9ca3af] mt-0.5">{reviews.length} total reviews</p>
      </div>

      {/* Rating summary */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {/* Average */}
        <div className="flex flex-col items-center justify-center gap-2 p-6 bg-white rounded-2xl border border-[#e5e5e5]">
          <p className="font-serif text-5xl font-bold text-[#111111]">{avgRating.toFixed(1)}</p>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= Math.round(avgRating) ? '#c8a951' : '#e5e5e5'} stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <p className="text-xs text-[#9ca3af]">{reviews.length} reviews</p>
        </div>

        {/* Breakdown */}
        <div className="lg:col-span-2 flex flex-col justify-center gap-2 p-5 bg-white rounded-2xl border border-[#e5e5e5]">
          {ratingBreakdown.map(({ rating, count, pct }) => (
            <button
              key={rating}
              onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
              className={`flex items-center gap-3 group transition-all ${ratingFilter === rating ? 'opacity-100' : 'hover:opacity-80'}`}
            >
              <span className="text-xs font-semibold text-[#6b6b6b] w-4 shrink-0">{rating}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#c8a951" stroke="none" className="shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <div className="flex-1 h-2 bg-[#f5f5f4] rounded-full overflow-hidden">
                <div className="h-full bg-[#c8a951] rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-[#9ca3af] w-8 text-right shrink-0">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Status tabs */}
        <div className="flex gap-1 border-b-0 overflow-x-auto">
          {(['all', 'published', 'pending', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all capitalize ${filter === s ? 'bg-[#111111] text-white' : 'text-[#9ca3af] hover:bg-[#f5f5f4] hover:text-[#6b6b6b]'}`}
            >
              {s} ({s === 'all' ? reviews.length : reviews.filter((r) => r.status === s).length})
            </button>
          ))}
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="ml-auto px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none focus:border-[#c8a951]">
          <option value="newest">Newest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 bg-white rounded-2xl border border-[#e5e5e5]">
            <span className="text-3xl">⭐</span>
            <p className="font-semibold text-[#111111]">No reviews found</p>
          </div>
        ) : (
          filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              replyText={reply[review.id] ?? ''}
              onReplyChange={(v) => setReply((r) => ({ ...r, [review.id]: v }))}
              onReplySend={() => handleReply(review.id)}
              replySent={replied.has(review.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────

function ReviewCard({ review, replyText, onReplyChange, onReplySend, replySent }: {
  review: Review
  replyText: string
  onReplyChange: (v: string) => void
  onReplySend: () => void
  replySent: boolean
}) {
  const [showReply, setShowReply] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#f5f5f4] shrink-0">
            {review.user?.avatar
              ? <Image src={review.user.avatar} alt="avatar" fill className="object-cover" sizes="36px" />
              : <span className="w-full h-full flex items-center justify-center text-sm font-bold text-[#9ca3af]">
                  {review.user?.firstName?.[0] ?? '?'}
                </span>
            }
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-[#111111]">
                  {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= review.rating ? '#c8a951' : '#e5e5e5'} stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <span className="text-[0.6rem] text-[#16a34a] font-semibold">✓ Verified</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${STATUS_STYLES[review.status]}`}>
                  {review.status}
                </span>
                <span className="text-xs text-[#9ca3af]">
                  {new Date(review.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {review.title && <p className="font-semibold text-sm text-[#111111] mt-2">{review.title}</p>}
            <p className="text-sm text-[#6b6b6b] mt-1 leading-relaxed">{review.body}</p>

            {/* Product link */}
            {review.product && (
              <Link href={`/products/${review.product.slug}`} className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#9ca3af] hover:text-[#c8a951] transition-colors">
                <div className="relative w-5 h-5 rounded overflow-hidden bg-[#f5f5f4] shrink-0">
                  {review.product.images[0] && <Image src={review.product.images[0].url} alt="" fill className="object-cover" sizes="20px" />}
                </div>
                {review.product.name}
              </Link>
            )}

            {/* Helpful + reply */}
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-[#9ca3af]">👍 {review.helpfulCount} helpful</span>
              {!replySent ? (
                <button onClick={() => setShowReply(!showReply)} className="text-xs text-[#c8a951] font-medium hover:underline">
                  {showReply ? 'Cancel' : '↩ Reply'}
                </button>
              ) : (
                <span className="text-xs text-[#16a34a] font-medium">✓ Reply sent</span>
              )}
              {review.status === 'pending' && (
                <>
                  <button className="text-xs text-[#16a34a] font-medium hover:underline">Approve</button>
                  <button className="text-xs text-[#dc2626] font-medium hover:underline">Reject</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reply box */}
        {showReply && !replySent && (
          <div className="mt-4 ml-13 flex flex-col gap-2 pl-1">
            <textarea
              value={replyText}
              onChange={(e) => onReplyChange(e.target.value)}
              rows={3}
              placeholder="Write a public reply to this review…"
              className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#c8a951] transition"
            />
            <div className="flex gap-2">
              <button
                onClick={onReplySend}
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-semibold rounded-lg hover:bg-[#2a2a2a] disabled:opacity-50 transition-all"
              >
                Post Reply
              </button>
              <button onClick={() => setShowReply(false)} className="text-xs text-[#9ca3af] hover:text-[#6b6b6b] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}