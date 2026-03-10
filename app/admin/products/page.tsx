// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/products/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { mockProducts, mockVendors, getFeaturedCategories } from '@/lib/mock-data'
import type { Product, ProductStatus } from '@/types'

const STATUS_PILL: Record<ProductStatus, string> = {
  active:       'bg-[#dcfce7] text-[#16a34a]',
  draft:        'bg-[#fef3c7] text-[#d97706]',
  archived:     'bg-[#f5f5f4] text-[#6b6b6b]',
  out_of_stock: 'bg-[#fee2e2] text-[#dc2626]',
}

export default function AdminProductsPage() {
  const categories = getFeaturedCategories()

  const [search,   setSearch]   = useState('')
  const [tab,      setTab]      = useState('all')
  const [vendor,   setVendor]   = useState('all')
  const [category, setCategory] = useState('all')
  const [sort,     setSort]     = useState('newest')
  const [statuses, setStatuses] = useState<Record<string, ProductStatus>>(
    Object.fromEntries(mockProducts.map((p) => [p.id, p.status]))
  )

  const archive    = (id: string) => setStatuses((s) => ({ ...s, [id]: 'archived' }))
  const restore    = (id: string) => setStatuses((s) => ({ ...s, [id]: 'active' }))
  const setDraft   = (id: string) => setStatuses((s) => ({ ...s, [id]: 'draft' }))

  const TABS = useMemo(() => [
    { id: 'all',       label: 'All',         count: mockProducts.length },
    { id: 'active',    label: 'Active',       count: Object.values(statuses).filter((s) => s === 'active').length },
    { id: 'draft',     label: 'Draft',        count: Object.values(statuses).filter((s) => s === 'draft').length },
    { id: 'out_of_stock', label: 'Out of Stock', count: Object.values(statuses).filter((s) => s === 'out_of_stock').length },
    { id: 'archived',  label: 'Archived',     count: Object.values(statuses).filter((s) => s === 'archived').length },
  ].filter((t) => t.id === 'all' || t.count > 0), [statuses])

  const filtered = useMemo(() => {
    let list = mockProducts.filter((p) => {
      if (tab !== 'all' && statuses[p.id] !== tab) return false
      if (vendor !== 'all' && p.vendorId !== vendor) return false
      if (category !== 'all' && p.categoryId !== category) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false
      }
      return true
    })
    switch (sort) {
      case 'oldest':    list = [...list].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)); break
      case 'price_hi':  list = [...list].sort((a, b) => b.price - a.price); break
      case 'price_lo':  list = [...list].sort((a, b) => a.price - b.price); break
      case 'bestseller': list = [...list].sort((a, b) => b.soldCount - a.soldCount); break
      case 'rating':    list = [...list].sort((a, b) => b.rating - a.rating); break
      default:          list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    }
    return list
  }, [statuses, tab, vendor, category, search, sort])

  const activeCount = Object.values(statuses).filter((s) => s === 'active').length
  const totalValue  = mockProducts.reduce((s, p) => s + p.price * p.stock, 0)
  const lowStock    = mockProducts.filter((p) => p.stock > 0 && p.stock <= 5).length

  return (
    <div className="p-6 lg:p-8 max-w-[1300px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-[1.75rem] font-bold text-[#111111]">Products</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">{mockProducts.length} products across all vendors</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-[#e5e5e5] bg-white text-sm font-medium text-[#6b6b6b] px-4 py-2.5 rounded-xl hover:bg-[#f5f5f4] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Active Products', value: String(activeCount),                           color: 'text-[#16a34a]' },
          { label: 'Inventory Value', value: `₦${(totalValue / 1000).toFixed(0)}k`,         color: 'text-[#111111]' },
          { label: 'Low Stock',       value: String(lowStock),                              color: lowStock > 0 ? 'text-[#d97706]' : 'text-[#9ca3af]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{s.label}</p>
            <p className={`font-serif text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e5e5e5] mb-5 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap relative transition-colors ${tab === t.id ? 'text-[#111111] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#ef4444]' : 'text-[#9ca3af] hover:text-[#6b6b6b]'}`}>
            {t.label} <span className="opacity-60 ml-1 text-xs">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white" />
        </div>
        <select value={vendor} onChange={(e) => setVendor(e.target.value)} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none text-[#6b6b6b]">
          <option value="all">All Vendors</option>
          {mockVendors.map((v) => <option key={v.id} value={v.id}>{v.storeName}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none text-[#6b6b6b]">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none text-[#6b6b6b]">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_hi">Price High–Low</option>
          <option value="price_lo">Price Low–High</option>
          <option value="bestseller">Best Selling</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#e5e5e5] overflow-hidden">
        <div className="grid bg-[#fafaf9] border-b border-[#e5e5e5] px-5 py-3"
          style={{ gridTemplateColumns: '1fr 150px 80px 80px 90px 110px' }}>
          {['Product', 'Vendor', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
            <span key={h} className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af]">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-[#f5f5f4] bg-white">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-3xl">📦</span>
              <p className="font-semibold text-[#111111]">No products found</p>
              <button onClick={() => { setSearch(''); setTab('all'); setVendor('all'); setCategory('all') }} className="text-sm text-[#ef4444] underline">Clear filters</button>
            </div>
          ) : (
            filtered.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                status={statuses[product.id]}
                vendorName={mockVendors.find((v) => v.id === product.vendorId)?.storeName ?? '—'}
                onArchive={() => archive(product.id)}
                onRestore={() => restore(product.id)}
                onDraft={() => setDraft(product.id)}
              />
            ))
          )}
        </div>
      </div>
      <p className="text-sm text-[#9ca3af] mt-4">Showing {filtered.length} of {mockProducts.length} products</p>
    </div>
  )
}

function ProductRow({ product, status, vendorName, onArchive, onRestore, onDraft }: {
  product: Product; status: ProductStatus; vendorName: string
  onArchive: () => void; onRestore: () => void; onDraft: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="grid items-center px-5 py-3.5 hover:bg-[#fafaf9] transition-colors"
      style={{ gridTemplateColumns: '1fr 150px 80px 80px 90px 110px' }}>

      {/* Product */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
          {product.images[0] && <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="40px" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#111111] truncate">{product.name}</p>
          <p className="text-xs font-mono text-[#9ca3af] truncate">{product.sku}</p>
        </div>
      </div>

      {/* Vendor */}
      <p className="text-xs text-[#6b6b6b] truncate">{vendorName}</p>

      {/* Price */}
      <div>
        <p className="text-sm font-medium text-[#111111]">₦{product.price}</p>
        {product.compareAtPrice && (
          <p className="text-xs text-[#9ca3af] line-through">₦{product.compareAtPrice}</p>
        )}
      </div>

      {/* Stock */}
      <p className={`text-sm font-medium ${product.stock === 0 ? 'text-[#dc2626]' : product.stock <= 5 ? 'text-[#d97706]' : 'text-[#111111]'}`}>
        {product.stock}
      </p>

      {/* Status */}
      <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full w-fit ${STATUS_PILL[status]}`}>
        {status.replace('_', ' ')}
      </span>

      {/* Actions */}
      <div className="relative">
        <div className="flex items-center gap-1.5">
          <Link href={`/products/${product.slug}`} target="_blank"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e5e5e5] text-[#9ca3af] hover:text-[#111111] hover:bg-[#f5f5f4] transition-colors"
            title="View product">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="px-3 py-1.5 text-xs font-medium border border-[#e5e5e5] rounded-lg hover:bg-[#f5f5f4] transition-colors text-[#6b6b6b]">
            ▾
          </button>
        </div>
        {menuOpen && (
          <div className="absolute top-9 right-0 z-20 bg-white border border-[#e5e5e5] rounded-xl shadow-lg py-1 min-w-[130px]" onMouseLeave={() => setMenuOpen(false)}>
            {status === 'active' && <button onClick={() => { onDraft(); setMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-[#6b6b6b] hover:bg-[#f5f5f4]">Set to Draft</button>}
            {status !== 'archived' && <button onClick={() => { onArchive(); setMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-[#dc2626] hover:bg-[#fee2e2]">Archive</button>}
            {status === 'archived' && <button onClick={() => { onRestore(); setMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-[#16a34a] hover:bg-[#dcfce7]">Restore</button>}
          </div>
        )}
      </div>
    </div>
  )
}