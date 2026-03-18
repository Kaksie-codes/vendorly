// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/users/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import { mockUsers, mockCustomers } from '@/lib/mock-data'
import type { User, UserStatus } from '@/types'
import { Select } from '@/components/ui/Select'

const STATUS_PILL: Record<UserStatus, string> = {
  active:               'bg-[#dcfce7] text-[#16a34a]',
  suspended:            'bg-[#fee2e2] text-[#dc2626]',
  pending_verification: 'bg-[#fef3c7] text-[#d97706]',
}
const STATUS_LABEL: Record<UserStatus, string> = {
  active:               'Active',
  suspended:            'Suspended',
  pending_verification: 'Pending',
}

const ROLE_PILL: Record<string, string> = {
  customer: 'bg-[#f5f5f4] text-[#6b6b6b]',
  vendor:   'bg-[#ede9fe] text-[#7c3aed]',
  admin:    'bg-[#fee2e2] text-[#dc2626]',
}

export default function AdminUsersPage() {
  const [search,   setSearch]   = useState('')
  const [role,     setRole]     = useState('all')
  const [tab,      setTab]      = useState('all')
  const [sort,     setSort]     = useState('newest')
  const [statuses, setStatuses] = useState<Record<string, UserStatus>>(
    Object.fromEntries(mockUsers.map((u) => [u.id, u.status]))
  )

  const suspend    = (id: string) => setStatuses((s) => ({ ...s, [id]: 'suspended' }))
  const reactivate = (id: string) => setStatuses((s) => ({ ...s, [id]: 'active' }))

  const TABS = useMemo(() => [
    { id: 'all',       label: 'All',       count: mockUsers.length },
    { id: 'active',    label: 'Active',    count: mockUsers.filter((u) => statuses[u.id] === 'active').length },
    { id: 'suspended', label: 'Suspended', count: mockUsers.filter((u) => statuses[u.id] === 'suspended').length },
    { id: 'pending',   label: 'Pending',   count: mockUsers.filter((u) => statuses[u.id] === 'pending_verification').length },
  ].filter((t) => t.id === 'all' || t.count > 0), [statuses])

  const filtered = useMemo(() => {
    let list = mockUsers.filter((u) => {
      const s = statuses[u.id]
      if (tab === 'active'    && s !== 'active')               return false
      if (tab === 'suspended' && s !== 'suspended')            return false
      if (tab === 'pending'   && s !== 'pending_verification') return false
      if (role !== 'all' && u.role !== role) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!`${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)) return false
      }
      return true
    })
    switch (sort) {
      case 'oldest': list = [...list].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)); break
      case 'name':   list = [...list].sort((a, b) => a.firstName.localeCompare(b.firstName)); break
      default:       list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    }
    return list
  }, [statuses, tab, role, search, sort])

  const customerCount = mockUsers.filter((u) => u.role === 'customer').length
  const vendorCount   = mockUsers.filter((u) => u.role === 'vendor').length
  const newThisMonth  = mockUsers.filter((u) => {
    const d = new Date(u.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-[1.75rem] font-bold text-[#111111]">Users</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">{mockUsers.length} registered users</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-[#e5e5e5] bg-white text-sm font-medium text-[#6b6b6b] px-4 py-2.5 rounded-xl hover:bg-[#f5f5f4] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Customers',    value: customerCount, color: 'text-[#111111]' },
          { label: 'Vendors',      value: vendorCount,   color: 'text-[#7c3aed]' },
          { label: 'New This Month', value: newThisMonth, color: 'text-[#16a34a]' },
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
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white" />
        </div>
        <Select
          options={[
            { value: 'all',      label: 'All Roles' },
            { value: 'customer', label: 'Customers' },
            { value: 'vendor',   label: 'Vendors' },
            { value: 'admin',    label: 'Admins' },
          ]}
          value={role}
          onChange={(v) => setRole(v)}
          size="sm"
        />
        <Select
          options={[
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'name',   label: 'Name A–Z' },
          ]}
          value={sort}
          onChange={(v) => setSort(v)}
          size="sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#e5e5e5] overflow-hidden">
        <div className="grid bg-[#fafaf9] border-b border-[#e5e5e5] px-5 py-3"
          style={{ gridTemplateColumns: '1fr 90px 110px 140px 110px' }}>
          {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
            <span key={h} className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#9ca3af]">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-[#f5f5f4] bg-white">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-3xl">👤</span>
              <p className="font-semibold text-[#111111]">No users found</p>
              <button onClick={() => { setSearch(''); setTab('all'); setRole('all') }} className="text-sm text-[#ef4444] underline">Clear filters</button>
            </div>
          ) : (
            filtered.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                status={statuses[user.id]}
                customer={mockCustomers.find((c) => c.id === user.id)}
                onSuspend={() => suspend(user.id)}
                onReactivate={() => reactivate(user.id)}
              />
            ))
          )}
        </div>
      </div>
      <p className="text-sm text-[#9ca3af] mt-4">Showing {filtered.length} of {mockUsers.length} users</p>
    </div>
  )
}

function UserRow({ user, status, customer, onSuspend, onReactivate }: {
  user: User; status: UserStatus
  customer?: { totalOrders: number; totalSpent: number }
  onSuspend: () => void; onReactivate: () => void
}) {
  return (
    <div className="grid items-center px-5 py-4 hover:bg-[#fafaf9] transition-colors"
      style={{ gridTemplateColumns: '1fr 90px 110px 140px 110px' }}>

      {/* User */}
      <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 min-w-0 group">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
          {user.avatar
            ? <Image src={user.avatar} alt="" fill className="object-cover" sizes="36px" />
            : <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#9ca3af]">{user.firstName[0]}</span>
          }
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#111111] truncate group-hover:text-[#ef4444] transition-colors">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-[#9ca3af] truncate">{user.email}</p>
        </div>
      </Link>

      {/* Role */}
      <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full capitalize w-fit ${ROLE_PILL[user.role]}`}>
        {user.role}
      </span>

      {/* Status */}
      <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full w-fit ${STATUS_PILL[status]}`}>
        {STATUS_LABEL[status]}
      </span>

      {/* Joined + spend */}
      <div>
        <p className="text-sm text-[#6b6b6b]">
          {new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        {customer && (
          <p className="text-xs text-[#9ca3af]">{customer.totalOrders} orders · ₦{customer.totalSpent.toLocaleString()}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link href={`/admin/users/${user.id}`}
          className="px-3 py-1.5 text-xs font-medium border border-[#e5e5e5] rounded-lg hover:bg-[#f5f5f4] transition-colors text-[#6b6b6b]">
          View
        </Link>
        {status === 'active' && user.role !== 'admin' && (
          <button onClick={onSuspend}
            className="px-3 py-1.5 text-xs font-medium text-[#dc2626] border border-[#fecaca] rounded-lg hover:bg-[#fee2e2] transition-colors">
            Suspend
          </button>
        )}
        {status === 'suspended' && (
          <button onClick={onReactivate}
            className="px-3 py-1.5 text-xs font-medium text-[#2563eb] border border-[#bfdbfe] rounded-lg hover:bg-[#dbeafe] transition-colors">
            Restore
          </button>
        )}
      </div>
    </div>
  )
}