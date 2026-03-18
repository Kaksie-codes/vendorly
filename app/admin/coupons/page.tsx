// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/coupons/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useMemo } from 'react'
import { mockCoupons, getVendorById } from '@/lib/mock-data'
import type { Coupon } from '@/types'
import { Select } from '@/components/ui/Select'

type FilterTab = 'all' | 'active' | 'expired' | 'platform' | 'vendor'

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',      label: 'All'            },
  { id: 'active',   label: 'Active'         },
  { id: 'expired',  label: 'Expired'        },
  { id: 'platform', label: 'Platform-wide'  },
  { id: 'vendor',   label: 'Vendor-specific'},
]

const TYPE_META: Record<string, { label: string; bg: string; color: string }> = {
  percentage:    { label: '% Off',         bg: '#eff6ff', color: '#2563eb' },
  fixed_amount:  { label: '₦ Off',         bg: '#fdf4ff', color: '#7c3aed' },
  free_shipping: { label: 'Free Shipping', bg: '#f0fdf4', color: '#16a34a' },
}

const BLANK: Omit<Coupon, 'id' | 'usageCount'> = {
  code: '', type: 'percentage', value: 10,
  isActive: true,
  startsAt: new Date().toISOString(),
}

function Spinner() {
  return (
    <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
    </svg>
  )
}

// Defined outside component so they are stable references — required for useMemo deps
const isExpired = (c: Coupon) => !!c.expiresAt && new Date(c.expiresAt) < new Date()
const isActive  = (c: Coupon) => c.isActive && !isExpired(c)

type CouponRow = Coupon & { _deleted?: boolean }

