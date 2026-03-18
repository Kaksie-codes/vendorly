// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/orders/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { getOrdersByVendor } from '@/lib/mock-data'
import type { Order, OrderStatus } from '@/types'
import { Select } from '@/components/ui/Select'

const VENDOR_ID = 'vendor-1'

// Status → pill colours
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

// What action can vendor take next
const NEXT_ACTION: Partial<Record<OrderStatus, string>> = {
  pending:          'Confirm Order',
  confirmed:        'Start Processing',
  processing:       'Mark Shipped',
  shipped:          'Out for Delivery',
  out_for_delivery: 'Mark Delivered',
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:          'confirmed',
  confirmed:        'processing',
  processing:       'shipped',
  shipped:          'out_for_delivery',
  out_for_delivery: 'delivered',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing',
  shipped: 'Shipped', out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  cancelled: 'Cancelled', refunded: 'Refunded', return_requested: 'Return Requested', returned: 'Returned',
}

export default function VendorOrdersPage() {
  const allOrders = getOrdersByVendor(VENDOR_ID)

  const [search,     setSearch]     = useState('')
  const [activeTab,  setActiveTab]  = useState('all')
  const [sort,       setSort]       = useState('newest')
  const [expanded,   setExpanded]   = useState<string | null>(null)
  const [localStatus, setLocalStatus] = useState<Record<string, OrderStatus>>(
    Object.fromEntries(allOrders.map((o) => [o.id, o.status]))
  )

  const advance = (id: string) => {
    const cur  = localStatus[id]
    const next = NEXT_STATUS[cur]
    if (next) setLocalStatus((s) => ({ ...s, [id]: next }))
  }

  // Build tab list dynamically
  const tabList = useMemo(() => {
    const c: Record<string, number> = { all: allOrders.length }
    allOrders.forEach((o) => {
      const s = localStatus[o.id]
      c[s] = (c[s] ?? 0) + 1
    })
    return [
      { id: 'all',        label: 'All',         count: allOrders.length },
      { id: 'pending',    label: 'Pending',      count: (c.pending ?? 0) + (c.confirmed ?? 0) },
      { id: 'processing', label: 'Processing',   count: c.processing ?? 0 },
      { id: 'shipped',    label: 'Shipped',       count: (c.shipped ?? 0) + (c.out_for_delivery ?? 0) },
      { id: 'delivered',  label: 'Delivered',     count: c.delivered ?? 0 },
      { id: 'cancelled',  label: 'Cancelled',     count: (c.cancelled ?? 0) + (c.refunded ?? 0) },
    ].filter((t) => t.id === 'all' || t.count > 0)
  }, [allOrders, localStatus])

  const filtered = useMemo(() => {
    let list = allOrders.filter((o) => {
      const s = localStatus[o.id]
      if (activeTab === 'pending')   return s === 'pending'   || s === 'confirmed'
      if (activeTab === 'shipped')   return s === 'shipped'   || s === 'out_for_delivery'
      if (activeTab === 'cancelled') return s === 'cancelled' || s === 'refunded'
      if (activeTab !== 'all')       return s === activeTab
      return true
    })
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'oldest':  return [...list].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
      case 'highest': return [...list].sort((a, b) => b.total - a.total)
      case 'lowest':  return [...list].sort((a, b) => a.total - b.total)
      default:        return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    }
  }, [allOrders, localStatus, activeTab, search, sort])

  const revenue  = allOrders.filter((o) => !['cancelled','refunded'].includes(localStatus[o.id])).reduce((s,o) => s+o.total, 0)
  const needAct  = allOrders.filter((o) => ['pending','confirmed'].includes(localStatus[o.id])).length
  const inTransit = allOrders.filter((o) => ['shipped','out_for_delivery'].includes(localStatus[o.id])).length

  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-[1.75rem] font-bold text-[#111111] leading-tight">Orders</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">{allOrders.length} total orders</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-[#e5e5e5] bg-white text-sm font-medium text-[#6b6b6b] px-4 py-2.5 rounded-xl hover:bg-[#f5f5f4] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total Revenue',  value: `₦${revenue.toLocaleString()}`,     color: 'text-[#111111]' },
          { label: 'Needs Action',   value: String(needAct),                     color: 'text-[#d97706]' },
          { label: 'In Transit',     value: String(inTransit),                   color: 'text-[#7c3aed]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{s.label}</p>
            <p className={`font-serif text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Status tabs ── */}
      <div className="flex border-b border-[#e5e5e5] mb-5 gap-0 overflow-x-auto">
        {tabList.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={[
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap relative transition-colors',
              activeTab === t.id
                ? 'text-[#111111] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c8a951]'
                : 'text-[#9ca3af] hover:text-[#6b6b6b]',
            ].join(' ')}
          >
            {t.label}
            <span className="ml-1.5 text-xs font-normal opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* ── Search + sort ── */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white"
          />
        </div>
        <Select
          options={[
            { value: 'newest',  label: 'Newest' },
            { value: 'oldest',  label: 'Oldest' },
            { value: 'highest', label: 'Highest Value' },
            { value: 'lowest',  label: 'Lowest Value' },
          ]}
          value={sort}
          onChange={(v) => setSort(v)}
          size="sm"
        />
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-[#e5e5e5] overflow-hidden">
        {/* Header row */}
        <div className="grid items-center bg-[#fafaf9] border-b border-[#e5e5e5] px-5 py-3"
          style={{ gridTemplateColumns: '1fr 100px 130px 130px 40px' }}>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af]">Order</span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] text-right">Total</span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] text-center">Status</span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] text-center hidden sm:block">Action</span>
          <span />
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#f5f5f4] bg-white">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-4xl">📋</span>
              <p className="font-semibold text-[#111111]">No orders found</p>
              <button onClick={() => { setSearch(''); setActiveTab('all') }} className="text-sm text-[#c8a951] underline">Clear filters</button>
            </div>
          ) : (
            filtered.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                status={localStatus[order.id]}
                onAdvance={() => advance(order.id)}
                expanded={expanded === order.id}
                onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
              />
            ))
          )}
        </div>
      </div>

      <p className="text-sm text-[#9ca3af] mt-4">
        Showing {filtered.length} of {allOrders.length} orders
      </p>
    </div>
  )
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({ order, status, onAdvance, expanded, onToggle }: {
  order: Order; status: OrderStatus
  onAdvance: () => void; expanded: boolean; onToggle: () => void
}) {
  const action = NEXT_ACTION[status]

  return (
    <>
      {/* Main row */}
      <div
        className="grid items-center px-5 py-4 hover:bg-[#fafaf9] transition-colors cursor-pointer"
        style={{ gridTemplateColumns: '1fr 100px 130px 130px 40px' }}
        onClick={onToggle}
      >
        {/* Order info */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Image stack */}
          <div className="flex -space-x-2 shrink-0">
            {order.items.slice(0, 2).map((item, i) => (
              <div key={item.id} className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-white bg-[#f5f5f4]" style={{ zIndex: 10 - i }}>
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="36px" />
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="w-9 h-9 rounded-xl border-2 border-white bg-[#f5f5f4] flex items-center justify-center text-[0.6rem] font-bold text-[#9ca3af]" style={{ zIndex: 0 }}>
                +{order.items.length - 2}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111111] truncate">{order.orderNumber}</p>
            <p className="text-xs text-[#9ca3af] truncate">
              {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest'}
              {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
              {' · '}{new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm font-semibold text-[#111111]">₦{order.total.toLocaleString()}</p>
          {order.paymentStatus === 'paid' && (
            <p className="text-[0.6rem] font-bold text-[#16a34a] uppercase tracking-wide">Paid</p>
          )}
        </div>

        {/* Status pill */}
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-3 py-1 rounded-full whitespace-nowrap ${STATUS_PILL[status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
            {STATUS_LABEL[status] ?? status}
          </span>
        </div>

        {/* Action button */}
        <div className="hidden sm:flex justify-center" onClick={(e) => e.stopPropagation()}>
          {action ? (
            <button
              onClick={onAdvance}
              className="px-3 py-1.5 text-xs font-semibold bg-[#111111] text-white rounded-lg hover:bg-[#333] transition-colors whitespace-nowrap"
            >
              {action}
            </button>
          ) : (
            <span className="text-sm text-[#e5e5e5]">—</span>
          )}
        </div>

        {/* Chevron */}
        <div className="flex justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="bg-[#fafaf9] border-t border-[#f5f5f4] px-5 py-5 flex flex-col gap-5">

          {/* Line items */}
          <div className="flex flex-col gap-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Items</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#f5f5f4] shrink-0 border border-[#e5e5e5]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="32px" />
                </div>
                <p className="flex-1 text-sm text-[#6b6b6b]">{item.name}</p>
                <span className="text-xs text-[#9ca3af] w-8 text-center">×{item.quantity}</span>
                <span className="text-sm font-medium text-[#111111] w-24 text-right">₦{item.totalPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* View full details link */}
          <div className="flex justify-end">
            <Link href={`/vendor/orders/${order.id}`} className="text-xs font-semibold text-[#c8a951] hover:underline">
              View full order details →
            </Link>
          </div>

          {/* Address + tracking */}
          <div className="grid sm:grid-cols-2 gap-5 pt-3 border-t border-[#e5e5e5]">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">Ship To</p>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.line1}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>
            {order.trackingNumber ? (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">Tracking</p>
                <p className="text-sm font-mono text-[#111111]">{order.trackingNumber}</p>
                <p className="text-xs text-[#9ca3af] mt-0.5">{order.trackingCarrier}</p>
              </div>
            ) : (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">Order Summary</p>
                <div className="flex flex-col gap-1">
                  <Row label="Subtotal"  value={`₦${order.subtotal.toLocaleString()}`} />
                  {order.shippingAmount > 0 && <Row label="Shipping" value={`₦${order.shippingAmount.toLocaleString()}`} />}
                  {order.discountAmount > 0 && <Row label="Discount" value={`-₦${order.discountAmount.toLocaleString()}`} green />}
                  <Row label="Total" value={`₦${order.total.toLocaleString()}`} bold />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function Row({ label, value, bold, green }: { label: string; value: string; bold?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#9ca3af]">{label}</span>
      <span className={bold ? 'font-semibold text-[#111111]' : green ? 'text-[#16a34a]' : 'text-[#6b6b6b]'}>{value}</span>
    </div>
  )
}