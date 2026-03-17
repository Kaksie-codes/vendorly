// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/analytics/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import {
  mockVendorAnalytics,
  getVendorById,
  getProductsByVendor,
} from '@/lib/mock-data'

const VENDOR_ID = 'vendor-1'
type Period = '7d' | '30d' | '90d'

// ── Shared tooltip ────────────────────────────────────────────────────────────
const TooltipStyle = {
  contentStyle: {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    fontSize: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    padding: '10px 14px',
  },
  labelStyle: { color: '#9ca3af', marginBottom: 4, fontSize: 11 },
}

const fmtNaira = (v: number) =>
  v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, trend, positive, icon, bg, ic }: {
  label: string; value: string | number; sub: string
  trend: string; positive: boolean
  icon: React.ReactNode; bg: string; ic: string
}) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: bg, color: ic }}>
          {icon}
        </div>
      </div>
      <p className="text-[1.65rem] font-bold text-[#111111] leading-none"
        style={{ fontFamily: 'var(--font-heading)' }}>
        {value}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
          positive ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'
        }`}>
          {positive ? '↑' : '↓'} {trend}
        </span>
        <span className="text-xs text-[#9ca3af]">{sub}</span>
      </div>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, right }: {
  title: string; sub?: string; right?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <p className="text-sm font-semibold text-[#111111]">{title}</p>
        {sub && <p className="text-xs text-[#9ca3af] mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function VendorAnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d')

  const analytics = mockVendorAnalytics[VENDOR_ID]
  const vendor    = getVendorById(VENDOR_ID)
  const products  = getProductsByVendor(VENDOR_ID)

  const days  = period === '7d' ? 7 : period === '30d' ? 30 : analytics.revenueByDay.length
  const slice = analytics.revenueByDay.slice(-Math.min(days, analytics.revenueByDay.length))

  const totalRevenue = slice.reduce((s, d) => s + d.revenue, 0)
  const totalOrders  = slice.reduce((s, d) => s + d.orders,  0)
  const avgOrder     = totalOrders ? Math.round(totalRevenue / totalOrders) : 0

  // Chart datasets
  const revenueChartData = slice.map((d) => ({
    date:    fmtDate(d.date),
    Revenue: d.revenue,
    Orders:  d.orders,
  }))

  const topProductBarData = analytics.topProducts.map((p) => ({
    name:     p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name,
    Revenue:  p.revenue,
    Units:    p.unitsSold,
    fullName: p.name,
  }))

  const orderStatusData = [
    { label: 'Delivered',   value: analytics.ordersByStatus.delivered   ?? 72, color: '#16a34a' },
    { label: 'Shipped',     value: analytics.ordersByStatus.shipped      ?? 18, color: '#7c3aed' },
    { label: 'Processing',  value: analytics.ordersByStatus.processing   ?? 12, color: '#2563eb' },
    { label: 'Pending',     value: analytics.ordersByStatus.pending      ?? 4,  color: '#d97706' },
    { label: 'Cancelled',   value: analytics.ordersByStatus.cancelled    ?? 3,  color: '#dc2626' },
  ]
  const statusTotal = orderStatusData.reduce((s, d) => s + d.value, 0)

  const funnelData = [
    { label: 'Store Visits',     value: analytics.totalProductViews,                         pct: 100  },
    { label: 'Product Views',    value: Math.round(analytics.totalProductViews * 0.62),       pct: 62   },
    { label: 'Add to Cart',      value: Math.round(analytics.totalProductViews * 0.18),       pct: 18   },
    { label: 'Completed Orders', value: totalOrders,                                          pct: analytics.conversionRate },
  ]

  const trafficData = [
    { source: 'Direct',         visits: 1842, pct: 38, color: '#c8a951' },
    { source: 'Organic Search', visits: 1214, pct: 25, color: '#2563eb' },
    { source: 'Marketplace',    visits: 1068, pct: 22, color: '#7c3aed' },
    { source: 'Social Media',   visits: 696,  pct: 15, color: '#d97706' },
  ]

  const STATS = [
    {
      label: 'Revenue', value: `₦${totalRevenue.toLocaleString()}`,
      sub: `vs prev ${period}`, trend: '18.2%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      bg: '#fefce8', ic: '#c8a951',
    },
    {
      label: 'Orders', value: totalOrders.toLocaleString(),
      sub: `₦${avgOrder.toLocaleString()} avg order`, trend: '12.4%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      bg: '#eff6ff', ic: '#2563eb',
    },
    {
      label: 'Product Views', value: analytics.totalProductViews.toLocaleString(),
      sub: `${analytics.conversionRate}% conversion`, trend: '8.7%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
      bg: '#fdf4ff', ic: '#7c3aed',
    },
    {
      label: 'Avg Order Value', value: `₦${avgOrder.toLocaleString()}`,
      sub: 'per completed order', trend: '3.8%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
      bg: '#fff7ed', ic: '#d97706',
    },
  ]

  return (
    <div className="p-5 lg:p-7 max-w-[1200px] space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="admin-page-title">Analytics</p>
          <p className="text-sm text-[#9ca3af] mt-0.5">
            Performance data for {vendor?.storeName}
          </p>
        </div>
        <div className="flex gap-1 p-1 bg-white border border-[#e5e5e5] rounded-xl self-start shadow-sm">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                period === p ? 'bg-[#111111] text-white' : 'text-[#9ca3af] hover:text-[#111111]'
              }`}>
              {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4 stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Main Revenue area chart ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <p className="text-sm font-semibold text-[#111111]">Revenue Overview</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">Daily revenue for the selected period</p>
          </div>
          <div className="flex gap-5 shrink-0">
            {[
              { label: 'Total',     value: `₦${totalRevenue.toLocaleString()}`, color: '#111111' },
              { label: 'Avg/day',   value: `₦${slice.length ? Math.round(totalRevenue / slice.length).toLocaleString() : 0}`, color: '#c8a951' },
            ].map((m) => (
              <div key={m.label} className="text-right">
                <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-xs text-[#9ca3af]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c8a951" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#c8a951" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 3" stroke="#f0f0f0" vertical={false}/>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
            <YAxis tickFormatter={fmtNaira} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={46}/>
            <Tooltip {...TooltipStyle} formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Revenue']}/>
            <Area type="monotone" dataKey="Revenue" stroke="#c8a951" strokeWidth={2.5}
              fill="url(#revGrad)" dot={{ r: 3, fill: '#c8a951', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5 }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Orders line chart ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
        <SectionHeader
          title="Daily Orders"
          sub="Number of orders placed each day"
          right={<span className="text-xs font-bold text-[#2563eb]">{totalOrders} orders total</span>}
        />
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={revenueChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 3" stroke="#f0f0f0" vertical={false}/>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={28}/>
            <Tooltip {...TooltipStyle} formatter={(v: number) => [v, 'Orders']}/>
            <Line type="monotone" dataKey="Orders" stroke="#2563eb" strokeWidth={2.5}
              dot={{ r: 3, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Top products bar chart + order status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top products */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <SectionHeader
            title="Top Products by Revenue"
            sub="Best performing products this period"
            right={
              <Link href="/vendor/products" className="text-xs font-semibold text-[#c8a951] hover:underline">
                All products →
              </Link>
            }
          />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProductBarData} layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 3" stroke="#f0f0f0" horizontal={false}/>
              <XAxis type="number" tickFormatter={fmtNaira}
                tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
              <YAxis type="category" dataKey="name" width={110}
                tick={{ fontSize: 11, fill: '#6b6b6b' }} tickLine={false} axisLine={false}/>
              <Tooltip
                {...TooltipStyle}
                formatter={(v: number, name: string) =>
                  name === 'Revenue' ? [`₦${v.toLocaleString()}`, 'Revenue'] : [v, 'Units sold']
                }
                labelFormatter={(_l, payload) => payload?.[0]?.payload?.fullName ?? ''}
              />
              <Bar dataKey="Revenue" radius={[0, 6, 6, 0]}>
                {topProductBarData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#c8a951' : i === 1 ? '#d4b96a' : '#deca89'}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Product detail rows */}
          <div className="mt-4 pt-4 border-t border-[#f5f5f4] space-y-3">
            {analytics.topProducts.map((p, i) => {
              const product = products.find((pr) => pr.id === p.productId)
              return (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#9ca3af] w-4 shrink-0">#{i + 1}</span>
                  {product?.images?.[0] && (
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#f5f5f4] shrink-0">
                      <Image src={product.images[0].url} alt={p.name}
                        width={36} height={36} className="w-full h-full object-cover"/>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#111111] truncate">{p.name}</p>
                    <p className="text-xs text-[#9ca3af]">{p.unitsSold} units sold</p>
                  </div>
                  <p className="text-xs font-semibold text-[#111111] shrink-0">
                    ₦{p.revenue.toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <SectionHeader title="Order Status Breakdown" sub="Current status of all orders"/>

          {/* Stacked bar */}
          <div className="flex h-4 rounded-xl overflow-hidden gap-0.5 mb-5">
            {orderStatusData.map((d) => (
              <div key={d.label} className="h-full transition-all" title={d.label}
                style={{ width: `${(d.value / statusTotal) * 100}%`, backgroundColor: d.color }}/>
            ))}
          </div>

          <div className="space-y-3 mb-5">
            {orderStatusData.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}/>
                <span className="text-sm text-[#6b6b6b] flex-1">{d.label}</span>
                <span className="text-xs text-[#9ca3af] w-8 text-right">
                  {Math.round((d.value / statusTotal) * 100)}%
                </span>
                <span className="text-sm font-semibold text-[#111111] w-6 text-right">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Conversion funnel */}
          <div className="pt-4 border-t border-[#f5f5f4]">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">
              Conversion Funnel
            </p>
            <div className="space-y-2.5">
              {funnelData.map((f) => (
                <div key={f.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6b6b6b]">{f.label}</span>
                    <span className="font-semibold text-[#111111]">
                      {f.value.toLocaleString()}{' '}
                      <span className="text-[#9ca3af] font-normal">({f.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-[#f5f5f4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c8a951] rounded-full transition-all duration-500"
                      style={{ width: `${f.pct}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Traffic sources ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
        <SectionHeader title="Traffic Sources" sub="Where your store visitors come from"/>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {trafficData.map((t) => (
            <div key={t.source} className="text-center">
              {/* SVG ring */}
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f5f5f4" strokeWidth="3.5"/>
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke={t.color} strokeWidth="3.5"
                    strokeDasharray={`${t.pct} ${100 - t.pct}`} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#111111]">{t.pct}%</span>
                </div>
              </div>
              <p className="text-sm font-bold text-[#111111]">{t.visits.toLocaleString()}</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">{t.source}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Daily breakdown table ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
          <p className="text-sm font-semibold text-[#111111]">Daily Breakdown</p>
          <span className="text-xs text-[#9ca3af]">
            Most recent {Math.min(slice.length, 10)} days
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fafaf9] border-b border-[#e5e5e5]">
                {['Date', 'Revenue', 'Orders', 'Avg Order Value'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f4]">
              {[...slice].reverse().slice(0, 10).map((d) => {
                const aov = d.orders ? Math.round(d.revenue / d.orders) : 0
                return (
                  <tr key={d.date} className="hover:bg-[#fafaf9] transition-colors">
                    <td className="px-5 py-3 text-sm text-[#6b6b6b]">
                      {new Date(d.date).toLocaleDateString('en', {
                        weekday: 'short', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-[#111111]">
                      ₦{d.revenue.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-[#2563eb]">
                      {d.orders}
                    </td>
                    <td className="px-5 py-3 text-sm text-[#6b6b6b]">
                      ₦{aov.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-[#fafaf9] border-t border-[#e5e5e5]">
              <tr>
                <td className="px-5 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                  Period total
                </td>
                <td className="px-5 py-3 text-sm font-bold text-[#111111]">
                  ₦{totalRevenue.toLocaleString()}
                </td>
                <td className="px-5 py-3 text-sm font-bold text-[#2563eb]">
                  {totalOrders}
                </td>
                <td className="px-5 py-3 text-sm font-bold text-[#6b6b6b]">
                  ₦{avgOrder.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  )
}