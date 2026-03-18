// -----------------------------------------------------------------------------
// File: VendorTabs.tsx
// Path: components/storefront/VendorTabs.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import type { Vendor, Product, Review } from '@/types'
import { Rating }      from '@/components/ui/Rating'
import { ProductCard } from '@/components/storefront/ProductCard'
import { mockVendors } from '@/lib/mock-data'
import { Select } from '@/components/ui/Select'

type Props = {
  vendor:      Vendor
  products:    Product[]
  reviews:     Review[]
  featured:    Product[]
  bestsellers: Product[]
}

const TABS = ['Products', 'About', 'Reviews'] as const
type Tab = typeof TABS[number]

const SORT_OPTIONS = [
  { value: 'featured',  label: 'Featured' },
  { value: 'newest',    label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low–High' },
  { value: 'price-desc',label: 'Price: High–Low' },
  { value: 'rating',    label: 'Top Rated' },
]

export function VendorTabs({ vendor, products, reviews, featured, bestsellers }: Props) {
  const [tab,    setTab]    = useState<Tab>('Products')
  const [search, setSearch] = useState('')
  const [sort,   setSort]   = useState('featured')

  const filteredProducts = useMemo(() => {
    let list = [...products]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)))
    }
    switch (sort) {
      case 'newest':    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc':list.sort((a, b) => b.price - a.price); break
      case 'rating':    list.sort((a, b) => b.rating - a.rating); break
    }
    return list
  }, [products, search, sort])

  return (
    <div className="pb-20">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[#e5e5e5] mb-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-5 py-3 text-sm font-medium transition-all relative',
              tab === t
                ? 'text-[#111111] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c8a951]'
                : 'text-[#9ca3af] hover:text-[#6b6b6b]',
            ].join(' ')}
          >
            {t}
            {t === 'Products' && <span className="ml-1.5 text-xs text-[#9ca3af]">({products.length})</span>}
            {t === 'Reviews'  && <span className="ml-1.5 text-xs text-[#9ca3af]">({reviews.length})</span>}
          </button>
        ))}
      </div>

      {/* ── Products Tab ──────────────────────────────────────────────── */}
      {tab === 'Products' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10"
              />
            </div>
            <Select
              options={SORT_OPTIONS}
              value={sort}
              onChange={(v) => setSort(v)}
              size="sm"
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 text-center">
              <span className="text-3xl">📦</span>
              <p className="font-semibold text-[#111111]">No products found</p>
              <button onClick={() => setSearch('')} className="text-sm text-[#c8a951] underline">Clear search</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── About Tab ─────────────────────────────────────────────────── */}
      {tab === 'About' && (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#111111] mb-3">About {vendor.storeName}</h2>
              <p className="text-[#6b6b6b] leading-relaxed">{vendor.description}</p>
            </div>

            {vendor.shippingPolicy && (
              <div className="p-5 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
                <h3 className="font-semibold text-[#111111] mb-2 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l3 5v3h-8V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                  Shipping Policy
                </h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{vendor.shippingPolicy}</p>
              </div>
            )}

            {vendor.returnPolicy && (
              <div className="p-5 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
                <h3 className="font-semibold text-[#111111] mb-2 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
                  Return Policy
                </h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{vendor.returnPolicy}</p>
              </div>
            )}
          </div>

          {/* Contact card */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl border border-[#e5e5e5] bg-[#fafaf9] h-fit">
            <h3 className="font-semibold text-[#111111]">Store Info</h3>
            <div className="flex flex-col gap-3 text-sm">
              {vendor.email && (
                <div className="flex items-center gap-2.5 text-[#6b6b6b]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  <a href={`mailto:${vendor.email}`} className="hover:text-[#c8a951] transition-colors">{vendor.email}</a>
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center gap-2.5 text-[#6b6b6b]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 9.81 19.79 19.79 0 01-.07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                  {vendor.phone}
                </div>
              )}
              {vendor.website && (
                <div className="flex items-center gap-2.5 text-[#6b6b6b]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#c8a951] transition-colors truncate">{vendor.website}</a>
                </div>
              )}
              <div className="flex items-start gap-2.5 text-[#6b6b6b]">
                <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{vendor.address.city}, {vendor.address.state}, {vendor.address.country}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reviews Tab ───────────────────────────────────────────────── */}
      {tab === 'Reviews' && (
        <div>
          {/* Summary */}
          <div className="flex items-center gap-6 mb-8 p-5 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5] w-fit">
            <div className="flex flex-col items-center gap-1">
              <span className="font-serif text-5xl font-bold text-[#111111]">{vendor.rating.toFixed(1)}</span>
              <Rating value={vendor.rating} />
              <span className="text-xs text-[#9ca3af]">{vendor.reviewCount} reviews</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <p className="text-[#9ca3af] text-sm">No reviews yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="flex flex-col gap-3 p-4 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e5e5e5] flex items-center justify-center text-xs font-bold text-[#6b6b6b] shrink-0">
                        {review.user?.firstName?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111111] leading-none">
                          {review.user ? `${review.user.firstName} ${review.user.lastName[0]}.` : 'Anonymous'}
                        </p>
                        {review.verifiedPurchase && (
                          <span className="text-[0.6rem] text-[#16a34a] font-semibold uppercase tracking-wider">Verified</span>
                        )}
                      </div>
                    </div>
                    <Rating value={review.rating} size="sm" />
                  </div>
                  {review.title && <p className="font-semibold text-sm text-[#111111]">{review.title}</p>}
                  <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-4">{review.body}</p>
                  <p className="text-xs text-[#9ca3af] mt-auto">
                    {new Date(review.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}