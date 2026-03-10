// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/dashboard/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mockAdminAnalytics, mockVendors, mockOrders, mockUsers } from '@/lib/mock-data'
import { AdminChart } from '@/components/admin/AdminChart'

const PERIODS = ['7d', '30d', '90d'] as const

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const a = mockAdminAnalytics

  const sliceData = period === '7d' ? a.revenueByDay.slice(-7)
    : period === '90d' ? a.revenueByDay
    : a.revenueByDay.slice(-30)

  const pendingVendors = mockVendors.filter((v) => v.status === 'pending')
  const recentOrders   = [...mockOrders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5)
  const newUsers       = [...mockUsers].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 4)

  const STATS = [
    {
      label: 'Total Revenue',
      value: `₦${(a.totalRevenue / 1000).toFixed(0)}k`,
      sub: `Platform fees: ₦${(a.platformFees / 1000).toFixed(1)}k`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      iconBg: 'bg-[#dcfce7]', iconColor: 'text-[#16a34a]',
      trend: '+18.2%', positive: true,
    },
    {
      label: 'Total Orders',
      value: a.totalOrders.toLocaleString(),
      sub: `${a.totalVendors} active vendors`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      iconBg: 'bg-[#dbeafe]', iconColor: 'text-[#2563eb]',
      trend: '+12.4%', positive: true,
    },
    {
      label: 'Total Users',
      value: a.totalUsers.toLocaleString(),
      sub: `+${a.newUsers} this month`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
      iconBg: 'bg-[#ede9fe]', iconColor: 'text-[#7c3aed]',
      trend: '+8.7%', positive: true,
    },
    {
      label: 'Active Products',
      value: a.activeProducts.toLocaleString(),
      sub: `${a.newVendors} new vendors`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
      iconBg: 'bg-[#fef3c7]', iconColor: 'text-[#d97706]',
      trend: '+5.1%', positive: true,
    },
  ]

  const STATUS_PILL: Record<string, string> = {
    pending:          'bg-[#fef3c7] text-[#d97706]',
    confirmed:        'bg-[#dbeafe] text-[#2563eb]',
    processing:       'bg-[#dbeafe] text-[#2563eb]',
    shipped:          'bg-[#ede9fe] text-[#7c3aed]',
    out_for_delivery: 'bg-[#ede9fe] text-[#7c3aed]',
    delivered:        'bg-[#dcfce7] text-[#16a34a]',
    cancelled:        'bg-[#fee2e2] text-[#dc2626]',
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-serif text-[1.75rem] font-bold text-[#111111] leading-tight">Platform Overview</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">All metrics across the entire Vendorly platform</p>
        </div>
        <div className="flex gap-1 p-1 bg-white border border-[#e5e5e5] rounded-xl">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${period === p ? 'bg-[#111111] text-white' : 'text-[#9ca3af] hover:text-[#6b6b6b]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{s.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg} ${s.iconColor}`}>{s.icon}</div>
            </div>
            <p className="font-serif text-2xl font-bold text-[#111111]">{s.value}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-xs font-semibold ${s.positive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>{s.trend}</span>
              <span className="text-xs text-[#9ca3af]">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart ── */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 mb-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-[#111111]">Platform Revenue</h2>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              ₦{sliceData.reduce((s, d) => s + d.revenue, 0).toLocaleString()} ·{' '}
              {sliceData.reduce((s, d) => s + d.orders, 0).toLocaleString()} orders
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#9ca3af]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#ef4444] rounded-full inline-block" />Revenue</span>
          </div>
        </div>
        <AdminChart data={sliceData} height={220} />
      </div>

      {/* ── Bottom grid ── */}
      <div className="grid lg:grid-cols-3 gap-7">

        {/* Top vendors */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#111111]">Top Vendors</h2>
            <Link href="/admin/vendors" className="text-xs text-[#ef4444] hover:underline font-medium">View all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {a.topVendors.filter((v) => v.revenue > 0).map((v, i) => {
              const vendor = mockVendors.find((mv) => mv.id === v.vendorId)
              const maxRev = a.topVendors[0].revenue
              return (
                <div key={v.vendorId}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-[#9ca3af] w-4 shrink-0">{i + 1}</span>
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
                      {vendor?.logo && <Image src={vendor.logo} alt={v.storeName} fill className="object-cover" sizes="28px" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111111] truncate">{v.storeName}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#111111] shrink-0">₦{(v.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="ml-7 h-1.5 bg-[#f5f5f4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ef4444] rounded-full" style={{ width: `${(v.revenue / maxRev) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top categories */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#111111]">Top Categories</h2>
            <Link href="/admin/products" className="text-xs text-[#ef4444] hover:underline font-medium">Products →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {a.topCategories.map((cat, i) => {
              const maxRev = a.topCategories[0].revenue
              return (
                <div key={cat.categoryId}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#9ca3af] w-4 shrink-0">{i + 1}</span>
                    <p className="flex-1 text-sm font-medium text-[#111111] truncate">{cat.name}</p>
                    <span className="text-xs text-[#9ca3af]">{cat.orders} orders</span>
                    <span className="text-sm font-semibold text-[#111111] w-16 text-right">₦{(cat.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="ml-6 h-1.5 bg-[#f5f5f4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c8a951] rounded-full" style={{ width: `${(cat.revenue / maxRev) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: pending vendors + recent orders */}
        <div className="flex flex-col gap-5">

          {/* Pending vendor approvals */}
          {pendingVendors.length > 0 && (
            <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
                  <h2 className="font-semibold text-[#111111] text-sm">Pending Approvals</h2>
                </div>
                <Link href="/admin/vendors?tab=pending" className="text-xs text-[#ef4444] hover:underline font-medium">Review →</Link>
              </div>
              <div className="flex flex-col gap-2">
                {pendingVendors.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#fed7aa]">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#f5f5f4] shrink-0 border border-[#e5e5e5]">
                      {v.logo && <Image src={v.logo} alt={v.storeName} fill className="object-cover" sizes="32px" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111111] truncate">{v.storeName}</p>
                      <p className="text-xs text-[#9ca3af]">{v.plan} plan · {new Date(v.joinedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <Link href={`/admin/vendors/${v.id}`} className="px-3 py-1.5 text-xs font-semibold bg-[#111111] text-white rounded-lg hover:bg-[#333] transition-colors whitespace-nowrap">
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent orders */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#111111]">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#ef4444] hover:underline font-medium">All orders →</Link>
            </div>
            <div className="flex flex-col divide-y divide-[#f5f5f4]">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#111111] truncate">{order.orderNumber}</p>
                    <p className="text-xs text-[#9ca3af]">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>
                  <span className={`text-[0.6rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_PILL[order.status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold text-[#111111] w-20 text-right shrink-0">
                    ₦{order.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── New signups ── */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 mt-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#111111]">Recent Signups</h2>
          <Link href="/admin/users" className="text-xs text-[#ef4444] hover:underline font-medium">All users →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {newUsers.map((user) => (
            <Link key={user.id} href={`/admin/users/${user.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-[#e5e5e5] hover:border-[#ef4444] hover:bg-[#fff5f5] transition-all group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
                {user.avatar
                  ? <Image src={user.avatar} alt="" fill className="object-cover" sizes="36px" />
                  : <span className="w-full h-full flex items-center justify-center text-sm font-bold text-[#9ca3af]">{user.firstName[0]}</span>
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#111111] truncate group-hover:text-[#ef4444] transition-colors">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-[#9ca3af] capitalize">{user.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}