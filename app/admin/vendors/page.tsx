// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/vendors/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Link   from 'next/link'
import Image  from 'next/image'
import { mockVendors, mockVendorAnalytics } from '@/lib/mock-data'
import type { Vendor, VendorStatus } from '@/types'

const STATUS_PILL: Record<string, string> = {
  active:    'bg-[#dcfce7] text-[#16a34a]',
  pending:   'bg-[#fef3c7] text-[#d97706]',
  suspended: 'bg-[#fee2e2] text-[#dc2626]',
  rejected:  'bg-[#f5f5f4] text-[#6b6b6b]',
}

const PLAN_PILL: Record<string, string> = {
  free:       'bg-[#f5f5f4] text-[#9ca3af]',
  basic:      'bg-[#dbeafe] text-[#2563eb]',
  pro:        'bg-[#ede9fe] text-[#7c3aed]',
  enterprise: 'bg-[#fef3c7] text-[#d97706]',
}

export default function AdminVendorsPage() {
  const [search,  setSearch]  = useState('')
  const [tab,     setTab]     = useState('all')
  const [plan,    setPlan]    = useState('all')
  const [sort,    setSort]    = useState('newest')
  const [statuses, setStatuses] = useState<Record<string, VendorStatus>>(
    Object.fromEntries(mockVendors.map((v) => [v.id, v.status]))
  )

  const approve  = (id: string) => setStatuses((s) => ({ ...s, [id]: 'active' }))
  const suspend  = (id: string) => setStatuses((s) => ({ ...s, [id]: 'suspended' }))
  const reject   = (id: string) => setStatuses((s) => ({ ...s, [id]: 'rejected' }))
  const reactivate = (id: string) => setStatuses((s) => ({ ...s, [id]: 'active' }))

  const TABS = [
    { id: 'all',       label: 'All',       count: mockVendors.length },
    { id: 'active',    label: 'Active',    count: mockVendors.filter((v) => statuses[v.id] === 'active').length },
    { id: 'pending',   label: 'Pending',   count: mockVendors.filter((v) => statuses[v.id] === 'pending').length },
    { id: 'suspended', label: 'Suspended', count: mockVendors.filter((v) => statuses[v.id] === 'suspended').length },
  ].filter((t) => t.id === 'all' || t.count > 0)

  const filtered = useMemo(() => {
    let list = mockVendors.filter((v) => {
      const s = statuses[v.id]
      if (tab !== 'all' && s !== tab) return false
      if (plan !== 'all' && v.plan !== plan) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!v.storeName.toLowerCase().includes(q) && !v.email.toLowerCase().includes(q)) return false
      }
      return true
    })
    switch (sort) {
      case 'oldest':   list = [...list].sort((a, b) => +new Date(a.joinedAt) - +new Date(b.joinedAt)); break
      case 'revenue':  list = [...list].sort((a, b) => b.totalRevenue - a.totalRevenue); break
      case 'products': list = [...list].sort((a, b) => b.productCount - a.productCount); break
      case 'rating':   list = [...list].sort((a, b) => b.rating - a.rating); break
      default:         list = [...list].sort((a, b) => +new Date(b.joinedAt) - +new Date(a.joinedAt))
    }
    return list
  }, [statuses, tab, plan, search, sort])

  const totalRevenue  = mockVendors.reduce((s, v) => s + v.totalRevenue, 0)
  const activeCount   = Object.values(statuses).filter((s) => s === 'active').length
  const pendingCount  = Object.values(statuses).filter((s) => s === 'pending').length

  return (
    <div className="p-6 lg:p-8 max-w-[1300px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-[1.75rem] font-bold text-[#111111]">Vendors</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">{mockVendors.length} registered vendors</p>
        </div>
        <Link href="/vendor/register" className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Invite Vendor
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total GMV',   value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, color: 'text-[#111111]' },
          { label: 'Active',      value: String(activeCount),                         color: 'text-[#16a34a]' },
          { label: 'Pending',     value: String(pendingCount),                        color: pendingCount > 0 ? 'text-[#d97706]' : 'text-[#9ca3af]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{s.label}</p>
            <p className={`font-serif text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white" />
        </div>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none text-[#6b6b6b]">
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none text-[#6b6b6b]">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="revenue">Highest Revenue</option>
          <option value="products">Most Products</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#e5e5e5] overflow-hidden">
        <div className="grid bg-[#fafaf9] border-b border-[#e5e5e5] px-5 py-3"
          style={{ gridTemplateColumns: '1fr 100px 100px 80px 80px 120px' }}>
          {['Vendor', 'Plan', 'Status', 'Products', 'Revenue', 'Actions'].map((h) => (
            <span key={h} className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af]">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-[#f5f5f4] bg-white">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-3xl">🏪</span>
              <p className="font-semibold text-[#111111]">No vendors found</p>
              <button onClick={() => { setSearch(''); setTab('all'); setPlan('all') }} className="text-sm text-[#ef4444] underline">Clear filters</button>
            </div>
          ) : (
            filtered.map((vendor) => (
              <VendorRow
                key={vendor.id}
                vendor={vendor}
                status={statuses[vendor.id]}
                analytics={mockVendorAnalytics[vendor.id]}
                onApprove={() => approve(vendor.id)}
                onSuspend={() => suspend(vendor.id)}
                onReject={() => reject(vendor.id)}
                onReactivate={() => reactivate(vendor.id)}
              />
            ))
          )}
        </div>
      </div>
      <p className="text-sm text-[#9ca3af] mt-4">Showing {filtered.length} of {mockVendors.length} vendors</p>
    </div>
  )
}

function VendorRow({ vendor, status, analytics, onApprove, onSuspend, onReject, onReactivate }: {
  vendor: Vendor; status: VendorStatus; analytics?: { totalRevenue: number }
  onApprove: () => void; onSuspend: () => void; onReject: () => void; onReactivate: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="grid items-center px-5 py-4 hover:bg-[#fafaf9] transition-colors"
      style={{ gridTemplateColumns: '1fr 100px 100px 80px 80px 120px' }}>

      {/* Vendor info */}
      <Link href={`/admin/vendors/${vendor.id}`} className="flex items-center gap-3 min-w-0 group">
        <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
          {vendor.logo && <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="36px" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#111111] truncate group-hover:text-[#ef4444] transition-colors">{vendor.storeName}</p>
          <p className="text-xs text-[#9ca3af] truncate">{vendor.email}</p>
        </div>
      </Link>

      {/* Plan */}
      <div>
        <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full capitalize ${PLAN_PILL[vendor.plan]}`}>
          {vendor.plan}
        </span>
      </div>

      {/* Status */}
      <div>
        <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full capitalize ${STATUS_PILL[status]}`}>
          {status}
        </span>
      </div>

      {/* Products */}
      <p className="text-sm text-[#6b6b6b]">{vendor.productCount}</p>

      {/* Revenue */}
      <p className="text-sm font-medium text-[#111111]">₦{((analytics?.totalRevenue ?? vendor.totalRevenue) / 1000).toFixed(0)}k</p>

      {/* Actions */}
      <div className="flex items-center gap-2 relative">
        {status === 'pending' && (
          <>
            <button onClick={onApprove} className="px-3 py-1.5 text-xs font-semibold bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors">Approve</button>
            <button onClick={onReject}  className="px-3 py-1.5 text-xs font-semibold bg-[#fee2e2] text-[#dc2626] rounded-lg hover:bg-[#fecaca] transition-colors">Reject</button>
          </>
        )}
        {status === 'active' && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="px-3 py-1.5 text-xs font-medium border border-[#e5e5e5] rounded-lg hover:bg-[#f5f5f4] transition-colors text-[#6b6b6b]">
            Actions ▾
          </button>
        )}
        {status === 'suspended' && (
          <button onClick={onReactivate} className="px-3 py-1.5 text-xs font-semibold bg-[#dbeafe] text-[#2563eb] rounded-lg hover:bg-[#bfdbfe] transition-colors">Reactivate</button>
        )}
        {menuOpen && status === 'active' && (
          <div className="absolute top-8 right-0 z-20 bg-white border border-[#e5e5e5] rounded-xl shadow-lg py-1 min-w-[120px]" onMouseLeave={() => setMenuOpen(false)}>
            <Link href={`/admin/vendors/${vendor.id}`} className="block px-4 py-2 text-sm text-[#6b6b6b] hover:bg-[#f5f5f4]">View Details</Link>
            <button onClick={() => { onSuspend(); setMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-[#dc2626] hover:bg-[#fee2e2]">Suspend</button>
          </div>
        )}
      </div>
    </div>
  )
}