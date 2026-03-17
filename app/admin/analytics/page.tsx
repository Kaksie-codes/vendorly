// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/analytics/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { mockAdminAnalytics, getVendorById } from '@/lib/mock-data'

type Period = '7d' | '30d' | '90d'

// ── Shared tooltip style ──────────────────────────────────────────────────────
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

// ── Formatters ────────────────────────────────────────────────────────────────
const fmtNaira = (v: number) =>
  v >= 1_000_000 ? `₦${(v / 1_000_000).toFixed(1)}M`
  : v >= 1000    ? `₦${(v / 1000).toFixed(0)}k`
  : `₦${v}`

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
      <p className="text-[1.65rem] font-bold text-[#111111] leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
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
function SectionHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
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

// ── HBar ──────────────────────────────────────────────────────────────────────
function HBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-2 bg-[#f5f5f4] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.max((value / max) * 100, 2)}%`, backgroundColor: color }} />
    </div>
  )
}

const CAT_COLORS = ['#ef4444', '#2563eb', '#f59e0b', '#16a34a', '#7c3aed']
const VEN_COLORS = ['#ef4444', '#2563eb', '#f59e0b', '#16a34a']

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const a = mockAdminAnalytics

  const days  = period === '7d' ? 7 : period === '30d' ? 30 : a.revenueByDay.length
  const slice = a.revenueByDay.slice(-Math.min(days, a.revenueByDay.length))

  const periodRevenue = slice.reduce((s, d) => s + d.revenue, 0)
  const periodOrders  = slice.reduce((s, d) => s + d.orders,  0)
  const periodFees    = Math.round(periodRevenue * 0.1)
  const avgDailyRev   = slice.length ? Math.round(periodRevenue / slice.length) : 0
  const avgOrderValue = periodOrders ? Math.round(periodRevenue / periodOrders) : 0

  // Chart data
  const chartData = slice.map((d) => ({
    date:    fmtDate(d.date),
    Revenue: d.revenue,
    Orders:  d.orders,
    Fees:    Math.round(d.revenue * 0.1),
    Users:   0, // will override below
  }))

  const userGrowthData = slice.map((d, i) => ({
    date:  fmtDate(d.date),
    Users: Math.round(a.totalUsers - a.newUsers + (a.newUsers / slice.length) * (i + 1)),
  }))

  const catTotal     = a.topCategories.reduce((s, c) => s + c.revenue, 0)
  const vendorMaxRev = a.topVendors.filter((v) => v.revenue > 0)[0]?.revenue ?? 1
  const topVendorShare = Math.round(
    (a.topVendors.filter((v) => v.revenue > 0).reduce((s, v) => s + v.revenue, 0) / periodRevenue) * 100
  )

  const catBarData = a.topCategories.map((c) => ({
    name:    c.name.replace(' & ', ' &\n'),
    Revenue: c.revenue,
    Orders:  c.orders,
  }))

  const STATS = [
    {
      label: 'Gross Merchandise Value', value: `₦${periodRevenue.toLocaleString()}`,
      sub: `vs prev ${period}`, trend: '18.2%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      bg: '#fef2f2', ic: '#ef4444',
    },
    {
      label: 'Platform Fees Earned', value: `₦${periodFees.toLocaleString()}`,
      sub: '10% of GMV', trend: '18.2%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
      bg: '#fff7ed', ic: '#d97706',
    },
    {
      label: 'Total Orders', value: periodOrders.toLocaleString(),
      sub: `₦${avgOrderValue.toLocaleString()} avg order`, trend: '12.4%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      bg: '#eff6ff', ic: '#2563eb',
    },
    {
      label: 'Registered Users', value: a.totalUsers.toLocaleString(),
      sub: `+${a.newUsers} new this period`, trend: '8.7%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
      bg: '#f0fdf4', ic: '#16a34a',
    },
    {
      label: 'Active Vendors', value: a.totalVendors,
      sub: `+${a.newVendors} onboarded`, trend: '10.4%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      bg: '#fdf4ff', ic: '#7c3aed',
    },
    {
      label: 'Active Products', value: a.activeProducts.toLocaleString(),
      sub: 'across all stores', trend: '5.3%', positive: true,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
      bg: '#ecfdf5', ic: '#059669',
    },
  ]

  return (
    <div className="p-5 lg:p-7 max-w-[1400px] space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="admin-page-title">Platform Analytics</p>
          <p className="text-sm text-[#9ca3af] mt-0.5">Revenue, growth and performance across Vendorly</p>
        </div>
        <div className="flex gap-1 p-1 bg-white border border-[#e5e5e5] rounded-xl self-start shadow-sm">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                period === p ? 'bg-[#0f0f0f] text-white' : 'text-[#9ca3af] hover:text-[#111111]'
              }`}>
              {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat cards: 2 cols on mobile, 3 on md, 3 on lg  ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Main GMV area chart ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <p className="text-sm font-semibold text-[#111111]">Gross Merchandise Value</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">Daily GMV across all vendors</p>
          </div>
          <div className="flex gap-6 shrink-0">
            {[
              { label: 'Total GMV',    value: `₦${periodRevenue.toLocaleString()}`, color: '#111111' },
              { label: 'Daily avg',    value: `₦${avgDailyRev.toLocaleString()}`,   color: '#111111' },
              { label: 'Fees earned',  value: `₦${periodFees.toLocaleString()}`,    color: '#d97706' },
            ].map((m) => (
              <div key={m.label} className="text-right">
                <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-xs text-[#9ca3af]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 3" stroke="#f0f0f0" vertical={false}/>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
            <YAxis tickFormatter={fmtNaira} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={48}/>
            <Tooltip
              {...TooltipStyle}
              formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="Revenue" stroke="#ef4444" strokeWidth={2.5}
              fill="url(#gmvGrad)" dot={{ r: 3, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5 }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Orders + Fees ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <SectionHeader
            title="Daily Orders"
            sub="Orders placed per day across the platform"
            right={<span className="text-xs font-bold text-[#2563eb]">{periodOrders.toLocaleString()} total</span>}
          />
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 3" stroke="#f0f0f0" vertical={false}/>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={28}/>
              <Tooltip {...TooltipStyle} formatter={(v: number) => [v, 'Orders']}/>
              <Area type="monotone" dataKey="Orders" stroke="#2563eb" strokeWidth={2.5}
                fill="url(#ordersGrad)" dot={{ r: 3, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <SectionHeader
            title="Platform Fees"
            sub="10% of daily GMV earned by Vendorly"
            right={<span className="text-xs font-bold text-[#d97706]">₦{periodFees.toLocaleString()} total</span>}
          />
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="feesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d97706" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 3" stroke="#f0f0f0" vertical={false}/>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
              <YAxis tickFormatter={fmtNaira} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={40}/>
              <Tooltip {...TooltipStyle} formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Fees']}/>
              <Area type="monotone" dataKey="Fees" stroke="#d97706" strokeWidth={2.5}
                fill="url(#feesGrad)" dot={{ r: 3, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── User growth line chart ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-[#111111]">User Growth</p>
          <div className="flex items-center gap-5 text-xs">
            <span className="text-[#9ca3af]">Total: <strong className="text-[#111111]">{a.totalUsers.toLocaleString()}</strong></span>
            <span className="text-[#9ca3af]">New this period: <strong className="text-[#16a34a]">+{a.newUsers}</strong></span>
          </div>
        </div>
        <p className="text-xs text-[#9ca3af] mb-4">Cumulative registered users over the selected period</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={userGrowthData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 3" stroke="#f0f0f0" vertical={false}/>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
            <YAxis tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : String(v)}
              tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={40}/>
            <Tooltip {...TooltipStyle} formatter={(v: number) => [v.toLocaleString(), 'Users']}/>
            <Line type="monotone" dataKey="Users" stroke="#16a34a" strokeWidth={2.5}
              dot={{ r: 3, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Category bar chart (full width) ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
        <SectionHeader
          title="Revenue by Category"
          sub="GMV and order volume broken down by product category"
        />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={catBarData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }} barGap={4}>
            <CartesianGrid strokeDasharray="4 3" stroke="#f0f0f0" vertical={false}/>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b6b6b' }} tickLine={false} axisLine={false}/>
            <YAxis tickFormatter={fmtNaira} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={46}/>
            <Tooltip
              {...TooltipStyle}
              formatter={(v: number, name: string) =>
                name === 'Revenue' ? [`₦${v.toLocaleString()}`, 'Revenue'] : [v, 'Orders']
              }
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }}/>
            <Bar dataKey="Revenue" radius={[6, 6, 0, 0]}>
              {catBarData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Category legend rows */}
        <div className="mt-4 pt-4 border-t border-[#f5f5f4] space-y-2.5">
          {a.topCategories.map((c, i) => {
            const pct = Math.round((c.revenue / catTotal) * 100)
            return (
              <div key={c.categoryId} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CAT_COLORS[i] }}/>
                <span className="text-sm text-[#6b6b6b] flex-1">{c.name}</span>
                <span className="text-xs text-[#9ca3af] w-16 text-right">{c.orders} orders</span>
                <span className="text-xs font-semibold text-[#9ca3af] w-8 text-right">{pct}%</span>
                <span className="text-sm font-semibold text-[#111111] w-16 text-right">₦{(c.revenue/1000).toFixed(0)}k</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Top vendors + Platform health ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top vendors */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <SectionHeader
            title="Top Vendors by GMV"
            sub="Revenue contribution per vendor"
            right={
              <Link href="/admin/vendors" className="text-xs font-semibold text-[#ef4444] hover:underline">
                View all →
              </Link>
            }
          />
          <div className="space-y-4">
            {a.topVendors.filter((v) => v.revenue > 0).map((v, i) => (
              <div key={v.vendorId}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-[#9ca3af] w-5 shrink-0">#{i + 1}</span>
                    <Link href={`/admin/vendors/${v.vendorId}`}
                      className="text-sm font-medium text-[#111111] hover:text-[#ef4444] transition-colors truncate">
                      {v.storeName}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-xs text-[#9ca3af]">{v.orders} orders</span>
                    <span className="text-sm font-semibold text-[#111111]">₦{v.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <HBar value={v.revenue} max={vendorMaxRev} color={VEN_COLORS[i] ?? '#9ca3af'}/>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#f5f5f4] flex justify-between text-xs text-[#9ca3af]">
            <span>{a.totalVendors} total vendors</span>
            <span>Top vendors = {topVendorShare}% of GMV</span>
          </div>
        </div>

        {/* Platform health */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <SectionHeader title="Platform Health" sub="Key operational metrics for the selected period"/>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Active Products',   value: a.activeProducts.toLocaleString(), sub: 'listed across all stores', color: '#111111', bg: '#f5f5f4' },
              { label: 'Avg Vendor GMV',    value: `₦${Math.round(periodRevenue / a.totalVendors).toLocaleString()}`, sub: `per vendor · ${period}`, color: '#ef4444', bg: '#fef2f2' },
              { label: 'Platform Fee Rate', value: '10%',                              sub: 'of all transactions',      color: '#2563eb', bg: '#eff6ff' },
              { label: 'Avg Daily Revenue', value: `₦${avgDailyRev.toLocaleString()}`, sub: `over ${slice.length} days`, color: '#16a34a', bg: '#f0fdf4' },
              { label: 'Avg Order Value',   value: `₦${avgOrderValue.toLocaleString()}`, sub: 'per completed order',   color: '#d97706', bg: '#fff7ed' },
              { label: 'New Vendors',       value: `+${a.newVendors}`,                sub: `onboarded this ${period}`, color: '#7c3aed', bg: '#fdf4ff' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: s.bg }}>
                <p className="text-xl font-bold mb-1" style={{ color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                <p className="text-xs font-semibold text-[#111111] leading-tight">{s.label}</p>
                <p className="text-xs text-[#9ca3af] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Daily breakdown table ── */}
      <div className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
          <p className="text-sm font-semibold text-[#111111]">Daily Breakdown</p>
          <span className="text-xs text-[#9ca3af]">Most recent {Math.min(slice.length, 10)} days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fafaf9] border-b border-[#e5e5e5]">
                {['Date', 'Revenue', 'Fees (10%)', 'Orders', 'Avg Order Value'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f4]">
              {[...slice].reverse().slice(0, 10).map((d) => {
                const fees = Math.round(d.revenue * 0.1)
                const aov  = d.orders ? Math.round(d.revenue / d.orders) : 0
                return (
                  <tr key={d.date} className="hover:bg-[#fafaf9] transition-colors">
                    <td className="px-5 py-3 text-sm text-[#6b6b6b]">
                      {new Date(d.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-[#111111]">₦{d.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm font-medium text-[#d97706]">₦{fees.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm font-medium text-[#2563eb]">{d.orders}</td>
                    <td className="px-5 py-3 text-sm text-[#6b6b6b]">₦{aov.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-[#fafaf9] border-t border-[#e5e5e5]">
              <tr>
                <td className="px-5 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Period total</td>
                <td className="px-5 py-3 text-sm font-bold text-[#111111]">₦{periodRevenue.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-[#d97706]">₦{periodFees.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-[#2563eb]">{periodOrders.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-bold text-[#6b6b6b]">₦{avgOrderValue.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  )
}