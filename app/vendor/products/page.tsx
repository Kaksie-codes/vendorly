// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/products/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import { mockProducts, getFeaturedCategories } from '@/lib/mock-data'
import type { Product } from '@/types'

const VENDOR_ID = 'vendor-1'

const STATUS_STYLES: Record<string, string> = {
  active:       'bg-[#dcfce7] text-[#16a34a]',
  draft:        'bg-[#f5f5f4] text-[#6b6b6b]',
  archived:     'bg-[#f5f5f4] text-[#9ca3af]',
  out_of_stock: 'bg-[#fee2e2] text-[#dc2626]',
}

const SORT_OPTIONS = [
  { value: 'name',     label: 'Name A–Z' },
  { value: 'price',    label: 'Price' },
  { value: 'stock',    label: 'Stock' },
  { value: 'sales',    label: 'Best Selling' },
  { value: 'newest',   label: 'Newest' },
  { value: 'rating',   label: 'Top Rated' },
]

export default function VendorProductsPage() {
  const categories = getFeaturedCategories()
  const vendorProducts = mockProducts.filter((p) => p.vendorId === VENDOR_ID)

  const [search,    setSearch]    = useState('')
  const [status,    setStatus]    = useState<string>('all')
  const [catFilter, setCatFilter] = useState<string>('all')
  const [sort,      setSort]      = useState('newest')
  const [selected,  setSelected]  = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let list = [...vendorProducts]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    if (status !== 'all')    list = list.filter((p) => p.status === status)
    if (catFilter !== 'all') list = list.filter((p) => p.categoryId === catFilter)
    switch (sort) {
      case 'name':   list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'price':  list.sort((a, b) => b.price - a.price); break
      case 'stock':  list.sort((a, b) => b.stock - a.stock); break
      case 'sales':  list.sort((a, b) => b.soldCount - a.soldCount); break
      case 'newest': list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
    }
    return list
  }, [vendorProducts, search, status, catFilter, sort])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleAll = () => {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)))
  }

  const statusCounts = {
    all:        vendorProducts.length,
    active:     vendorProducts.filter((p) => p.status === 'active').length,
    draft:      vendorProducts.filter((p) => p.status === 'draft').length,
    out_of_stock: vendorProducts.filter((p) => p.status === 'out_of_stock').length,
    archived:   vendorProducts.filter((p) => p.status === 'archived').length,
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#111111]">Products</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">{vendorProducts.length} total products</p>
        </div>
        <Link
          href="/vendor/products/new"
          className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-[#e5e5e5] mb-5 overflow-x-auto">
        {Object.entries(statusCounts).map(([s, count]) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={[
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap relative transition-all',
              status === s
                ? 'text-[#111111] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c8a951]'
                : 'text-[#9ca3af] hover:text-[#6b6b6b]',
            ].join(' ')}
          >
            <span className="capitalize">{s === 'out_of_stock' ? 'Out of Stock' : s}</span>
            <span className="ml-1.5 text-xs opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            type="text"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white"
          />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none focus:border-[#c8a951]">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none focus:border-[#c8a951]">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-2.5 bg-[#f7f1e3] border border-[#e8d5a3] rounded-xl">
          <span className="text-sm font-medium text-[#a8892f]">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            {[
              { label: 'Set Active',   action: () => {} },
              { label: 'Set Draft',    action: () => {} },
              { label: 'Archive',      action: () => {} },
              { label: 'Delete',       action: () => {}, danger: true },
            ].map((a) => (
              <button
                key={a.label}
                onClick={a.action}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${a.danger ? 'border-[#fecaca] text-[#dc2626] hover:bg-[#fee2e2]' : 'border-[#e5e5e5] text-[#6b6b6b] hover:bg-white'}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 border-b border-[#f5f5f4] bg-[#fafaf9]">
          <input
            type="checkbox"
            checked={selected.size === filtered.length && filtered.length > 0}
            onChange={toggleAll}
            className="accent-[#c8a951]"
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Product</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] w-16 text-right">Price</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] w-14 text-right">Stock</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] w-20 text-center">Status</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] w-16 text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-3xl">📦</span>
            <p className="font-semibold text-[#111111]">No products found</p>
            <button onClick={() => { setSearch(''); setStatus('all'); setCatFilter('all') }} className="text-sm text-[#c8a951] underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#f5f5f4]">
            {filtered.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                selected={selected.has(product.id)}
                onToggle={() => toggleSelect(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-[#9ca3af]">
        <span>Showing {filtered.length} of {vendorProducts.length} products</span>
      </div>
    </div>
  )
}

// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({ product, selected, onToggle }: { product: Product; selected: boolean; onToggle: () => void }) {
  const image = product.images[0]
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <div className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3 hover:bg-[#fafaf9] transition-colors ${selected ? 'bg-[#f7f1e3]' : ''}`}>
      <input type="checkbox" checked={selected} onChange={onToggle} className="accent-[#c8a951]" />

      {/* Product info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#f5f5f4] shrink-0">
          {image && <Image src={image.url} alt={product.name} fill className="object-cover" sizes="40px" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#111111] truncate">{product.name}</p>
          <p className="text-xs text-[#9ca3af]">SKU: {product.sku}</p>
        </div>
      </div>

      {/* Price */}
      <div className="w-16 text-right">
        <p className="text-sm font-medium text-[#111111]">₦{product.price.toLocaleString()}</p>
        {product.compareAtPrice && (
          <p className="text-xs text-[#9ca3af] line-through">₦{product.compareAtPrice.toLocaleString()}</p>
        )}
      </div>

      {/* Stock */}
      <div className="w-14 text-right">
        <p className={`text-sm font-medium ${isLowStock ? 'text-[#d97706]' : product.stock === 0 ? 'text-[#dc2626]' : 'text-[#111111]'}`}>
          {product.stock}
        </p>
        {isLowStock && <p className="text-[0.6rem] text-[#d97706]">Low</p>}
      </div>

      {/* Status */}
      <div className="w-20 flex justify-center">
        <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[product.status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
          {product.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Actions */}
      <div className="w-16 flex items-center justify-end gap-1">
        <Link
          href={`/vendor/products/${product.id}/edit`}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111] transition-colors"
          title="Edit"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </Link>
        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111] transition-colors"
          title="View live"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </Link>
      </div>
    </div>
  )
}