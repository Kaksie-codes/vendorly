// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/settings/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getVendorById, mockProducts } from '@/lib/mock-data'
import { Card }     from '@/components/ui/Card'
import { FormField, FormTextarea, Toggle, SaveBar } from '@/components/ui/FormField'
import { PricingPlans } from '@/components/vendor/PricingPlans'

const VENDOR_ID = 'vendor-1'

type Tab = 'store' | 'notifications' | 'shipping' | 'security' | 'billing'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'store', label: 'Store Profile',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: 'notifications', label: 'Notifications',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  },
  {
    id: 'shipping', label: 'Shipping',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
  {
    id: 'security', label: 'Security',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    id: 'billing', label: 'Plan & Billing',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
]

const NOTIF_OPTIONS = [
  { key: 'newOrder',       label: 'New Order',         sub: 'When a customer places an order in your store' },
  { key: 'orderShipped',   label: 'Order Shipped',      sub: 'When you mark an order as shipped' },
  { key: 'orderDelivered', label: 'Order Delivered',    sub: 'When a delivery is confirmed' },
  { key: 'lowStock',       label: 'Low Stock Alert',    sub: 'When any product drops below 5 units' },
  { key: 'newReview',      label: 'New Review',         sub: 'When a customer leaves a product review' },
  { key: 'payoutSent',     label: 'Payout Sent',        sub: 'When a payout is transferred to your account' },
  { key: 'promotions',     label: 'Tips & Suggestions', sub: 'Growth tips and platform feature highlights' },
  { key: 'newsletter',     label: 'Monthly Newsletter', sub: 'Vendorly platform news and updates' },
] as const

export default function VendorSettingsPage() {
  const vendor = getVendorById(VENDOR_ID)
  const productCount = mockProducts.filter((p) => p.vendorId === VENDOR_ID).length

  const searchParams = useSearchParams()
  const [tab,   setTab]   = useState<Tab>(() => {
    const t = searchParams.get('tab')
    return (TABS.some((x) => x.id === t) ? t : 'store') as Tab
  })
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  // ── Store state ──
  const [store, setStore] = useState({
    storeName:      vendor?.storeName          ?? '',
    tagline:        vendor?.tagline            ?? '',
    description:    vendor?.description        ?? '',
    email:          vendor?.email              ?? '',
    phone:          vendor?.phone              ?? '',
    website:        vendor?.website            ?? '',
    instagram:      vendor?.socialLinks?.instagram ?? '',
    twitter:        vendor?.socialLinks?.twitter   ?? '',
    facebook:       vendor?.socialLinks?.facebook  ?? '',
    shippingPolicy: vendor?.shippingPolicy     ?? '',
    returnPolicy:   vendor?.returnPolicy       ?? '',
  })
  const sv = (k: keyof typeof store) => (v: string) => setStore((s) => ({ ...s, [k]: v }))

  // ── Notifications state ──
  const [notifs, setNotifs] = useState({
    newOrder: true, orderShipped: true, orderDelivered: false,
    lowStock: true, newReview: true, payoutSent: true, promotions: false, newsletter: false,
  })

  // ── Shipping zones ──
  const [zones, setZones] = useState([
    { id: 'z1', name: 'Lagos',         price: 1500,  days: '1–2' },
    { id: 'z2', name: 'South West',    price: 2500,  days: '2–4' },
    { id: 'z3', name: 'Other States',  price: 3500,  days: '3–7' },
    { id: 'z4', name: 'International', price: 15000, days: '7–14' },
  ])
  const [freeThreshold, setFreeThreshold] = useState('50000')

  return (
    <div className="p-6 lg:p-8 max-w-[1000px]">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="font-serif text-[1.75rem] font-bold text-[#111111] leading-tight">Settings</h1>
        <p className="text-sm text-[#9ca3af] mt-0.5">Manage your store preferences and account</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-7">

        {/* ── Sidebar nav ── */}
        <aside className="flex lg:flex-col gap-1 shrink-0 lg:w-48 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all text-left shrink-0',
                tab === t.id ? 'bg-[#111111] text-white' : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]',
              ].join(' ')}
            >
              <span className={tab === t.id ? 'text-white' : 'text-[#9ca3af]'}>{t.icon}</span>
              {t.label}
              {t.id === 'billing' && vendor?.plan && (
                <span className={`ml-auto text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  tab === t.id ? 'bg-white/20 text-white' : 'bg-[#f7f1e3] text-[#a8892f]'
                }`}>
                  {vendor.plan}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* ════════ STORE PROFILE ════════ */}
          {tab === 'store' && (
            <>
              <Card title="Store Identity">
                {/* Logo upload */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
                    {vendor?.logo
                      ? <Image src={vendor.logo} alt="Store logo" fill className="object-cover" sizes="64px" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#9ca3af]">
                          {store.storeName[0] ?? 'S'}
                        </div>
                    }
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f4] transition-colors text-[#6b6b6b]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Change Logo
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                    <p className="text-xs text-[#9ca3af] mt-1.5">200×200px recommended</p>
                  </div>
                </div>

                {/* Banner */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b] mb-2">Store Banner</p>
                  <div className="relative h-24 rounded-2xl overflow-hidden border border-[#e5e5e5] bg-[#f5f5f4]">
                    {vendor?.banner && <Image src={vendor.banner} alt="banner" fill className="object-cover" sizes="800px" />}
                    <label className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-medium">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Change Banner
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-1.5">1200×300px recommended</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Store Name" value={store.storeName} onChange={sv('storeName')} required span />
                  <FormField label="Tagline"    value={store.tagline}   onChange={sv('tagline')}   placeholder="e.g. Handcrafted goods with soul" span />
                </div>

                <FormTextarea label="Description" value={store.description} onChange={sv('description')} rows={4} />
              </Card>

              <Card title="Contact Info">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Email"   value={store.email}   onChange={sv('email')}   type="email" />
                  <FormField label="Phone"   value={store.phone}   onChange={sv('phone')}   type="tel" />
                  <FormField label="Website" value={store.website} onChange={sv('website')} type="url" span />
                </div>
              </Card>

              <Card title="Social Links">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Instagram"   value={store.instagram} onChange={sv('instagram')} placeholder="https://instagram.com/yourstore" />
                  <FormField label="Twitter / X" value={store.twitter}   onChange={sv('twitter')}   placeholder="https://x.com/yourstore" />
                  <FormField label="Facebook"    value={store.facebook}  onChange={sv('facebook')}  placeholder="https://facebook.com/yourstore" />
                </div>
              </Card>

              <Card title="Policies">
                <FormTextarea label="Shipping Policy" value={store.shippingPolicy} onChange={sv('shippingPolicy')} rows={3} placeholder="e.g. Orders ship within 3–5 business days…" />
                <FormTextarea label="Return Policy"   value={store.returnPolicy}   onChange={sv('returnPolicy')}   rows={3} placeholder="e.g. Returns accepted within 14 days…" />
              </Card>

              <SaveBar saved={saved} onSave={save} />
            </>
          )}

          {/* ════════ NOTIFICATIONS ════════ */}
          {tab === 'notifications' && (
            <>
              <Card title="Email Notifications">
                <div className="divide-y divide-[#f5f5f4]">
                  {NOTIF_OPTIONS.map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="pr-4">
                        <p className="text-sm font-medium text-[#111111]">{label}</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">{sub}</p>
                      </div>
                      <Toggle
                        checked={notifs[key]}
                        onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </Card>
              <SaveBar saved={saved} onSave={save} />
            </>
          )}

          {/* ════════ SHIPPING ════════ */}
          {tab === 'shipping' && (
            <>
              <Card title="Shipping Zones">
                <div className="flex flex-col gap-2">
                  {zones.map((zone) => (
                    <div key={zone.id} className="flex items-center gap-3 px-4 py-3.5 bg-[#fafaf9] rounded-xl border border-[#e5e5e5]">
                      <div className="flex-1 min-w-0">
                        {zone.name
                          ? <>
                              <p className="text-sm font-medium text-[#111111]">{zone.name}</p>
                              <p className="text-xs text-[#9ca3af]">{zone.days} business days</p>
                            </>
                          : <input
                              type="text"
                              placeholder="Zone name…"
                              className="text-sm bg-transparent focus:outline-none text-[#111111] w-full"
                              onChange={(e) => setZones((z) => z.map((zn) => zn.id === zone.id ? { ...zn, name: e.target.value } : zn))}
                            />
                        }
                      </div>
                      <div className="flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden bg-white shrink-0">
                        <span className="px-2 py-2 text-xs text-[#9ca3af] bg-[#f5f5f4] border-r border-[#e5e5e5] select-none">₦</span>
                        <input
                          type="number"
                          value={zone.price}
                          onChange={(e) => setZones((z) => z.map((zn) => zn.id === zone.id ? { ...zn, price: Number(e.target.value) } : zn))}
                          className="w-20 px-2 py-2 text-sm text-right focus:outline-none bg-white"
                        />
                      </div>
                      <button
                        onClick={() => setZones((z) => z.filter((zn) => zn.id !== zone.id))}
                        className="w-7 h-7 flex items-center justify-center text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-lg transition-colors shrink-0"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setZones((z) => [...z, { id: `z${Date.now()}`, name: '', price: 0, days: '' }])}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#e5e5e5] rounded-xl text-sm font-medium text-[#9ca3af] hover:border-[#c8a951] hover:text-[#c8a951] hover:bg-[#f7f1e3] transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Zone
                </button>
              </Card>

              <Card title="Free Shipping Threshold">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#111111]">Offer free shipping above</p>
                    <p className="text-xs text-[#9ca3af] mt-0.5">Set to 0 to disable free shipping</p>
                  </div>
                  <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
                    <span className="px-3 py-2.5 text-sm text-[#9ca3af] bg-[#f5f5f4] border-r border-[#e5e5e5] select-none">₦</span>
                    <input
                      type="number"
                      value={freeThreshold}
                      onChange={(e) => setFreeThreshold(e.target.value)}
                      className="w-28 px-3 py-2.5 text-sm text-right focus:outline-none"
                    />
                  </div>
                </div>
              </Card>

              <SaveBar saved={saved} onSave={save} />
            </>
          )}

          {/* ════════ SECURITY ════════ */}
          {tab === 'security' && (
            <>
              <Card title="Change Password">
                <div className="flex flex-col gap-4 max-w-xs">
                  <FormField label="Current Password" value="" onChange={() => {}} type="password" />
                  <FormField label="New Password"      value="" onChange={() => {}} type="password" />
                  <FormField label="Confirm Password"  value="" onChange={() => {}} type="password" />
                </div>
                <button className="px-5 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-[#2a2a2a] transition-colors active:scale-[0.98]">
                  Update Password
                </button>
              </Card>

              <Card title="Two-Factor Authentication">
                <div className="flex items-center justify-between p-4 bg-[#fafaf9] rounded-xl border border-[#e5e5e5]">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">Authenticator App</p>
                    <p className="text-xs text-[#9ca3af] mt-0.5">Use Google Authenticator or Authy for extra security</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f4] transition-colors text-[#6b6b6b]">
                    Enable
                  </button>
                </div>
              </Card>

              <Card title="Active Sessions">
                <div className="divide-y divide-[#f5f5f4]">
                  {[
                    { device: 'MacBook Pro — Chrome', location: 'Lagos, Nigeria', time: 'Current session', current: true },
                    { device: 'iPhone 15 — Safari',   location: 'Lagos, Nigeria', time: '2 hours ago',     current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium text-[#111111]">{s.device}</p>
                        <p className="text-xs text-[#9ca3af]">{s.location} · {s.time}</p>
                      </div>
                      {s.current
                        ? <span className="text-xs font-semibold bg-[#dcfce7] text-[#16a34a] px-2.5 py-1 rounded-full">Active</span>
                        : <button className="text-xs font-semibold text-[#dc2626] hover:underline">Revoke</button>
                      }
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Danger Zone">
                <div className="flex items-center justify-between p-4 bg-[#fff1f2] border border-[#fecdd3] rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-[#dc2626]">Deactivate Store</p>
                    <p className="text-xs text-[#fca5a5] mt-0.5">Temporarily hide your store from all customers</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-[#dc2626] border border-[#fca5a5] rounded-xl hover:bg-[#fee2e2] transition-colors">
                    Deactivate
                  </button>
                </div>
              </Card>
            </>
          )}

          {/* ════════ BILLING / UPGRADE ════════ */}
          {tab === 'billing' && (
            <PricingPlans
              currentPlan={vendor?.plan}
              productCount={productCount}
              renewalDate={undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}
