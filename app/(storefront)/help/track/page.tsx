// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/help/track/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Container'

type TrackingEvent = { status: string; location: string; timestamp: string; done: boolean }

// Mock tracking result for demo
const MOCK_RESULT = {
  orderNumber: 'VDL-2025-001',
  status: 'Out for Delivery',
  estimatedDelivery: 'Today by 6:00 PM',
  carrier: 'GIG Logistics',
  trackingNumber: 'GIG-2025-88421',
  events: [
    { status: 'Out for delivery',       location: 'Victoria Island, Lagos',  timestamp: 'Today, 10:15 AM',       done: true },
    { status: 'Arrived at sorting hub', location: 'Lekki Hub, Lagos',        timestamp: 'Today, 7:30 AM',        done: true },
    { status: 'In transit',             location: 'GIG Lagos Central',       timestamp: 'Yesterday, 4:00 PM',    done: true },
    { status: 'Picked up by courier',   location: 'Vendor warehouse, Yaba',  timestamp: 'Yesterday, 11:20 AM',   done: true },
    { status: 'Order dispatched',       location: 'Vendor — Craft & Co.',    timestamp: 'Yesterday, 10:00 AM',   done: true },
    { status: 'Order confirmed',        location: 'Vendorly Platform',       timestamp: '2 days ago, 3:45 PM',   done: true },
  ] as TrackingEvent[],
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email,       setEmail]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState<typeof MOCK_RESULT | null>(null)
  const [error,       setError]       = useState('')

  const handleTrack = async () => {
    if (!orderNumber.trim()) { setError('Please enter your order number.'); return }
    if (!email.trim())       { setError('Please enter your email address.'); return }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    // Show mock result for any input
    setResult(MOCK_RESULT)
  }

  const STATUS_COLOR: Record<string, string> = {
    'Out for Delivery': 'text-[#7c3aed]',
    'Delivered':        'text-[#16a34a]',
    'In Transit':       'text-[#2563eb]',
    'Processing':       'text-[#d97706]',
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help/faq' }, { label: 'Track Order' }]} className="mb-8 max-w-2xl mx-auto" />

      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c8a951] mb-2">Help Centre</p>
        <h1 className="font-serif text-4xl font-bold text-[#111111] mb-3">Track Your Order</h1>
        <p className="text-[#6b6b6b]">Enter your order number and email to see real-time delivery updates.</p>
      </div>

      <div className="max-w-2xl mx-auto">

        {/* Tracking form */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 mb-6">
          <div className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fee2e2] border border-[#fecaca] rounded-xl text-sm text-[#dc2626]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Order Number</label>
                <input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  placeholder="e.g. VDL-2025-001"
                  className="px-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  placeholder="you@example.com"
                  className="px-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
                />
              </div>
            </div>
            <button
              onClick={handleTrack}
              disabled={loading}
              className="w-full py-3 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-[#2a2a2a] disabled:opacity-60 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/><path d="M21 12a9 9 0 00-9-9"/>
                </svg>
              )}
              {loading ? 'Tracking…' : 'Track Order'}
            </button>
          </div>
          <p className="text-xs text-[#9ca3af] mt-3 text-center">
            Your order number is in your confirmation email.{' '}
            <Link href="/account?tab=orders" className="text-[#c8a951] hover:underline">Sign in</Link> to track without it.
          </p>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Status summary */}
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Order</p>
                  <p className="font-semibold text-[#111111]">{result.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${STATUS_COLOR[result.status] ?? 'text-[#111111]'}`}>{result.status}</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">Est. {result.estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#fafaf9] rounded-xl border border-[#e5e5e5]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l3 5v3h-8V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <div>
                  <p className="text-xs text-[#9ca3af]">{result.carrier}</p>
                  <p className="text-sm font-mono font-semibold text-[#111111]">{result.trackingNumber}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
              <h2 className="font-semibold text-[#111111] mb-4">Tracking History</h2>
              <div className="relative pl-5">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#e5e5e5]" />
                {result.events.map((event, i) => (
                  <div key={i} className="relative flex gap-3 mb-4 last:mb-0">
                    <div className={`absolute -left-5 w-3.5 h-3.5 rounded-full border-2 border-white shrink-0 mt-0.5 ${i === 0 ? 'bg-[#7c3aed]' : 'bg-[#d1d5db]'}`} />
                    <div>
                      <p className="text-sm font-medium text-[#111111]">{event.status}</p>
                      <p className="text-xs text-[#9ca3af]">{event.location}</p>
                      <p className="text-xs text-[#9ca3af]">{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-[#9ca3af]">
              Need help?{' '}
              <Link href="/contact" className="text-[#c8a951] hover:underline font-medium">Contact support</Link>
            </p>
          </div>
        )}

        {/* Footer links */}
        <div className="border-t border-[#e5e5e5] pt-6 mt-8 flex flex-wrap gap-4 text-sm text-[#9ca3af] justify-center">
          <Link href="/help/faq" className="hover:text-[#c8a951] transition-colors">FAQ</Link>
          <span>·</span>
          <Link href="/help/shipping" className="hover:text-[#c8a951] transition-colors">Shipping Policy</Link>
          <span>·</span>
          <Link href="/help/returns" className="hover:text-[#c8a951] transition-colors">Returns</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-[#c8a951] transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
