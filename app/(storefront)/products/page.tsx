// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/products/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { mockProducts, getFeaturedCategories, mockVendors } from '@/lib/mock-data'
import type { Product } from '@/types'
import { Rating }    from '@/components/ui/Rating'
import { Badge }     from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'

// ─── Types ────────────────────────────────────────────────────────────────────

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
]

const PRICE_RANGES = [
  { label: 'All Prices',           min: 0,     max: Infinity },
  { label: 'Under ₦10,000',        min: 0,     max: 10000 },
  { label: '₦10,000 – ₦50,000',   min: 10000, max: 50000 },
  { label: '₦50,000 – ₦100,000',  min: 50000, max: 100000 },
  { label: 'Above ₦100,000',       min: 100000, max: Infinity },
]

const PAGE_SIZE = 8

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const categories = getFeaturedCategories()

  const [search,        setSearch]       = useState('')
  const [sort,          setSort]         = useState<SortOption>('featured')
  const [selectedCat,   setSelectedCat]  = useState<string>('all')
  const [priceRange,    setPriceRange]   = useState(0) // index into PRICE_RANGES
  const [minRating,     setMinRating]    = useState(0)
  const [filtersOpen,   setFiltersOpen]  = useState(false)
  const [page,          setPage]         = useState(1)
  const [view,          setView]         = useState<'grid' | 'list'>('grid')

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const { min, max } = PRICE_RANGES[priceRange]

    let list = mockProducts.filter((p) => {
      const price = p.variants?.[0]?.price ?? p.price

      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.description?.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false
      if (price < min || price > max) return false
      if (p.rating < minRating) return false
      return true
    })

    switch (sort) {
      case 'newest':     list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'price-asc':  list = [...list].sort((a, b) => (a.variants?.[0]?.price ?? a.price) - (b.variants?.[0]?.price ?? b.price)); break
      case 'price-desc': list = [...list].sort((a, b) => (b.variants?.[0]?.price ?? b.price) - (a.variants?.[0]?.price ?? a.price)); break
      case 'rating':     list = [...list].sort((a, b) => b.rating - a.rating); break
      default: break
    }

    return list
  }, [search, sort, selectedCat, priceRange, minRating])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const resetFilters = () => {
    setSearch(''); setSort('featured'); setSelectedCat('all')
    setPriceRange(0); setMinRating(0); setPage(1)
  }

  const hasActiveFilters = selectedCat !== 'all' || priceRange !== 0 || minRating > 0

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-1">Vendorly Store</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">All Products</h1>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full pl-10 pr-4 py-3 text-sm text-[#111111] bg-white border border-[#e5e5e5] rounded-xl outline-none focus:border-[#c8a951] focus:shadow-[0_0_0_3px_rgb(200_169_81_/_0.12)] transition-all placeholder:text-[#9ca3af]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#111111] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div className="flex gap-8">

        {/* ── Sidebar (desktop) ──────────────────────────────────────────── */}
        <div className="hidden lg:block w-56 shrink-0">
          <FilterPanel
            categories={categories}
            selectedCat={selectedCat}
            setSelectedCat={(v) => { setSelectedCat(v); setPage(1) }}
            priceRange={priceRange}
            setPriceRange={(v) => { setPriceRange(v); setPage(1) }}
            minRating={minRating}
            setMinRating={(v) => { setMinRating(v); setPage(1) }}
            hasActiveFilters={hasActiveFilters}
            onReset={resetFilters}
          />
        </div>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#6b6b6b] border border-[#e5e5e5] rounded-lg hover:bg-[#f5f5f4] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#c8a951]" />
                )}
              </button>

              <p className="text-sm text-[#9ca3af]">
                <span className="font-medium text-[#111111]">{filtered.length}</span> products
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value as SortOption); setPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 text-sm text-[#111111] bg-white border border-[#e5e5e5] rounded-lg outline-none focus:border-[#c8a951] transition-all cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
              </div>

              {/* View toggle */}
              <div className="flex border border-[#e5e5e5] rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 transition-colors ${view === 'grid' ? 'bg-[#111111] text-white' : 'text-[#9ca3af] hover:bg-[#f5f5f4]'}`}
                  aria-label="Grid view"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 border-l border-[#e5e5e5] transition-colors ${view === 'list' ? 'bg-[#111111] text-white' : 'text-[#9ca3af] hover:bg-[#f5f5f4]'}`}
                  aria-label="List view"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCat !== 'all' && (
                <FilterChip
                  label={categories.find((c) => c.id === selectedCat)?.name ?? selectedCat}
                  onRemove={() => setSelectedCat('all')}
                />
              )}
              {priceRange !== 0 && (
                <FilterChip label={PRICE_RANGES[priceRange].label} onRemove={() => setPriceRange(0)} />
              )}
              {minRating > 0 && (
                <FilterChip label={`${minRating}+ stars`} onRemove={() => setMinRating(0)} />
              )}
              <button onClick={resetFilters} className="text-xs text-[#dc2626] hover:underline px-1">
                Clear all
              </button>
            </div>
          )}

          {/* Empty state */}
          {paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#f5f5f4] text-[#9ca3af]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-[#111111]">No products found</p>
                <p className="text-sm text-[#9ca3af] mt-1">Try adjusting your filters or search term.</p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium bg-[#111111] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Grid view */}
          {view === 'grid' && paginated.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* List view */}
          {view === 'list' && paginated.length > 0 && (
            <div className="flex flex-col divide-y divide-[#e5e5e5]">
              {paginated.map((product) => (
                <ProductListRow key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ──────────────────────────────────────────── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5e5]">
              <h2 className="font-semibold text-[#111111]">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#111111] hover:bg-[#f5f5f4] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-5 py-5">
              <FilterPanel
                categories={categories}
                selectedCat={selectedCat}
                setSelectedCat={(v) => { setSelectedCat(v); setPage(1) }}
                priceRange={priceRange}
                setPriceRange={(v) => { setPriceRange(v); setPage(1) }}
                minRating={minRating}
                setMinRating={(v) => { setMinRating(v); setPage(1) }}
                hasActiveFilters={hasActiveFilters}
                onReset={resetFilters}
              />
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full bg-[#111111] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f7f1e3] border border-[#e8d5a3] text-[#a8892f] text-xs font-medium rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-[#111111] transition-colors" aria-label="Remove filter">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </span>
  )
}

// ─── Product grid card ────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const image  = product.images[0]
  const price  = product.variants?.[0]?.price ?? product.price
  const vendor = mockVendors.find((v) => v.id === product.vendorId)

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f5f5f4]">
        {image && (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew         && <span className="bg-[#111111] text-white text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md">New</span>}
          {product.compareAtPrice && <span className="bg-[#dc2626] text-white text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md">Sale</span>}
        </div>

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-[#6b6b6b] hover:text-[#dc2626] opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Wishlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
        </button>

        <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => e.preventDefault()}
            className="w-full bg-[#111111]/90 backdrop-blur-sm text-white text-xs font-medium py-2.5 rounded-xl hover:bg-[#111111] transition-colors"
          >
            Quick Add
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        {vendor && <p className="text-xs text-[#9ca3af] truncate">{vendor.storeName}</p>}
        <h3 className="text-sm font-medium text-[#111111] leading-snug line-clamp-2 group-hover:text-[#c8a951] transition-colors">{product.name}</h3>
        <Rating value={product.rating} size="sm" showCount={product.reviewCount} />
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-semibold text-[#111111]">₦{price.toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-[#9ca3af] line-through">₦{product.compareAtPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Product list row ─────────────────────────────────────────────────────────

function ProductListRow({ product }: { product: Product }) {
  const image  = product.images[0]
  const price  = product.variants?.[0]?.price ?? product.price
  const vendor = mockVendors.find((v) => v.id === product.vendorId)
  const isSale = !!product.compareAtPrice

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex items-center gap-4 py-4 hover:bg-[#fafaf9] -mx-3 px-3 rounded-xl transition-colors"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#f5f5f4] shrink-0">
        {image && (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="96px"
          />
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {vendor && <p className="text-xs text-[#9ca3af]">{vendor.storeName}</p>}
        <h3 className="text-sm font-medium text-[#111111] group-hover:text-[#c8a951] transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-xs text-[#9ca3af] line-clamp-2 hidden sm:block">{product.description}</p>
        <Rating value={product.rating} size="sm" showCount={product.reviewCount} />
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#111111]">₦{price.toLocaleString()}</span>
          {isSale && (
            <span className="text-xs text-[#9ca3af] line-through">₦{product.compareAtPrice!.toLocaleString()}</span>
          )}
        </div>
        {isSale && (
          <Badge variant="error" size="sm">Sale</Badge>
        )}
        <button
          onClick={(e) => e.preventDefault()}
          className="hidden sm:block px-4 py-1.5 text-xs font-medium bg-[#111111] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  )
}

// ─── Filter Panel (top-level component, receives state as props) ──────────────

type Category = ReturnType<typeof getFeaturedCategories>[0]

type FilterPanelProps = {
  categories:      Category[]
  selectedCat:     string
  setSelectedCat:  (v: string) => void
  priceRange:      number
  setPriceRange:   (v: number) => void
  minRating:       number
  setMinRating:    (v: number) => void
  hasActiveFilters: boolean
  onReset:         () => void
}

function FilterPanel({
  categories, selectedCat, setSelectedCat,
  priceRange, setPriceRange,
  minRating,  setMinRating,
  hasActiveFilters, onReset,
}: FilterPanelProps) {
  return (
    <aside className="flex flex-col gap-6">

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">Category</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSelectedCat('all')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCat === 'all'
                ? 'bg-[#111111] text-white font-medium'
                : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]'
            }`}
          >
            <span>All Categories</span>
            <span className="text-xs opacity-60">{mockProducts.length}</span>
          </button>
          {categories.map((cat) => {
            const count = mockProducts.filter((p) => p.categoryId === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCat === cat.id
                    ? 'bg-[#111111] text-white font-medium'
                    : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs opacity-60">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">Price Range</h3>
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={range.label}
              onClick={() => setPriceRange(i)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                priceRange === i
                  ? 'bg-[#111111] text-white font-medium'
                  : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                priceRange === i ? 'border-white' : 'border-[#d1d5db]'
              }`}>
                {priceRange === i && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min rating */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">Minimum Rating</h3>
        <div className="flex flex-col gap-1">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                minRating === r
                  ? 'bg-[#111111] text-white font-medium'
                  : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                minRating === r ? 'border-white' : 'border-[#d1d5db]'
              }`}>
                {minRating === r && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              {r === 0 ? 'Any Rating' : (
                <span className="flex items-center gap-1">
                  {r}+
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={minRating === r ? 'white' : '#c8a951'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-[#dc2626] hover:text-red-700 transition-colors px-3 py-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          Reset Filters
        </button>
      )}
    </aside>
  )
}