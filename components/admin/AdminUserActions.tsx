// -----------------------------------------------------------------------------
// File: AdminUserActions.tsx
// Path: components/admin/AdminUserActions.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import type { User } from '@/types'

export function AdminUserActions({ user }: { user: User }) {
  const [status,  setStatus]  = useState(user.status)
  const [loading, setLoading] = useState(false)

  const act = async (next: typeof status) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setStatus(next)
    setLoading(false)
  }

  if (user.role === 'admin') return null

  return (
    <div className="flex flex-wrap gap-2">
      {status === 'active' && (
        <button onClick={() => act('suspended')} disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#dc2626] border border-[#fecaca] rounded-xl hover:bg-[#fee2e2] disabled:opacity-50 transition-colors">
          {loading && <Spinner />}
          Suspend Account
        </button>
      )}
      {status === 'suspended' && (
        <>
          <span className="px-3 py-2 text-sm font-semibold text-[#dc2626] bg-[#fee2e2] rounded-xl">Suspended</span>
          <button onClick={() => act('active')} disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] disabled:opacity-50 transition-colors">
            {loading && <Spinner />}
            Restore Account
          </button>
        </>
      )}
      {status === 'pending_verification' && (
        <button onClick={() => act('active')} disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#16a34a] text-white rounded-xl hover:bg-[#15803d] disabled:opacity-50 transition-colors">
          {loading && <Spinner />}
          Verify Account
        </button>
      )}
      <button className="px-4 py-2 text-sm font-medium border border-[#e5e5e5] text-[#6b6b6b] rounded-xl hover:bg-[#f5f5f4] transition-colors">
        Send Email
      </button>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/>
    </svg>
  )
}