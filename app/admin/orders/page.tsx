// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/orders/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { mockOrders, getVendorById } from '@/lib/mock-data'
import type { Order, OrderStatus } from '@/types'

const STATUS_PILL: Record<string, string> = {
  pending:          'bg-[#fef3c7] text-[#d97706]',
  confirmed:        'bg-[#dbeafe] text-[#2563eb]',
  processing:       'bg-[#dbeafe] text-[#2563eb]',
  shipped:          'bg-[#ede9fe] text-[#7c3aed]',
  out_for_delivery: 'bg-[#ede9fe] text-[#7c3aed]',
  delivered:        'bg-[#dcfce7] text-[#16a34a]',
  cancelled:        'bg-[#fee2e2] text-[#dc2626]',
  refunded:         'bg-[#fee2e2] text-[#dc2626]',
  return_requested: 'bg-[#fef3c7] text-[#d97706]',
  returned:         'bg-[#f5f5f4] text-[#6b6b6b]',
}

const ALL_STATUSES: OrderStatus[] = [
  'pending','confirmed','processing','shipped','out_for_delivery',
  'delivered','cancelled','refunded','return_requested','returned',
]

export default function AdminOrdersPage() {
  const [search,   setSearch]   = useState('')
  const [tab,      setTab]      = useState('all')
  const [sort,     setSort]     = useState('newest')
  const [expanded, setExpanded] = useState<string | null>(null)

  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { all: mockOrders.length }
    mockOrders.forEach((o) => { c[o.status] = (c[o.status] ?? 0) + 1 })
    return c
  }, [])

  const TABS = [
    { id: 'all',        label: 'All',        count: tabCounts.all ?? 0 },
    { id: 'pending',    label: 'Pending',     count: (tabCounts.pending ?? 0) + (tabCounts.confirmed ?? 0) },
    { id: 'processing', label: 'Processing',  count: tabCounts.processing ?? 0 },
    { id: 'shipped',    label: 'Shipped',     count: (tabCounts.shipped ?? 0) + (tabCounts.out_for_delivery ?? 0) },
    { id: 'delivered',  label: 'Delivered',   count: tabCounts.delivered ?? 0 },
    { id: 'cancelled',  label: 'Cancelled',   count: (tabCounts.cancelled ?? 0) + (tabCounts.refunded ?? 0) },
  ].filter((t) => t.id === 'all' || t.count > 0)

  const filtered = useMemo(() => {
    let list = mockOrders.filter((o) => {
      if (tab === 'pending')   return o.status === 'pending'   || o.status === 'confirmed'
      if (tab === 'shipped')   return o.status === 'shipped'   || o.status === 'out_for_delivery'
      if (tab === 'cancelled') return o.status === 'cancelled' || o.status === 'refunded'
      if (tab !== 'all')       return o.status === tab
      return true
    })
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(q) ||
        (o.customer?.email ?? '').toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'oldest':  return [...list].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
      case 'highest': return [...list].sort((a, b) => b.total - a.total)
      case 'lowest':  return [...list].sort((a, b) => a.total - b.total)
      default:        return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    }
  }, [tab, search, sort])

  const totalRevenue  = mockOrders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0)
  const pendingCount  = mockOrders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length
  const refundCount   = mockOrders.filter((o) => o.status === 'refunded' || o.status === 'return_requested').length

  return (
    <div className="p-6 lg:p-8 max-w-[1300px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-[1.75rem] font-bold text-[#111111]">Orders</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">{mockOrders.length} total platform orders</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-[#e5e5e5] bg-white text-sm font-medium text-[#6b6b6b] px-4 py-2.5 rounded-xl hover:bg-[#f5f5f4] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Platform Revenue', value: `₦${(totalRevenue / 1000).toFixed(1)}k`, color: 'text-[#111111]' },
          { label: 'Awaiting Action',  value: String(pendingCount),                      color: pendingCount > 0 ? 'text-[#d97706]' : 'text-[#9ca3af]' },
          { label: 'Refund Requests',  value: String(refundCount),                       color: refundCount > 0 ? 'text-[#dc2626]' : 'text-[#9ca3af]' },
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order # or customer…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none text-[#6b6b6b]">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Value</option>
          <option value="lowest">Lowest Value</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#e5e5e5] overflow-hidden">
        <div className="grid bg-[#fafaf9] border-b border-[#e5e5e5] px-5 py-3"
          style={{ gridTemplateColumns: '1fr 160px 110px 100px 40px' }}>
          {['Order / Customer', 'Vendor', 'Status', 'Total', ''].map((h) => (
            <span key={h} className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af]">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-[#f5f5f4] bg-white">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-3xl">📋</span>
              <p className="font-semibold text-[#111111]">No orders found</p>
              <button onClick={() => { setSearch(''); setTab('all') }} className="text-sm text-[#ef4444] underline">Clear filters</button>
            </div>
          ) : (
            filtered.map((order) => (
              <AdminOrderRow
                key={order.id}
                order={order}
                expanded={expanded === order.id}
                onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
              />
            ))
          )}
        </div>
      </div>
      <p className="text-sm text-[#9ca3af] mt-4">Showing {filtered.length} of {mockOrders.length} orders</p>
    </div>
  )
}

