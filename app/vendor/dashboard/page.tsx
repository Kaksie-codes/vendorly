// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/dashboard/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import {
  mockVendorAnalytics,
  getOrdersByVendor,
  getVendorById,
  mockProducts,
} from '@/lib/mock-data'
import { RevenueChart } from '@/components/vendor/RevenueChart'
import { StatCard } from '@/components/vendor/StatCard'

const VENDOR_ID = 'vendor-1'

const PERIOD_OPTIONS = [
  { value: '7d',  label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
]

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending:          'bg-[#fef3c7] text-[#d97706]',
  confirmed:        'bg-[#dbeafe] text-[#2563eb]',
  processing:       'bg-[#dbeafe] text-[#2563eb]',
  shipped:          'bg-[#e0e7ff] text-[#7c3aed]',
  out_for_delivery: 'bg-[#e0e7ff] text-[#7c3aed]',
  delivered:        'bg-[#dcfce7] text-[#16a34a]',
  cancelled:        'bg-[#fee2e2] text-[#dc2626]',
}

export default function VendorDashboardPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  const analytics   = mockVendorAnalytics[VENDOR_ID]
  const vendor      = getVendorById(VENDOR_ID)
  const allOrders   = getOrdersByVendor(VENDOR_ID)
  const recentOrders = allOrders.slice(0, 5)

  // Slice chart data by period
  const chartData = period === '7d'
    ? analytics.revenueByDay.slice(-7)
    : period === '30d'
      ? analytics.revenueByDay
      : analytics.revenueByDay  // in real app would be 90d data

  // Pending actions
  const pendingCount    = allOrders.filter((o) => o.status === 'pending').length
  const processingCount = allOrders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length
  const lowStockCount   = mockProducts.filter((p) => p.vendorId === VENDOR_ID && p.stock <= 5 && p.stock > 0).length

  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#111111]">
            Welcome back{vendor ? `, ${vendor.storeName}` : ''}
          </h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Here's what's happening in your store</p>
        </div>

        {/* Period selector */}
        <div className="flex gap-1 p-1 bg-[#f5f5f4] rounded-xl">
          {PERIOD_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setPeriod(o.value as '7d' | '30d' | '90d')}
              className={[
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                period === o.value ? 'bg-white text-[#111111] shadow-sm' : 'text-[#9ca3af] hover:text-[#6b6b6b]',
              ].join(' ')}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {(pendingCount > 0 || lowStockCount > 0) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {pendingCount > 0 && (
            <Link href="/vendor/orders" className="flex items-center gap-2 px-4 py-2.5 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-sm font-medium text-[#d97706] hover:bg-[#fde68a] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {pendingCount} pending order{pendingCount !== 1 ? 's' : ''} need attention
            </Link>
          )}
          {lowStockCount > 0 && (
            <Link href="/vendor/products" className="flex items-center gap-2 px-4 py-2.5 bg-[#fee2e2] border border-[#fecaca] rounded-xl text-sm font-medium text-[#dc2626] hover:bg-[#fecaca] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {lowStockCount} product{lowStockCount !== 1 ? 's' : ''} low on stock
            </Link>
          )}
        </div>
      )}

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value={`₦${analytics.totalRevenue.toLocaleString()}`}
          change="+12.4%"
          positive
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
        />
        <StatCard
          label="Total Orders"
          value={analytics.totalOrders.toString()}
          change="+8.1%"
          positive
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>}
        />
        <StatCard
          label="Avg. Order Value"
          value={`₦${analytics.averageOrderValue.toLocaleString()}`}
          change="+3.8%"
          positive
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
        />
        <StatCard
          label="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          change="-0.3%"
          positive={false}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
      </div>

      {/* ── Revenue chart + top products ────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#111111]">Revenue Overview</h2>
            <span className="text-xs text-[#9ca3af]">Last {period}</span>
          </div>
          <RevenueChart data={chartData} />
        </div>

        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <h2 className="font-semibold text-[#111111] mb-4">Top Products</h2>
          <div className="flex flex-col gap-3">
            {analytics.topProducts.map((tp, i) => (
              <div key={tp.productId} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#9ca3af] w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] truncate">{tp.name}</p>
                  <p className="text-xs text-[#9ca3af]">{tp.unitsSold} sold</p>
                </div>
                <span className="text-sm font-semibold text-[#111111] shrink-0">₦{tp.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Orders by status + recent orders ────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <h2 className="font-semibold text-[#111111] mb-4">Orders by Status</h2>
          <div className="flex flex-col gap-2">
            {Object.entries(analytics.ordersByStatus)
              .filter(([, count]) => count > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${ORDER_STATUS_STYLES[status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
                    {status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold text-[#111111]">{count}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#111111]">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-xs text-[#c8a951] hover:underline font-medium">View all</Link>
          </div>
          <div className="flex flex-col divide-y divide-[#f5f5f4]">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111]">{order.orderNumber}</p>
                  <p className="text-xs text-[#9ca3af]">{order.items.length} item{order.items.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${ORDER_STATUS_STYLES[order.status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-semibold text-[#111111] shrink-0">₦{order.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}