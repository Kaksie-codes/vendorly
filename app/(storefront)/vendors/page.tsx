// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/vendors/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockVendors, getFeaturedCategories } from '@/lib/mock-data'
import type { Vendor } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'

const SORT_OPTIONS = [
  { value: 'featured',  label: 'Featured' },
  { value: 'rating',    label: 'Top Rated' },
  { value: 'products',  label: 'Most Products' },
  { value: 'newest',    label: 'Newest' },
]

export default function VendorsPage() {
  const categories = getFeaturedCategories()
  const [search,    setSearch]  = useState('')
  const [catFilter, setCat]     = useState<string>('all')
  const [sort,      setSort]    = useState('featured')

  const active = mockVendors.filter((v) => v.status === 'active')

  const filtered = useMemo(() => {
    let list = [...active]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((v) =>
        v.storeName.toLowerCase().includes(q) ||
        v.tagline?.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      )
    }

    if (catFilter !== 'all') {
      list = list.filter((v) => v.categories.includes(catFilter))
    }

    switch (sort) {
      case 'rating':   list.sort((a, b) => b.rating - a.rating);                                                          break
      case 'products': list.sort((a, b) => b.productCount - a.productCount);                                              break
      case 'newest':   list.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());              break
    }

    return list
  }, [search, catFilter, sort, active])

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-2">Discover</p>
        <h1 className="font-serif text-4xl font-bold text-text-primary">All Vendors</h1>
        <p className="text-text-secondary mt-2">{active.length} verified sellers on Vendorly</p>
      </div>

      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search vendors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-subtle rounded-xl bg-bg-primary focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-(--color-accent-gold)/10 transition"
          />
        </div>
        <Select
          value={sort}
          onChange={setSort}
          options={SORT_OPTIONS}
        />
        {/* <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border-subtle rounded-xl bg-bg-primary focus:outline-none focus:border-accent-gold text-text-primary"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select> */}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        <button
          onClick={() => setCat('all')}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            catFilter === 'all'
              ? 'bg-text-primary text-text-inverse border-text-primary'
              : 'border-border-subtle text-text-secondary hover:border-text-primary'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCat(catFilter === cat.id ? 'all' : cat.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              catFilter === cat.id
                ? 'bg-text-primary text-text-inverse border-text-primary'
                : 'border-border-subtle text-text-secondary hover:border-text-primary'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span className="text-4xl">🔍</span>
          <p className="font-semibold text-text-primary">No vendors found</p>
          <p className="text-sm text-text-muted">Try adjusting your search or filters</p>
          <button
            onClick={() => { setSearch(''); setCat('all') }}
            className="mt-2 text-sm text-accent-gold underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
        </div>
      )}
    </div>
  )
}

// ─── Vendor Card ──────────────────────────────────────────────────────────────

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/vendors/${vendor.storeSlug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border-subtle hover:border-accent-gold hover:shadow-gold transition-all duration-300 bg-bg-primary"
    >
      {/* Banner */}
      <div className="relative h-32 bg-bg-subtle overflow-hidden">
        {vendor.banner
          ? <Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
          : <div className="absolute inset-0 bg-linear-to-br from-bg-subtle to-border-subtle" />
        }
        {vendor.plan !== 'free' && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="gold" size="sm">{vendor.plan === 'pro' ? 'Pro' : vendor.plan === 'enterprise' ? 'Enterprise' : 'Basic'}</Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Logo */}
        <div className="flex items-end gap-3 -mt-9">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-bg-primary shadow-md shrink-0 bg-bg-primary">
            {vendor.logo
              ? <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="56px" />
              : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-text-secondary bg-bg-subtle">{vendor.storeName[0]}</div>
            }
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-text-primary group-hover:text-accent-gold transition-colors leading-tight">{vendor.storeName}</h2>
          {vendor.tagline && <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-relaxed">{vendor.tagline}</p>}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-bg-subtle">
          <div className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-accent-gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <span className="text-xs font-semibold text-text-primary">{vendor.rating.toFixed(1)}</span>
            <span className="text-xs text-text-muted">({vendor.reviewCount})</span>
          </div>
          <span className="text-border-subtle">·</span>
          <span className="text-xs text-text-muted">{vendor.productCount} products</span>
        </div>
      </div>
    </Link>
  )
}