export default function AdminCouponsPage() {
  const [tab, setTab]     = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [coupons, setCoupons] = useState<CouponRow[]>(
    mockCoupons as CouponRow[]
  )
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<Partial<typeof BLANK> & { value?: number }>({ ...BLANK })
  const [saving, setSaving]   = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const live = useMemo(
    () => coupons.filter((c) => !c._deleted),
    [coupons]
  )

  const counts = useMemo(() => ({
    all:      live.length,
    active:   live.filter(isActive).length,
    expired:  live.filter(isExpired).length,
    platform: live.filter((c) => !c.vendorId).length,
    vendor:   live.filter((c) => !!c.vendorId).length,
  }), [live])

  const totalRedemptions = live.reduce((s, c) => s + c.usageCount, 0)

  const filtered = useMemo(() => {
    let list = [...live]
    if (tab === 'active')   list = list.filter(isActive)
    if (tab === 'expired')  list = list.filter(isExpired)
    if (tab === 'platform') list = list.filter((c) => !c.vendorId)
    if (tab === 'vendor')   list = list.filter((c) => !!c.vendorId)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) => c.code.toLowerCase().includes(q))
    }
    return list
  }, [live, tab, search])

  const toggleActive = (id: string) =>
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c))

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, _deleted: true } : c))
    setConfirmId(null)
  }

  const handleCreate = async () => {
    if (!form.code?.trim()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    const created: Coupon = {
      id:             `coupon-${Date.now()}`,
      code:           form.code.toUpperCase().replace(/\s+/g, ''),
      type:           (form.type ?? 'percentage') as Coupon['type'],
      value:          Number(form.value) || 0,
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
      usageLimit:     form.usageLimit    ? Number(form.usageLimit)    : undefined,
      usageCount:     0,
      isActive:       true,
      startsAt:       new Date().toISOString(),
      expiresAt:      form.expiresAt
        ? new Date(form.expiresAt as string).toISOString()
        : undefined,
    }
    setCoupons((prev) => [created, ...prev])
    setSaving(false)
    setShowCreate(false)
    setForm({ ...BLANK })
  }

  const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-[#e5e5e5] rounded-xl outline-none focus:border-[#ef4444] transition-all bg-white'
  const labelCls = 'block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <div className="p-5 lg:p-7 max-w-[1200px] space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="admin-page-title">Coupons</p>
          <p className="text-sm text-[#9ca3af] mt-0.5">Manage platform-wide and vendor discount codes</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#ef4444] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#dc2626] transition-colors self-start shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create coupon
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Coupons',     value: counts.all,          icon: '🎟️', bg: '#f5f5f4', color: '#111111' },
          { label: 'Active',            value: counts.active,       icon: '✅', bg: '#dcfce7', color: '#16a34a' },
          { label: 'Total Redemptions', value: totalRedemptions,    icon: '🛒', bg: '#dbeafe', color: '#2563eb' },
          { label: 'Vendor Coupons',    value: counts.vendor,       icon: '🏪', bg: '#ede9fe', color: '#7c3aed' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e5e5e5] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">{s.label}</p>
              <span className="w-8 h-8 flex items-center justify-center rounded-xl text-base"
                style={{ background: s.bg }}>{s.icon}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-heading)' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Tabs — wrap on small screens */}
        <div className="flex flex-wrap gap-1 p-1 bg-white border border-[#e5e5e5] rounded-xl">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                tab === t.id ? 'bg-[#111111] text-white' : 'text-[#9ca3af] hover:text-[#111111]'
              }`}>
              {t.label}
              <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-semibold ${
                tab === t.id ? 'bg-white/20 text-white' : 'bg-[#f5f5f4] text-[#9ca3af]'
              }`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto w-full sm:w-56">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupon code…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e5e5e5] rounded-xl outline-none focus:border-[#ef4444] bg-white transition-all"/>
        </div>
      </div>

      {/* ── Coupon cards (responsive grid instead of table) ── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e5e5e5] rounded-2xl py-20 text-center">
          <p className="text-4xl mb-3">🎟️</p>
          <p className="text-sm font-semibold text-[#111111]">No coupons found</p>
          <p className="text-xs text-[#9ca3af] mt-1">Try a different filter or create a new coupon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const expired   = isExpired(c)
            const active    = !expired && c.isActive
            const vendor    = c.vendorId ? getVendorById(c.vendorId) : null
            const usagePct  = c.usageLimit ? Math.min((c.usageCount / c.usageLimit) * 100, 100) : 0
            const typeMeta  = TYPE_META[c.type]

            return (
              <div key={c.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                  active ? 'border-[#e5e5e5]' : 'border-[#e5e5e5] opacity-70'
                }`}>

                {/* Card header */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {/* Code */}
                    <span className="font-mono text-lg font-bold text-[#111111] bg-[#f5f5f4] px-3 py-1.5 rounded-xl tracking-widest">
                      {c.code}
                    </span>
                    {/* Active toggle */}
                    <button onClick={() => toggleActive(c.id)}
                      title={active ? 'Deactivate' : 'Activate'}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 mt-1 ${
                        active ? 'bg-[#16a34a]' : 'bg-[#d1d5db]'
                      }`}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        active ? 'translate-x-6' : 'translate-x-1'
                      }`}/>
                    </button>
                  </div>

                  {/* Type + value */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: typeMeta.bg, color: typeMeta.color }}>
                      {typeMeta.label}
                    </span>
                    <span className="text-xl font-bold text-[#111111]">
                      {c.type === 'percentage'
                        ? `${c.value}% off`
                        : c.type === 'free_shipping'
                        ? 'Free shipping'
                        : `₦${c.value} off`}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#9ca3af]">
                    {c.minOrderAmount && (
                      <span>Min order: <strong className="text-[#6b6b6b]">₦{c.minOrderAmount.toLocaleString()}</strong></span>
                    )}
                    {c.maxDiscountAmount && (
                      <span>Max discount: <strong className="text-[#6b6b6b]">₦{c.maxDiscountAmount.toLocaleString()}</strong></span>
                    )}
                    <span>
                      Scope:{' '}
                      {vendor ? (
                        <strong className="text-[#7c3aed]">{vendor.storeName}</strong>
                      ) : (
                        <strong className="text-[#2563eb]">Platform-wide</strong>
                      )}
                    </span>
                  </div>
                </div>

                {/* Usage bar */}
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#9ca3af]">Usage</span>
                    <span className="font-semibold text-[#111111]">
                      {c.usageCount.toLocaleString()}
                      {c.usageLimit && (
                        <span className="text-[#9ca3af] font-normal"> / {c.usageLimit.toLocaleString()}</span>
                      )}
                      {!c.usageLimit && <span className="text-[#9ca3af] font-normal"> / ∞</span>}
                    </span>
                  </div>
                  <div className="h-2 bg-[#f5f5f4] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: c.usageLimit ? `${usagePct}%` : '0%',
                        backgroundColor: usagePct >= 90 ? '#dc2626' : usagePct >= 60 ? '#d97706' : '#16a34a',
                      }}/>
                  </div>
                </div>

                {/* Expiry + actions */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#f5f5f4] bg-[#fafaf9]">
                  <div className="text-xs">
                    {c.expiresAt ? (
                      <span className={expired ? 'text-[#dc2626] font-medium' : 'text-[#9ca3af]'}>
                        {expired ? '⚠ Expired ' : 'Expires '}
                        {new Date(c.expiresAt).toLocaleDateString('en', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-[#9ca3af]">No expiry</span>
                    )}
                  </div>

                  {/* Delete */}
                  {confirmId === c.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#9ca3af]">Delete?</span>
                      <button onClick={() => handleDelete(c.id)}
                        className="text-xs font-semibold text-white bg-[#dc2626] px-2.5 py-1 rounded-lg hover:bg-[#b91c1c] transition-colors">
                        Yes
                      </button>
                      <button onClick={() => setConfirmId(null)}
                        className="text-xs font-medium text-[#6b6b6b] border border-[#e5e5e5] px-2.5 py-1 rounded-lg hover:bg-[#f5f5f4] transition-colors">
                        No
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(c.id)}
                      className="flex items-center gap-1 text-xs text-[#9ca3af] hover:text-[#dc2626] transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Create coupon modal ── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden">

            {/* Modal header */}
            <div className="px-6 py-5 border-b border-[#e5e5e5] flex items-center justify-between">
              <p className="text-base font-bold text-[#111111]" style={{ fontFamily: 'var(--font-heading)' }}>
                Create Coupon
              </p>
              <button onClick={() => setShowCreate(false)}
                className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#111111] hover:bg-[#f5f5f4] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {/* Code + type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Coupon Code</label>
                  <input
                    value={form.code ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SAVE20"
                    className={inputCls}/>
                  <p className="text-xs text-[#9ca3af] mt-1">Uppercase, no spaces</p>
                </div>
                <div>
                  <label className={labelCls}>Discount Type</label>
                  <Select
                    options={[
                      { value: 'percentage',   label: 'Percentage (% off)' },
                      { value: 'fixed_amount', label: 'Fixed Amount (₦ off)' },
                      { value: 'free_shipping',label: 'Free Shipping' },
                    ]}
                    value={form.type ?? 'percentage'}
                    onChange={(v) => setForm((f) => ({ ...f, type: v as Coupon['type'] }))}
                  />
                </div>
              </div>

              {/* Value + min order */}
              {form.type !== 'free_shipping' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>
                      Value {form.type === 'percentage' ? '(%)' : '(₦)'}
                    </label>
                    <input type="number" min={0}
                      value={form.value ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, value: +e.target.value }))}
                      className={inputCls}/>
                  </div>
                  <div>
                    <label className={labelCls}>Min Order Amount (₦)</label>
                    <input type="number" min={0}
                      value={(form.minOrderAmount as number) ?? ''}
                      placeholder="No minimum"
                      onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: +e.target.value }))}
                      className={inputCls}/>
                  </div>
                </div>
              )}

              {/* Usage limit + expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Usage Limit</label>
                  <input type="number" min={0}
                    value={(form.usageLimit as number) ?? ''}
                    placeholder="Unlimited"
                    onChange={(e) => setForm((f) => ({ ...f, usageLimit: +e.target.value }))}
                    className={inputCls}/>
                </div>
                <div>
                  <label className={labelCls}>Expiry Date</label>
                  <input type="date"
                    value={(form.expiresAt as string) ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                    className={inputCls}/>
                </div>
              </div>

              {/* Preview */}
              {form.code && (
                <div className="rounded-xl border border-[#e5e5e5] bg-[#fafaf9] p-4">
                  <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">Preview</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-[#111111] bg-white border border-[#e5e5e5] px-3 py-1.5 rounded-lg tracking-widest">
                      {form.code}
                    </span>
                    <span className="text-sm text-[#6b6b6b]">
                      {form.type === 'percentage' && form.value ? `${form.value}% off` : ''}
                      {form.type === 'fixed_amount' && form.value ? `₦${form.value} off` : ''}
                      {form.type === 'free_shipping' ? 'Free shipping' : ''}
                      {(form.minOrderAmount as number) > 0 ? ` · min ₦${(form.minOrderAmount as number).toLocaleString()}` : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowCreate(false); setForm({ ...BLANK }) }}
                  className="flex-1 py-2.5 rounded-xl border border-[#e5e5e5] text-sm font-medium text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors">
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={saving || !form.code?.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#ef4444] text-white text-sm font-semibold hover:bg-[#dc2626] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {saving ? <><Spinner /> Creating…</> : 'Create coupon'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}