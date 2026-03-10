// -----------------------------------------------------------------------------
// File: AdminVendorActions.tsx
// Path: components/admin/AdminVendorActions.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Vendor } from '@/types'

export function AdminVendorActions({ vendor }: { vendor: Vendor }) {
  const router = useRouter()
  const [status, setStatus] = useState(vendor.status)
  const [loading, setLoading] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [showModal, setShowModal] = useState<'suspend' | 'reject' | null>(null)

  const act = async (action: string, newStatus: typeof status) => {
    setLoading(action)
    await new Promise((r) => setTimeout(r, 700))
    setStatus(newStatus)
    setLoading(null)
    setShowModal(null)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {status === 'pending' && (
          <>
            <button
              onClick={() => act('approve', 'active')}
              disabled={!!loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-sm font-semibold rounded-xl hover:bg-[#15803d] disabled:opacity-60 transition-colors"
            >
              {loading === 'approve' && <Spinner />}
              ✓ Approve Vendor
            </button>
            <button
              onClick={() => setShowModal('reject')}
              className="px-4 py-2 bg-[#fee2e2] text-[#dc2626] text-sm font-semibold rounded-xl hover:bg-[#fecaca] transition-colors"
            >
              Reject
            </button>
          </>
        )}

        {status === 'active' && (
          <>
            <a
              href={`/vendors/${vendor.storeSlug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 border border-[#e5e5e5] text-[#6b6b6b] text-sm font-medium rounded-xl hover:bg-[#f5f5f4] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Store
            </a>
            <button
              onClick={() => setShowModal('suspend')}
              className="px-4 py-2 border border-[#fecaca] text-[#dc2626] text-sm font-medium rounded-xl hover:bg-[#fee2e2] transition-colors"
            >
              Suspend
            </button>
          </>
        )}

        {status === 'suspended' && (
          <>
            <span className="px-3 py-2 text-sm font-semibold text-[#dc2626] bg-[#fee2e2] rounded-xl">Suspended</span>
            <button
              onClick={() => act('reactivate', 'active')}
              disabled={!!loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1d4ed8] disabled:opacity-60 transition-colors"
            >
              {loading === 'reactivate' && <Spinner />}
              Reactivate
            </button>
          </>
        )}

        {status === 'rejected' && (
          <span className="px-3 py-2 text-sm font-semibold text-[#6b6b6b] bg-[#f5f5f4] rounded-xl">Rejected</span>
        )}
      </div>

      {/* Suspend / Reject modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-[#111111] mb-2">
              {showModal === 'suspend' ? 'Suspend Vendor' : 'Reject Application'}
            </h2>
            <p className="text-sm text-[#6b6b6b] mb-4">
              {showModal === 'suspend'
                ? `Suspending ${vendor.storeName} will hide their store and prevent new orders.`
                : `Rejecting ${vendor.storeName}'s application will notify them by email.`}
            </p>
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
                Reason <span className="text-[#9ca3af] font-normal">(sent to vendor)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Explain why…"
                className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#ef4444] transition bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowModal(null)} className="flex-1 py-2.5 border border-[#e5e5e5] text-[#6b6b6b] text-sm font-medium rounded-xl hover:bg-[#fafaf9] transition-colors">
                Cancel
              </button>
              <button
                onClick={() => act(showModal, showModal === 'suspend' ? 'suspended' : 'rejected')}
                disabled={!!loading}
                className="flex-1 py-2.5 bg-[#dc2626] text-white text-sm font-semibold rounded-xl hover:bg-[#b91c1c] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Spinner />}
                {showModal === 'suspend' ? 'Suspend' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/>
    </svg>
  )
}