function AdminOrderRow({ order, expanded, onToggle }: {
  order: Order; expanded: boolean; onToggle: () => void
}) {
  // Get unique vendor names from items
  const vendorIds = [...new Set(order.items.map((i) => i.vendorId))]
  const vendorNames = vendorIds.map((vid) => getVendorById(vid)?.storeName ?? vid).join(', ')

  return (
    <>
      <div className="grid items-center px-5 py-4 hover:bg-[#fafaf9] transition-colors cursor-pointer"
        style={{ gridTemplateColumns: '1fr 160px 110px 100px 40px' }}
        onClick={onToggle}>

        {/* Order + customer */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex -space-x-2 shrink-0">
            {order.items.slice(0, 2).map((item, i) => (
              <div key={item.id} className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-white bg-[#f5f5f4]" style={{ zIndex: 2 - i }}>
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="36px" />
              </div>
            ))}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111111] truncate">{order.orderNumber}</p>
            <p className="text-xs text-[#9ca3af] truncate">
              {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest'} · {order.items.length} items ·{' '}
              {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Vendor */}
        <p className="text-xs text-[#6b6b6b] truncate">{vendorNames}</p>

        {/* Status */}
        <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap w-fit ${STATUS_PILL[order.status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
          {order.status.replace(/_/g, ' ')}
        </span>

        {/* Total */}
        <div>
          <p className="text-sm font-semibold text-[#111111]">₦{order.total.toLocaleString()}</p>
          {order.paymentStatus === 'paid' && <p className="text-[0.6rem] font-bold text-[#16a34a] uppercase">Paid</p>}
        </div>

        {/* Chevron */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"
          className={`transition-transform duration-200 mx-auto ${expanded ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {expanded && (
        <div className="bg-[#fafaf9] border-t border-[#f5f5f4] px-5 py-5 grid sm:grid-cols-3 gap-5">
          {/* Items */}
          <div className="sm:col-span-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">Line Items</p>
            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="32px" />
                  </div>
                  <p className="flex-1 text-sm text-[#6b6b6b] truncate">{item.name}</p>
                  <span className="text-xs text-[#9ca3af]">×{item.quantity}</span>
                  <span className="text-sm font-medium text-[#111111] w-20 text-right">₦{item.totalPrice.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order details */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Ship To</p>
              <p className="text-xs text-[#6b6b6b] leading-relaxed">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br/>
                {order.shippingAddress.line1}<br/>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Payment</p>
              <p className="text-xs text-[#6b6b6b]">{order.paymentMethod}</p>
              <p className={`text-xs font-semibold mt-0.5 ${order.paymentStatus === 'paid' ? 'text-[#16a34a]' : 'text-[#d97706]'}`}>
                {order.paymentStatus}
              </p>
            </div>
            {order.trackingNumber && (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Tracking</p>
                <p className="text-xs font-mono text-[#111111]">{order.trackingNumber}</p>
                <p className="text-xs text-[#9ca3af]">{order.trackingCarrier}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}