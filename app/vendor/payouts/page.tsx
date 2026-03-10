// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/payouts/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import { getPayoutsByVendor, mockVendorAnalytics } from '@/lib/mock-data'
import type { Payout } from '@/types'

const VENDOR_ID = 'vendor-1'

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  pending:    { pill: 'bg-[#fef3c7] text-[#d97706]', dot: 'bg-[#fbbf24]' },
  processing: { pill: 'bg-[#dbeafe] text-[#2563eb]', dot: 'bg-[#60a5fa]' },
  completed:  { pill: 'bg-[#dcfce7] text-[#16a34a]', dot: 'bg-[#4ade80]' },
  failed:     { pill: 'bg-[#fee2e2] text-[#dc2626]', dot: 'bg-[#f87171]' },
}

export default function VendorPayoutsPage() {
  const payouts   = getPayoutsByVendor(VENDOR_ID)
  const analytics = mockVendorAnalytics[VENDOR_ID]
  const [tab, setTab] = useState<'history' | 'methods'>('history')

  const completed    = payouts.filter((p) => p.status === 'completed')
  const processing   = payouts.filter((p) => p.status === 'processing' || p.status === 'pending')
  const totalPaid    = completed.reduce((s, p) => s + p.amount, 0)
  const totalPending = processing.reduce((s, p) => s + p.amount, 0)
  const totalOrders  = completed.reduce((s, p) => s + p.ordersCount, 0)
  const nextAmount   = Math.round((analytics?.totalRevenue ?? 0) * 0.88)
  const nextDate     = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-6 lg:p-8 max-w-[1000px]">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="font-serif text-[1.75rem] font-bold text-[#111111] leading-tight">Payouts</h1>
        <p className="text-sm text-[#9ca3af] mt-0.5">Track your earnings and payment history</p>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">

        {/* Total paid out */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Total Paid Out</p>
            <div className="w-8 h-8 rounded-xl bg-[#dcfce7] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#111111]">₦{totalPaid.toLocaleString()}</p>
          <p className="text-xs text-[#9ca3af] mt-1">{completed.length} payouts · {totalOrders} orders</p>
        </div>

        {/* Processing / pending */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Processing</p>
            <div className="w-8 h-8 rounded-xl bg-[#fef3c7] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#111111]">₦{totalPending.toLocaleString()}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Clears in 3–5 business days</p>
        </div>

        {/* Next payout — dark */}
        <div className="bg-[#111111] rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Next Payout</p>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#c8a951]">₦{nextAmount.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-1 mb-3">{nextDate}</p>
          <button className="mt-auto w-full py-2 text-xs font-semibold bg-[#c8a951] text-white rounded-xl hover:bg-[#a8892f] transition-colors active:scale-[0.98]">
            Request Early Payout
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-[#e5e5e5] mb-6">
        {(['history', 'methods'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-5 py-2.5 text-sm font-medium relative transition-colors',
              tab === t
                ? 'text-[#111111] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c8a951]'
                : 'text-[#9ca3af] hover:text-[#6b6b6b]',
            ].join(' ')}
          >
            {t === 'history' ? 'Payout History' : 'Payment Methods'}
          </button>
        ))}
      </div>

      {/* ── History tab ── */}
      {tab === 'history' && (
        <div className="rounded-2xl border border-[#e5e5e5] overflow-hidden">
          {/* Table head */}
          <div className="grid bg-[#fafaf9] border-b border-[#e5e5e5] px-5 py-3"
            style={{ gridTemplateColumns: '1fr 80px 100px 110px' }}>
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af]">Reference / Period</span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] text-center hidden sm:block">Orders</span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] text-center">Status</span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af] text-right">Amount</span>
          </div>
          <div className="divide-y divide-[#f5f5f4] bg-white">
            {payouts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <span className="text-3xl">💸</span>
                <p className="font-semibold text-[#111111]">No payouts yet</p>
                <p className="text-sm text-[#9ca3af]">Your first payout will appear once processed.</p>
              </div>
            ) : (
              payouts.map((p) => <PayoutRow key={p.id} payout={p} />)
            )}
          </div>
        </div>
      )}

      {/* ── Methods tab ── */}
      {tab === 'methods' && (
        <div className="flex flex-col gap-4">
          {/* Saved methods */}
          <div className="flex flex-col gap-3">
            {[
              { icon: '🏦', name: 'First Bank of Nigeria', sub: 'Account •••• 4521 · NGN', default: true },
              { icon: '📱', name: 'Opay Wallet',           sub: '+234 801 234 5678',         default: false },
            ].map((method) => (
              <div key={method.name} className={`flex items-center gap-4 p-4 bg-white rounded-2xl border-2 transition-colors ${method.default ? 'border-[#c8a951]' : 'border-[#e5e5e5]'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${method.default ? 'bg-[#f7f1e3]' : 'bg-[#f5f5f4]'}`}>
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111111]">{method.name}</p>
                  <p className="text-xs text-[#9ca3af]">{method.sub}</p>
                </div>
                {method.default
                  ? <span className="text-xs font-semibold bg-[#dcfce7] text-[#16a34a] px-2.5 py-1 rounded-full shrink-0">Default</span>
                  : <button className="text-xs font-semibold text-[#c8a951] hover:underline shrink-0">Set Default</button>
                }
              </div>
            ))}
          </div>

          <button className="flex items-center gap-2.5 px-4 py-3 border-2 border-dashed border-[#e5e5e5] rounded-2xl text-sm font-medium text-[#9ca3af] hover:border-[#c8a951] hover:text-[#c8a951] hover:bg-[#f7f1e3] transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Payment Method
          </button>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 mt-1">
            <h3 className="font-semibold text-[#111111] mb-4 pb-3 border-b border-[#f5f5f4]">Payout Schedule</h3>
            <div className="flex flex-col gap-4">
              {[
                { id: 'weekly',    label: 'Weekly',    sub: 'Every Monday',         active: true  },
                { id: 'biweekly', label: 'Bi-weekly', sub: 'Every other Monday',    active: false },
                { id: 'monthly',  label: 'Monthly',   sub: '1st of each month',     active: false },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${opt.active ? 'border-[#c8a951]' : 'border-[#d1d5db] group-hover:border-[#c8a951]'}`}>
                    {opt.active && <div className="w-2 h-2 rounded-full bg-[#c8a951]" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{opt.label}</p>
                    <p className="text-xs text-[#9ca3af]">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Payout row ───────────────────────────────────────────────────────────────

function PayoutRow({ payout }: { payout: Payout }) {
  const s = STATUS_STYLES[payout.status] ?? STATUS_STYLES.pending
  return (
    <div className="grid items-center px-5 py-4 hover:bg-[#fafaf9] transition-colors"
      style={{ gridTemplateColumns: '1fr 80px 100px 110px' }}>

      {/* Reference + period */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#111111] font-mono truncate">{payout.reference}</p>
          <p className="text-xs text-[#9ca3af]">
            {new Date(payout.period.from).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
            {' – '}
            {new Date(payout.period.to).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
            {payout.processedAt && (
              <> · paid {new Date(payout.processedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</>
            )}
          </p>
        </div>
      </div>

      {/* Orders */}
      <p className="text-sm text-[#6b6b6b] text-center hidden sm:block">{payout.ordersCount}</p>

      {/* Status */}
      <div className="flex justify-center">
        <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full capitalize ${s.pill}`}>
          {payout.status}
        </span>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p className="text-sm font-semibold text-[#111111]">₦{payout.amount.toLocaleString()}</p>
        <p className="text-xs text-[#9ca3af]">{payout.method}</p>
      </div>
    </div>
  )
}