// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/payouts/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import { mockPayouts, getVendorById } from '@/lib/mock-data'
import { AdminChart } from '@/components/admin/AdminChart'
import { mockAdminAnalytics } from '@/lib/mock-data'
import type { Payout, PayoutStatus } from '@/types'

const STATUS_STYLES: Record<PayoutStatus, { pill: string; dot: string }> = {
  pending:    { pill: 'bg-[#fef3c7] text-[#d97706]', dot: 'bg-[#fbbf24]' },
  processing: { pill: 'bg-[#dbeafe] text-[#2563eb]', dot: 'bg-[#60a5fa]' },
  completed:  { pill: 'bg-[#dcfce7] text-[#16a34a]', dot: 'bg-[#4ade80]' },
  failed:     { pill: 'bg-[#fee2e2] text-[#dc2626]', dot: 'bg-[#f87171]' },
}

export default function AdminPayoutsPage() {
  const [tab,      setTab]      = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all')
  const [search,   setSearch]   = useState('')
  const [statuses, setStatuses] = useState<Record<string, PayoutStatus>>(
    Object.fromEntries(mockPayouts.map((p) => [p.id, p.status]))
  )

  const approve = (id: string) => setStatuses((s) => ({ ...s, [id]: 'processing' }))
  const complete = (id: string) => setStatuses((s) => ({ ...s, [id]: 'completed' }))
  const fail    = (id: string) => setStatuses((s) => ({ ...s, [id]: 'failed' }))
  const retry   = (id: string) => setStatuses((s) => ({ ...s, [id]: 'pending' }))

  const TABS = [
    { id: 'all' as const,        label: 'All',        count: mockPayouts.length },
    { id: 'pending' as const,    label: 'Pending',    count: mockPayouts.filter((p) => statuses[p.id] === 'pending').length },
    { id: 'processing' as const, label: 'Processing', count: mockPayouts.filter((p) => statuses[p.id] === 'processing').length },
    { id: 'completed' as const,  label: 'Completed',  count: mockPayouts.filter((p) => statuses[p.id] === 'completed').length },
    { id: 'failed' as const,     label: 'Failed',     count: mockPayouts.filter((p) => statuses[p.id] === 'failed').length },
  ].filter((t) => t.id === 'all' || t.count > 0)

  const filtered = useMemo(() => {
    return mockPayouts.filter((p) => {
      if (tab !== 'all' && statuses[p.id] !== tab) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const v = getVendorById(p.vendorId)
        if (!p.reference.toLowerCase().includes(q) && !(v?.storeName.toLowerCase().includes(q))) return false
      }
      return true
    })
  }, [statuses, tab, search])

  const totalPaid       = mockPayouts.filter((p) => statuses[p.id] === 'completed').reduce((s, p) => s + p.amount, 0)
  const totalProcessing = mockPayouts.filter((p) => statuses[p.id] === 'processing').reduce((s, p) => s + p.amount, 0)
  const totalPending    = mockPayouts.filter((p) => statuses[p.id] === 'pending').reduce((s, p) => s + p.amount, 0)
  const platformFees    = mockAdminAnalytics.platformFees

  // Sparkline-style data for fees
  const feeData = mockAdminAnalytics.revenueByDay.slice(-14).map((d) => ({
    date: d.date,
    revenue: Math.round(d.revenue * 0.1),
    orders: d.orders,
  }))

  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-[1.75rem] font-bold text-[#111111]">Payouts</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">Manage vendor payout disbursements</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Process All Pending
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Paid Out',  value: `₦${(totalPaid / 1000).toFixed(1)}k`,       bg: 'bg-white',        val: 'text-[#111111]' },
          { label: 'Processing',      value: `₦${(totalProcessing / 1000).toFixed(1)}k`,  bg: 'bg-white',        val: 'text-[#2563eb]' },
          { label: 'Awaiting Payout', value: `₦${(totalPending / 1000).toFixed(1)}k`,     bg: 'bg-white',        val: 'text-[#d97706]' },
          { label: 'Platform Fees',   value: `₦${(platformFees / 1000).toFixed(1)}k`,     bg: 'bg-[#0f0f0f]',    val: 'text-[#ef4444]' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-[#e5e5e5] px-5 py-4 ${s.bg}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${s.bg === 'bg-[#0f0f0f]' ? 'text-white/40' : 'text-[#9ca3af]'}`}>{s.label}</p>
            <p className={`font-serif text-2xl font-bold mt-1 ${s.val}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Fee sparkline */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 mb-7">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-[#111111]">Platform Fee Revenue</h2>
            <p className="text-xs text-[#9ca3af] mt-0.5">Last 14 days · 10% of GMV</p>
          </div>
          <p className="font-serif text-xl font-bold text-[#ef4444]">₦{feeData.reduce((s, d) => s + d.revenue, 0).toLocaleString()}</p>
        </div>
        <AdminChart data={feeData} height={140} />
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

      {/* Search */}
      <div className="relative max-w-sm mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by reference or vendor…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#e5e5e5] overflow-hidden">
        <div className="grid bg-[#fafaf9] border-b border-[#e5e5e5] px-5 py-3"
          style={{ gridTemplateColumns: '1fr 160px 80px 100px 120px' }}>
          {['Reference / Vendor', 'Period', 'Orders', 'Status', 'Amount / Actions'].map((h) => (
            <span key={h} className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af]">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-[#f5f5f4] bg-white">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <span className="text-3xl">💸</span>
              <p className="font-semibold text-[#111111]">No payouts found</p>
              <button onClick={() => { setSearch(''); setTab('all') }} className="text-sm text-[#ef4444] underline">Clear filters</button>
            </div>
          ) : (
            filtered.map((payout) => (
              <AdminPayoutRow
                key={payout.id}
                payout={payout}
                status={statuses[payout.id]}
                vendorName={getVendorById(payout.vendorId)?.storeName ?? payout.vendorId}
                onApprove={() => approve(payout.id)}
                onComplete={() => complete(payout.id)}
                onFail={() => fail(payout.id)}
                onRetry={() => retry(payout.id)}
              />
            ))
          )}
        </div>
      </div>
      <p className="text-sm text-[#9ca3af] mt-4">Showing {filtered.length} of {mockPayouts.length} payouts</p>
    </div>
  )
}

function AdminPayoutRow({ payout, status, vendorName, onApprove, onComplete, onFail, onRetry }: {
  payout: Payout; status: PayoutStatus; vendorName: string
  onApprove: () => void; onComplete: () => void; onFail: () => void; onRetry: () => void
}) {
  const s = STATUS_STYLES[status]

  return (
    <div className="grid items-center px-5 py-4 hover:bg-[#fafaf9] transition-colors"
      style={{ gridTemplateColumns: '1fr 160px 80px 100px 120px' }}>

      {/* Reference + vendor */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#111111] font-mono truncate">{payout.reference}</p>
          <p className="text-xs text-[#9ca3af] truncate">{vendorName} · {payout.method}</p>
        </div>
      </div>

      {/* Period */}
      <p className="text-xs text-[#6b6b6b]">
        {new Date(payout.period.from).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })} –{' '}
        {new Date(payout.period.to).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
      </p>

      {/* Orders */}
      <p className="text-sm text-[#6b6b6b]">{payout.ordersCount}</p>

      {/* Status */}
      <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full capitalize w-fit ${s.pill}`}>
        {status}
      </span>

      {/* Amount + actions */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-[#111111]">₦{payout.amount.toLocaleString()}</p>
        <div className="flex gap-1.5 flex-wrap">
          {status === 'pending' && (
            <button onClick={onApprove} className="px-2.5 py-1 text-[0.65rem] font-semibold bg-[#111111] text-white rounded-lg hover:bg-[#333] transition-colors">
              Process
            </button>
          )}
          {status === 'processing' && (
            <>
              <button onClick={onComplete} className="px-2.5 py-1 text-[0.65rem] font-semibold bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors">
                Mark Paid
              </button>
              <button onClick={onFail} className="px-2.5 py-1 text-[0.65rem] font-semibold bg-[#fee2e2] text-[#dc2626] rounded-lg hover:bg-[#fecaca] transition-colors">
                Fail
              </button>
            </>
          )}
          {status === 'failed' && (
            <button onClick={onRetry} className="px-2.5 py-1 text-[0.65rem] font-semibold bg-[#dbeafe] text-[#2563eb] rounded-lg hover:bg-[#bfdbfe] transition-colors">
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}