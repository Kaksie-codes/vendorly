// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/customers/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getOrdersByVendor, getUserById } from '@/lib/mock-data'
import type { Order } from '@/types'

const VENDOR_ID = 'vendor-1'

type SortKey = 'spent' | 'orders' | 'recent'

// ── Build the customer record type ───────────────────────────────────────────
type CustomerRecord = {
  userId:        string
  name:          string
  email:         string
  phone:         string
  avatar:        string
  totalOrders:   number
  totalSpent:    number
  lastOrderDate: string
  lastOrderId:   string
  firstOrderDate: string
  orders:        Order[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  if (src) {
    return (
      <Image src={src} alt={name} width={size} height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}/>
    )
  }
  return (
    <div className="rounded-full bg-[#f5f5f4] flex items-center justify-center shrink-0 font-bold text-[#9ca3af]"
      style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {name[0]?.toUpperCase()}
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    delivered:        { bg: '#dcfce7', color: '#16a34a' },
    shipped:          { bg: '#ede9fe', color: '#7c3aed' },
    processing:       { bg: '#dbeafe', color: '#2563eb' },
    confirmed:        { bg: '#dbeafe', color: '#2563eb' },
    pending:          { bg: '#fef3c7', color: '#d97706' },
    out_for_delivery: { bg: '#fef3c7', color: '#d97706' },
    cancelled:        { bg: '#fee2e2', color: '#dc2626' },
    refunded:         { bg: '#f5f5f4', color: '#6b6b6b' },
  }
  const s = map[status] ?? { bg: '#f5f5f4', color: '#6b6b6b' }
  return (
    <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full capitalize whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

// ── Customer detail panel ─────────────────────────────────────────────────────
function CustomerPanel({ customer, onClose }: { customer: CustomerRecord; onClose: () => void }) {
  const avgOrder = customer.totalOrders
    ? Math.round(customer.totalSpent / customer.totalOrders) : 0

  // Vendor-specific items across all orders
  const vendorItems = customer.orders.flatMap((o) =>
    o.items.filter((i) => i.vendorId === VENDOR_ID).map((i) => ({ ...i, order: o }))
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}/>

      {/* Panel */}
      <div className="relative w-full max-w-[460px] h-full bg-white shadow-2xl overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-5 py-4 flex items-center justify-between z-10">
          <p className="text-sm font-semibold text-[#111111]">Customer Profile</p>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#111111] hover:bg-[#f5f5f4] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1">

          {/* Identity card */}
          <div className="flex items-center gap-4 p-4 bg-[#fafaf9] rounded-2xl border border-[#e5e5e5]">
            <Avatar src={customer.avatar} name={customer.name} size={52}/>
            <div className="min-w-0">
              <p className="font-semibold text-[#111111]">{customer.name}</p>
              <p className="text-xs text-[#9ca3af] truncate">{customer.email}</p>
              {customer.phone && (
                <p className="text-xs text-[#9ca3af]">{customer.phone}</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Orders',    value: customer.totalOrders,                color: '#111111' },
              { label: 'Spent',     value: `₦${customer.totalSpent.toLocaleString()}`, color: '#c8a951' },
              { label: 'Avg Order', value: `₦${avgOrder.toLocaleString()}`,     color: '#2563eb' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#e5e5e5] rounded-xl p-3 text-center">
                <p className="text-lg font-bold" style={{ color: s.color, fontFamily: 'var(--font-heading)' }}>
                  {s.value}
                </p>
                <p className="text-xs text-[#9ca3af] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Customer since */}
          <div className="flex items-center justify-between text-xs text-[#9ca3af] px-1">
            <span>Customer since <strong className="text-[#6b6b6b]">
              {new Date(customer.firstOrderDate).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
            </strong></span>
            {customer.totalOrders > 1 && (
              <span className="bg-[#fef3c7] text-[#d97706] font-semibold px-2 py-0.5 rounded-full text-[0.65rem]">
                Repeat buyer
              </span>
            )}
          </div>

          {/* Items bought from this store */}
          <div>
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">
              Items Purchased from Your Store
            </p>
            <div className="space-y-2.5">
              {vendorItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-[#fafaf9] rounded-xl border border-[#e5e5e5]">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f5f5f4] shrink-0">
                    <Image src={item.image} alt={item.name} width={40} height={40}
                      className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#111111] truncate">{item.name}</p>
                    <p className="text-xs text-[#9ca3af]">
                      Qty {item.quantity} · {new Date(item.order.createdAt).toLocaleDateString('en', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-[#111111] shrink-0">
                    ₦{item.totalPrice.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order history */}
          <div>
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">
              Order History
            </p>
            <div className="space-y-2.5">
              {customer.orders.map((order) => (
                <div key={order.id}
                  className="p-3.5 bg-white border border-[#e5e5e5] rounded-xl hover:border-[#c8a951] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-[#111111]">{order.orderNumber}</p>
                    <StatusPill status={order.status}/>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#9ca3af]">
                      {new Date(order.createdAt).toLocaleDateString('en', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                      {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-semibold text-[#111111]">
                        ₦{order.total.toLocaleString()}
                      </p>
                      <Link href={`/vendor/orders/${order.id}`}
                        className="text-xs text-[#c8a951] hover:underline font-medium">
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] p-4">
          <Link href={`/vendor/orders?customer=${customer.userId}`}
            className="w-full flex items-center justify-center gap-2 bg-[#111111] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function VendorCustomersPage() {
  const [search, setSearch]     = useState('')
  const [sort, setSort]         = useState<SortKey>('spent')
  const [selected, setSelected] = useState<CustomerRecord | null>(null)

  const orders = useMemo(() => getOrdersByVendor(VENDOR_ID), [])

  // Build customer map from orders
  const customers = useMemo<CustomerRecord[]>(() => {
    const map = new Map<string, CustomerRecord>()

    orders.forEach((order) => {
      const user = getUserById(order.userId)
      if (!user) return

      const existing = map.get(order.userId)
      if (existing) {
        existing.totalOrders++
        existing.totalSpent += order.total
        existing.orders.push(order)
        if (order.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = order.createdAt
          existing.lastOrderId   = order.id
        }
        if (order.createdAt < existing.firstOrderDate) {
          existing.firstOrderDate = order.createdAt
        }
      } else {
        map.set(order.userId, {
          userId:         order.userId,
          name:           `${user.firstName} ${user.lastName}`,
          email:          user.email,
          phone:          user.phone ?? '',
          avatar:         user.avatar ?? '',
          totalOrders:    1,
          totalSpent:     order.total,
          lastOrderDate:  order.createdAt,
          lastOrderId:    order.id,
          firstOrderDate: order.createdAt,
          orders:         [order],
        })
      }
    })

    return Array.from(map.values())
  }, [orders])

  const filtered = useMemo(() => {
    let list = [...customers]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      )
    }
    list.sort((a, b) => {
      if (sort === 'spent')  return b.totalSpent   - a.totalSpent
      if (sort === 'orders') return b.totalOrders  - a.totalOrders
      return b.lastOrderDate.localeCompare(a.lastOrderDate)
    })
    return list
  }, [customers, search, sort])

  // Summary stats
  const totalRevenue  = customers.reduce((s, c) => s + c.totalSpent, 0)
  const repeatBuyers  = customers.filter((c) => c.totalOrders > 1).length
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0
  const retentionPct  = customers.length
    ? Math.round((repeatBuyers / customers.length) * 100) : 0

  const topSpender = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0]

  return (
    <div className="p-5 lg:p-7 max-w-[1100px] space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="admin-page-title">Customers</p>
          <p className="text-sm text-[#9ca3af] mt-0.5">
            Everyone who has ordered from your store
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Customers',
            value: customers.length,
            sub: 'unique buyers',
            icon: '👥',
            bg: '#f5f5f4',
            color: '#111111',
          },
          {
            label: 'Repeat Buyers',
            value: repeatBuyers,
            sub: `${retentionPct}% retention`,
            icon: '🔁',
            bg: '#fef3c7',
            color: '#d97706',
          },
          {
            label: 'Total Revenue',
            value: `₦${totalRevenue.toLocaleString()}`,
            sub: `from ${orders.length} orders`,
            icon: '💰',
            bg: '#fefce8',
            color: '#c8a951',
          },
          {
            label: 'Avg Order Value',
            value: `₦${avgOrderValue.toLocaleString()}`,
            sub: 'per completed order',
            icon: '📊',
            bg: '#eff6ff',
            color: '#2563eb',
          },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e5e5e5] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">{s.label}</p>
              <span className="w-8 h-8 flex items-center justify-center rounded-xl text-base"
                style={{ background: s.bg }}>{s.icon}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-heading)' }}>
              {s.value}
            </p>
            <p className="text-xs text-[#9ca3af] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Top spender highlight ── */}
      {topSpender && (
        <div className="bg-gradient-to-r from-[#fefce8] to-[#fff] border border-[#e8d5a3] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#c8a951]/10 flex items-center justify-center shrink-0 text-lg">
            🏆
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Top Customer</p>
            <p className="text-sm font-semibold text-[#111111]">{topSpender.name}</p>
            <p className="text-xs text-[#9ca3af]">{topSpender.email}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-[#c8a951]" style={{ fontFamily: 'var(--font-heading)' }}>
              ₦{topSpender.totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-[#9ca3af]">{topSpender.totalOrders} orders</p>
          </div>
          <button onClick={() => setSelected(topSpender)}
            className="shrink-0 px-3.5 py-2 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-[#2a2a2a] transition-colors">
            View
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl outline-none focus:border-[#c8a951] transition-all bg-white"/>
        </div>
        {/* Sort */}
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
          className="px-3.5 py-2.5 text-sm border border-[#e5e5e5] rounded-xl outline-none focus:border-[#c8a951] bg-white text-[#111111] cursor-pointer">
          <option value="spent">Highest spend</option>
          <option value="orders">Most orders</option>
          <option value="recent">Most recent</option>
        </select>
      </div>

      {/* ── Customer list ── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e5e5e5] rounded-2xl py-20 text-center">
          <p className="text-4xl mb-3">👤</p>
          <p className="text-sm font-semibold text-[#111111]">No customers found</p>
          <p className="text-xs text-[#9ca3af] mt-1">
            {search ? 'Try a different search term' : 'Customers appear here once they place an order'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid px-5 py-3 bg-[#fafaf9] border-b border-[#e5e5e5]"
            style={{ gridTemplateColumns: '1fr 90px 110px 90px 130px 80px' }}>
            {['Customer', 'Orders', 'Total Spent', 'Avg Order', 'Last Order', ''].map((h) => (
              <p key={h} className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#f5f5f4]">
            {filtered.map((c, idx) => {
              const isRepeat = c.totalOrders > 1
              const avgSpend = Math.round(c.totalSpent / c.totalOrders)

              return (
                <div key={c.userId}
                  className="px-5 py-4 hover:bg-[#fafaf9] transition-colors cursor-pointer"
                  onClick={() => setSelected(c)}>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid items-center gap-4"
                    style={{ gridTemplateColumns: '1fr 90px 110px 90px 130px 80px' }}>

                    {/* Customer */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar src={c.avatar} name={c.name} size={38}/>
                        {idx === 0 && sort === 'spent' && (
                          <span className="absolute -top-1 -right-1 text-[0.6rem]">🏆</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#111111] truncate">{c.name}</p>
                          {isRepeat && (
                            <span className="text-[0.6rem] font-bold bg-[#fef3c7] text-[#d97706] px-1.5 py-0.5 rounded-full shrink-0">
                              Repeat
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9ca3af] truncate">{c.email}</p>
                      </div>
                    </div>

                    {/* Orders */}
                    <p className="text-sm font-semibold text-[#111111]">{c.totalOrders}</p>

                    {/* Total spent */}
                    <p className="text-sm font-semibold text-[#111111]">
                      ₦{c.totalSpent.toLocaleString()}
                    </p>

                    {/* Avg order */}
                    <p className="text-sm text-[#6b6b6b]">₦{avgSpend.toLocaleString()}</p>

                    {/* Last order */}
                    <div>
                      <p className="text-xs text-[#6b6b6b]">
                        {new Date(c.lastOrderDate).toLocaleDateString('en', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                      <StatusPill status={c.orders.find((o) => o.id === c.lastOrderId)?.status ?? 'pending'}/>
                    </div>

                    {/* Action */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(c) }}
                      className="text-xs font-semibold text-[#c8a951] hover:underline">
                      View profile
                    </button>
                  </div>

                  {/* Mobile layout */}
                  <div className="flex sm:hidden items-center gap-3">
                    <Avatar src={c.avatar} name={c.name} size={40}/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-[#111111] truncate">{c.name}</p>
                        {isRepeat && (
                          <span className="text-[0.6rem] font-bold bg-[#fef3c7] text-[#d97706] px-1.5 py-0.5 rounded-full shrink-0">
                            Repeat
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9ca3af] truncate">{c.email}</p>
                      <p className="text-xs text-[#9ca3af] mt-0.5">
                        {c.totalOrders} order{c.totalOrders !== 1 ? 's' : ''} ·{' '}
                        <span className="font-medium text-[#111111]">
                          ₦{c.totalSpent.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-[#9ca3af] text-center">
          {filtered.length} customer{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* ── Customer detail panel ── */}
      {selected && (
        <CustomerPanel customer={selected} onClose={() => setSelected(null)}/>
      )}
    </div>
  )
}