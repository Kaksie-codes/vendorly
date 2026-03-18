// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/search/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter }           from 'next/navigation'
import { searchProducts, mockVendors, mockProducts, getFeaturedCategories } from '@/lib/mock-data'
import type { Product } from '@/types'
import { ProductCard } from '@/components/storefront/ProductCard'
import { Rating }      from '@/components/ui/Rating'
import Link            from 'next/link'
import Image           from 'next/image'
import { Select }      from '@/components/ui/Select'

const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Most Relevant' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'bestseller', label: 'Bestsellers' },
]

const PRICE_RANGES = [
  { label: 'Any price',          min: 0,      max: Infinity },
  { label: 'Under ₦10,000',      min: 0,      max: 10000 },
  { label: '₦10,000–₦30,000',   min: 10000,  max: 30000 },
  { label: '₦30,000–₦60,000',   min: 30000,  max: 60000 },
  { label: '₦60,000–₦100,000',  min: 60000,  max: 100000 },
  { label: 'Over ₦100,000',      min: 100000, max: Infinity },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const categories   = getFeaturedCategories()

  const initialQ = searchParams.get('q') ?? ''

  const [query,      setQuery]      = useState(initialQ)
  const [inputVal,   setInputVal]   = useState(initialQ)
  const [sort,       setSort]       = useState('relevance')
  const [priceRange, setPriceRange] = useState(0)
  const [minRating,  setMinRating]  = useState(0)
  const [catFilter,  setCatFilter]  = useState<string>('all')
  const [onlyInStock,setOnlyInStock]= useState(false)
  const [onlySale,   setOnlySale]   = useState(false)

  // Sync URL query to state
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setQuery(q)
    setInputVal(q)
  }, [searchParams])

  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`)
    setQuery(inputVal.trim())
  }

  const rawResults: Product[] = useMemo(() => {
    if (!query.trim()) return mockProducts.filter((p) => p.status === 'active')
    return searchProducts(query)
  }, [query])

  const filtered = useMemo(() => {
    let list = [...rawResults]
    const pr = PRICE_RANGES[priceRange]

    if (catFilter !== 'all') list = list.filter((p) => p.categoryId === catFilter)
    if (pr.max !== Infinity || pr.min > 0) list = list.filter((p) => p.price >= pr.min && p.price <= pr.max)
    if (minRating > 0)  list = list.filter((p) => p.rating >= minRating)
    if (onlyInStock)    list = list.filter((p) => p.stock > 0)
    if (onlySale)       list = list.filter((p) => !!p.compareAtPrice)

    switch (sort) {
      case 'newest':     list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break
      case 'bestseller': list.sort((a, b) => b.soldCount - a.soldCount); break
    }
    return list
  }, [rawResults, catFilter, priceRange, minRating, onlyInStock, onlySale, sort])

  // Suggested vendors based on results
  const relatedVendorIds = [...new Set(filtered.slice(0, 8).map((p) => p.vendorId))]
  const relatedVendors   = relatedVendorIds.map((id) => mockVendors.find((v) => v.id === id)).filter(Boolean)

  const hasActiveFilters = catFilter !== 'all' || priceRange !== 0 || minRating > 0 || onlyInStock || onlySale

  const clearFilters = () => {
    setCatFilter('all'); setPriceRange(0); setMinRating(0); setOnlyInStock(false); setOnlySale(false)
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Search bar ────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search products, vendors, categories…"
              className="w-full pl-11 pr-4 py-3 text-sm border border-[#e5e5e5] rounded-2xl bg-white focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition"
              autoFocus
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-[#111111] text-white text-sm font-medium rounded-2xl hover:bg-[#2a2a2a] transition-colors active:scale-[0.98]"
          >
            Search
          </button>
        </div>

        {query && (
          <p className="mt-3 text-sm text-[#6b6b6b]">
            {filtered.length === 0 ? 'No results' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`} for{' '}
            <span className="font-semibold text-[#111111]">&quot;{query}&quot;</span>
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* ── Sidebar filters ───────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#111111]">Filters</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-[#c8a951] hover:underline">Clear all</button>
            )}
          </div>

          {/* Category */}
          <FilterSection label="Category">
            <button onClick={() => setCatFilter('all')} className={filterBtn(catFilter === 'all')}>All Categories</button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setCatFilter(catFilter === cat.id ? 'all' : cat.id)} className={filterBtn(catFilter === cat.id)}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </FilterSection>

          {/* Price */}
          <FilterSection label="Price Range">
            {PRICE_RANGES.map((pr, i) => (
              <button key={i} onClick={() => setPriceRange(i)} className={filterBtn(priceRange === i)}>
                {pr.label}
              </button>
            ))}
          </FilterSection>

          {/* Rating */}
          <FilterSection label="Min. Rating">
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <button key={r} onClick={() => setMinRating(r)} className={filterBtn(minRating === r)}>
                {r === 0 ? 'Any' : <span className="flex items-center gap-1"><Rating value={r} size="sm" /> & up</span>}
              </button>
            ))}
          </FilterSection>

          {/* Toggles */}
          <FilterSection label="Availability">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#6b6b6b] hover:text-[#111111]">
              <input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} className="accent-[#c8a951]" />
              In Stock only
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#6b6b6b] hover:text-[#111111]">
              <input type="checkbox" checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} className="accent-[#c8a951]" />
              On Sale only
            </label>
          </FilterSection>
        </aside>

        {/* ── Results ───────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#9ca3af] hidden sm:block">{filtered.length} results</p>
            <Select
              options={SORT_OPTIONS}
              value={sort}
              onChange={(v) => setSort(v)}
              className="ml-auto"
              size="sm"
            />
          </div>

          {/* Active filter chips — mobile */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
              {catFilter !== 'all' && <Chip label={categories.find((c) => c.id === catFilter)?.name ?? catFilter} onRemove={() => setCatFilter('all')} />}
              {priceRange !== 0 && <Chip label={PRICE_RANGES[priceRange].label} onRemove={() => setPriceRange(0)} />}
              {minRating > 0 && <Chip label={`${minRating}★+`} onRemove={() => setMinRating(0)} />}
              {onlyInStock && <Chip label="In Stock" onRemove={() => setOnlyInStock(false)} />}
              {onlySale && <Chip label="On Sale" onRemove={() => setOnlySale(false)} />}
              <button onClick={clearFilters} className="text-xs text-[#dc2626] underline">Clear all</button>
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyResults query={query} onClear={() => { setInputVal(''); setQuery(''); clearFilters(); router.push('/search') }} />
          ) : (
            <>
              {/* Related vendors strip */}
              {relatedVendors.length > 0 && query && (
                <div className="mb-6 p-4 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-3">Vendors selling "{query}"</p>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {relatedVendors.map((vendor) => vendor && (
                      <Link key={vendor.id} href={`/vendors/${vendor.storeSlug}`} className="flex items-center gap-2.5 shrink-0 px-3 py-2 rounded-xl border border-[#e5e5e5] hover:border-[#c8a951] bg-white transition-all">
                        <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-[#f5f5f4] shrink-0">
                          {vendor.logo
                            ? <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="28px" />
                            : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-[#6b6b6b]">{vendor.storeName[0]}</span>
                          }
                        </div>
                        <span className="text-xs font-medium text-[#111111] whitespace-nowrap">{vendor.storeName}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} vendor={mockVendors.find((v) => v.id === p.vendorId)} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const filterBtn = (active: boolean) =>
  `w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${active ? 'bg-[#111111] text-white font-medium' : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]'}`

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">{label}</p>
      {children}
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#f7f1e3] text-[#a8892f] text-xs font-medium px-2.5 py-1 rounded-full border border-[#e8d5a3]">
      {label}
      <button onClick={onRemove} className="hover:text-[#111111]">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </span>
  )
}

function EmptyResults({ query, onClear }: { query: string; onClear: () => void }) {
  const suggestions = ['leather journal', 'skincare serum', 'ceramic mug', 'wall art', 'candle set']
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <span className="text-5xl">🔍</span>
      <div>
        <p className="font-semibold text-[#111111]">No results for "{query}"</p>
        <p className="text-sm text-[#9ca3af] mt-1">Try different keywords or browse suggestions below</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {suggestions.map((s) => (
          <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="px-3 py-1.5 text-sm border border-[#e5e5e5] rounded-full hover:border-[#c8a951] hover:text-[#c8a951] transition-colors">
            {s}
          </Link>
        ))}
      </div>
      <button onClick={onClear} className="text-sm text-[#c8a951] underline underline-offset-2 mt-2">Clear search</button>
    </div>
  )
}