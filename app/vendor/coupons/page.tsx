// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/coupons/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import { mockCoupons }      from '@/lib/mock-data'
import type { Coupon }      from '@/types'

const VENDOR_ID = 'vendor-1'

type CouponForm = {
  code: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping'
  value: string
  minOrderAmount: string
  maxDiscountAmount: string
  usageLimit: string
  expiresAt: string
  isActive: boolean
}

const emptyForm = (): CouponForm => ({
  code: '', type: 'percentage', value: '', minOrderAmount: '',
  maxDiscountAmount: '', usageLimit: '', expiresAt: '', isActive: true,
})

export default function VendorCouponsPage() {
  const vendorCoupons = mockCoupons.filter(
    (c) => !c.vendorId || c.vendorId === VENDOR_ID
  )

  const [showModal, setShowModal] = useState(false)
  const [form,      setForm]      = useState<CouponForm>(emptyForm())
  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(vendorCoupons)

  const set = (k: keyof CouponForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const handleCreate = () => {
    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      usageCount: 0,
      vendorId: VENDOR_ID,
      startsAt: new Date().toISOString(),
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      isActive: form.isActive,
    }
    setLocalCoupons((prev) => [newCoupon, ...prev])
    setShowModal(false)
    setForm(emptyForm())
  }

  const toggleActive = (id: string) => {
    setLocalCoupons((prev) =>
      prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c)
    )
  }

  const deleteCoupon = (id: string) => {
    setLocalCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  const totalSavings = localCoupons.reduce((s, c) => {
    if (c.type === 'percentage') return s + (c.usageCount * (c.maxDiscountAmount ?? 15))
    if (c.type === 'fixed_amount') return s + (c.usageCount * c.value)
    return s
  }, 0)

  return (
    <div className="p-6 lg:p-8 max-w-[1000px]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#111111]">Coupons & Discounts</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">{localCoupons.length} coupons · ₦{totalSavings.toLocaleString()} given to customers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors active:scale-[0.98]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active',   value: localCoupons.filter((c) => c.isActive).length,  color: 'text-[#16a34a]' },
          { label: 'Expired',  value: localCoupons.filter((c) => !c.isActive).length, color: 'text-[#9ca3af]' },
          { label: 'Uses',     value: localCoupons.reduce((s, c) => s + c.usageCount, 0), color: 'text-[#2563eb]' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] px-4 py-3">
            <p className="text-xs text-[#9ca3af]">{s.label}</p>
            <p className={`font-serif text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Coupons list */}
      <div className="flex flex-col gap-3">
        {localCoupons.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 bg-white rounded-2xl border border-[#e5e5e5] text-center">
            <span className="text-4xl">🏷️</span>
            <p className="font-semibold text-[#111111]">No coupons yet</p>
            <p className="text-sm text-[#9ca3af]">Create your first coupon to attract customers.</p>
          </div>
        ) : (
          localCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} onToggle={() => toggleActive(coupon.id)} onDelete={() => deleteCoupon(coupon.id)} />
          ))
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#9ca3af] hover:bg-[#f5f5f4] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <h2 className="font-serif text-xl font-bold text-[#111111] mb-5">Create Coupon</h2>

            <div className="flex flex-col gap-4">
              <MField label="Coupon Code" value={form.code} onChange={(v) => set('code', v.toUpperCase())} placeholder="e.g. SAVE10" helper="Customers will enter this at checkout" />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Discount Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'percentage',   label: '% Off' },
                    { value: 'fixed_amount', label: '₦ Off' },
                    { value: 'free_shipping',label: 'Free Ship' },
                  ] as const).map((t) => (
                    <button
                      key={t.value}
                      onClick={() => set('type', t.value)}
                      className={`py-2 text-sm font-medium rounded-xl border transition-all ${form.type === t.value ? 'border-[#c8a951] bg-[#f7f1e3] text-[#a8892f]' : 'border-[#e5e5e5] text-[#6b6b6b] hover:bg-[#fafaf9]'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.type !== 'free_shipping' && (
                <MField
                  label={form.type === 'percentage' ? 'Discount %' : 'Discount Amount (₦)'}
                  value={form.value}
                  onChange={(v) => set('value', v)}
                  type="number"
                  placeholder={form.type === 'percentage' ? 'e.g. 10' : 'e.g. 1500'}
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <MField label="Min. Order (₦)"    value={form.minOrderAmount}    onChange={(v) => set('minOrderAmount', v)}    type="number" placeholder="Optional" />
                <MField label="Usage Limit"        value={form.usageLimit}        onChange={(v) => set('usageLimit', v)}        type="number" placeholder="Unlimited" />
              </div>

              {form.type === 'percentage' && (
                <MField label="Max Discount (₦)" value={form.maxDiscountAmount} onChange={(v) => set('maxDiscountAmount', v)} type="number" placeholder="Optional cap" />
              )}

              <MField label="Expiry Date" value={form.expiresAt} onChange={(v) => set('expiresAt', v)} type="date" />

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="accent-[#c8a951]" />
                <span className="text-sm text-[#6b6b6b]">Activate coupon immediately</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#e5e5e5] text-[#6b6b6b] text-sm font-medium rounded-xl hover:bg-[#fafaf9] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!form.code || (!form.value && form.type !== 'free_shipping')}
                  className="flex-1 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-[#2a2a2a] disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  Create Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── CouponCard ───────────────────────────────────────────────────────────────

function CouponCard({ coupon, onToggle, onDelete }: { coupon: Coupon; onToggle: () => void; onDelete: () => void }) {
  const isExpired = coupon.expiresAt ? new Date(coupon.expiresAt) < new Date() : false
  const usagePct  = coupon.usageLimit ? Math.min(100, Math.round((coupon.usageCount / coupon.usageLimit) * 100)) : null

  const discountLabel =
    coupon.type === 'percentage'    ? `${coupon.value}% off`  :
    coupon.type === 'fixed_amount'  ? `₦${coupon.value} off`  :
    'Free shipping'

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${coupon.isActive && !isExpired ? 'border-[#e5e5e5]' : 'border-[#f5f5f4] opacity-60'}`}>
      <div className="flex items-center gap-4 p-4">
        {/* Code */}
        <div className="w-24 sm:w-32 shrink-0">
          <span className="font-mono font-bold text-sm text-[#111111] bg-[#f7f1e3] px-2.5 py-1 rounded-lg text-[#a8892f]">
            {coupon.code}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-[#111111]">{discountLabel}</span>
            {coupon.minOrderAmount && <span className="text-xs text-[#9ca3af]">· min ₦{coupon.minOrderAmount.toLocaleString()}</span>}
            {isExpired && <span className="text-xs bg-[#fee2e2] text-[#dc2626] px-2 py-0.5 rounded-full font-medium">Expired</span>}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-[#9ca3af]">{coupon.usageCount} uses</span>
            {coupon.usageLimit && <span className="text-xs text-[#9ca3af]">/ {coupon.usageLimit} limit</span>}
            {coupon.expiresAt && (
              <span className="text-xs text-[#9ca3af]">
                Expires {new Date(coupon.expiresAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
          {usagePct !== null && (
            <div className="mt-2 w-32 h-1.5 bg-[#f5f5f4] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${usagePct >= 90 ? 'bg-[#dc2626]' : usagePct >= 70 ? 'bg-[#d97706]' : 'bg-[#c8a951]'}`} style={{ width: `${usagePct}%` }} />
            </div>
          )}
        </div>

        {/* Toggle + delete */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onToggle} className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${coupon.isActive && !isExpired ? 'bg-[#c8a951]' : 'bg-[#e5e5e5]'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${coupon.isActive && !isExpired ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
          </button>
          <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-lg transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function MField({ label, value, onChange, type = 'text', placeholder, helper }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; helper?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] bg-white transition"
      />
      {helper && <p className="text-xs text-[#9ca3af]">{helper}</p>}
    </div>
  )
}