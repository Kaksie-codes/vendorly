// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/profile/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getVendorById } from '@/lib/mock-data'
import { Select } from '@/components/ui/Select'

const VENDOR_ID = 'vendor-1'

type Tab = 'store' | 'contact' | 'policies' | 'social'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'store', label: 'Store Info',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: 'contact', label: 'Contact',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  },
  {
    id: 'policies', label: 'Policies',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    id: 'social', label: 'Social Links',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  },
]

const PLAN_META: Record<string, { label: string; bg: string; color: string; features: string[] }> = {
  free:       { label: 'Free',       bg: '#f5f5f4', color: '#6b6b6b', features: ['Up to 10 products', 'Basic analytics', 'Community support'] },
  basic:      { label: 'Basic',      bg: '#dbeafe', color: '#2563eb', features: ['Up to 50 products', 'Standard analytics', 'Email support'] },
  pro:        { label: 'Pro',        bg: '#fefce8', color: '#c8a951', features: ['Unlimited products', 'Advanced analytics', 'Priority support', 'Custom storefront'] },
  enterprise: { label: 'Enterprise', bg: '#ede9fe', color: '#7c3aed', features: ['Everything in Pro', 'Dedicated manager', 'Custom integrations', 'SLA guarantee'] },
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
    </svg>
  )
}

export default function VendorProfilePage() {
  const vendor = getVendorById(VENDOR_ID)!
  const plan   = PLAN_META[vendor.plan] ?? PLAN_META.free

  const [tab, setTab] = useState<Tab>('store')

  const readFile = (file: File, setter: (url: string) => void) => {
    const reader = new FileReader()
    reader.onload = (e) => { setter(e.target?.result as string); markDirty() }
    reader.readAsDataURL(file)
  }
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [dirty,  setDirty]  = useState(false)

  // ── Store info ──
  const [storeName,    setStoreName]    = useState(vendor.storeName)
  const [tagline,      setTagline]      = useState(vendor.tagline ?? '')
  const [description,  setDescription]  = useState(vendor.description ?? '')
  const [logo,           setLogo]           = useState(vendor.logo ?? '')
  const [banner,         setBanner]         = useState(vendor.banner ?? '')
  const [bannerPosition, setBannerPosition] = useState({ x: 50, y: 50 })
  const [bannerModalOpen, setBannerModalOpen] = useState(false)
  const [pendingBannerSrc, setPendingBannerSrc] = useState('')

  // ── Contact ──
  const [email,          setEmail]          = useState(vendor.email ?? '')
  const [phone,          setPhone]          = useState(vendor.phone ?? '')
  const [website,        setWebsite]        = useState(vendor.website ?? '')
  const [addressLine1,   setAddressLine1]   = useState(vendor.address?.line1 ?? '')
  const [addressCity,    setAddressCity]    = useState(vendor.address?.city ?? '')
  const [addressState,   setAddressState]   = useState(vendor.address?.state ?? '')
  const [addressZip,     setAddressZip]     = useState(vendor.address?.postalCode ?? '')
  const [addressCountry, setAddressCountry] = useState(vendor.address?.country ?? 'US')

  // ── Policies ──
  const [shippingPolicy, setShippingPolicy] = useState(
    vendor.shippingPolicy ?? 'Orders are processed within 1–2 business days. Standard shipping takes 5–7 business days. Expedited options are available at checkout.'
  )
  const [returnPolicy, setReturnPolicy] = useState(
    vendor.returnPolicy ?? 'We accept returns within 30 days of delivery. Items must be unused and in original packaging. Contact us to initiate a return.'
  )

  // ── Social ──
  const [instagram, setInstagram] = useState(vendor.socialLinks?.instagram ?? '')
  const [twitter,   setTwitter]   = useState(vendor.socialLinks?.twitter   ?? '')
  const [facebook,  setFacebook]  = useState(vendor.socialLinks?.facebook  ?? '')
  const [tiktok,    setTiktok]    = useState('')
  const [youtube,   setYoutube]   = useState('')

  function markDirty() { setDirty(true) }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setDirty(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-[#e5e5e5] rounded-xl outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition-all bg-white'
  const labelCls = 'block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <>
    <div className="p-5 lg:p-7 max-w-[1100px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="admin-page-title">Store Profile</p>
          <p className="text-sm text-[#9ca3af] mt-0.5">
            Manage how your store appears to customers
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          {dirty && !saved && (
            <span className="text-xs text-[#d97706] font-medium">Unsaved changes</span>
          )}
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? 'bg-[#dcfce7] text-[#16a34a]'
                : 'bg-[#111111] text-white hover:bg-[#2a2a2a] disabled:opacity-50'
            }`}>
            {saving
              ? <><Spinner />Saving…</>
              : saved
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Saved</>
              : <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Save changes
                </>
            }
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* ── Left: tabs + forms ── */}
        <div className="space-y-5">

          {/* Tab bar */}
          <div className="flex gap-0.5 p-1 bg-white border border-[#e5e5e5] rounded-xl w-fit">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-[#111111] text-white'
                    : 'text-[#9ca3af] hover:text-[#111111]'
                }`}>
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── Store Info tab ── */}
          {tab === 'store' && (
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 space-y-6">

              {/* Banner */}
              <div>
                <label className={labelCls}>Store Banner</label>
                <div className="relative rounded-2xl overflow-hidden bg-[#f5f5f4] h-40 mb-3 group">
                  {banner && (
                    <Image src={banner} alt="Banner" fill className="object-cover"
                      style={{ objectPosition: `${bannerPosition.x}% ${bannerPosition.y}%` }} />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="banner-upload" className="flex items-center gap-2 bg-white text-[#111111] text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#f5f5f4] transition-colors shadow-md">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload banner
                    </label>
                    <input id="banner-upload" type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (!f) return
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                          setPendingBannerSrc(ev.target?.result as string)
                          setBannerModalOpen(true)
                        }
                        reader.readAsDataURL(f)
                        e.target.value = ''
                      }} />
                  </div>
                  {!banner && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#9ca3af] gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span className="text-xs">No banner uploaded</span>
                    </div>
                  )}
                </div>
                <input value={banner}
                  onChange={(e) => { setBanner(e.target.value); markDirty() }}
                  placeholder="Or paste an image URL…"
                  className={inputCls}/>
                <p className="text-xs text-[#9ca3af] mt-1.5">Recommended: 1200 × 300 px · JPG or PNG</p>
              </div>

              {/* Logo */}
              <div>
                <label className={labelCls}>Store Logo</label>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f5f5f4] shrink-0 border border-[#e5e5e5] relative">
                    {logo
                      ? <Image src={logo} alt="Logo" fill className="object-cover"/>
                      : <div className="absolute inset-0 flex items-center justify-center text-[#9ca3af]">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                    }
                  </div>
                  <div className="flex-1 space-y-2">
                    <label htmlFor="logo-upload" className="flex items-center gap-2 border border-[#e5e5e5] text-[#111111] text-sm font-medium px-4 py-2 rounded-xl cursor-pointer hover:bg-[#f5f5f4] transition-colors w-fit">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload logo
                    </label>
                    <input id="logo-upload" type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, setLogo) }} />
                    <input value={logo}
                      onChange={(e) => { setLogo(e.target.value); markDirty() }}
                      placeholder="Or paste image URL…"
                      className={inputCls}/>
                    <p className="text-xs text-[#9ca3af]">Recommended: 200 × 200 px · Square</p>
                  </div>
                </div>
              </div>

              {/* Store name */}
              <div>
                <label className={labelCls}>Store Name</label>
                <input value={storeName}
                  onChange={(e) => { setStoreName(e.target.value); markDirty() }}
                  className={inputCls}/>
                <p className="text-xs text-[#9ca3af] mt-1.5">
                  Public URL:{' '}
                  <Link href={`/vendors/${vendor.storeSlug}`}
                    className="text-[#c8a951] hover:underline font-medium">
                    vendorly.com/vendors/{vendor.storeSlug}
                  </Link>
                </p>
              </div>

              {/* Tagline */}
              <div>
                <label className={labelCls}>Tagline</label>
                <input value={tagline}
                  onChange={(e) => { setTagline(e.target.value.slice(0, 80)); markDirty() }}
                  placeholder="A short, memorable description of your store"
                  className={inputCls}/>
                <div className="flex justify-between mt-1.5">
                  <p className="text-xs text-[#9ca3af]">Shown below your store name</p>
                  <p className={`text-xs font-medium ${tagline.length > 70 ? 'text-[#d97706]' : 'text-[#9ca3af]'}`}>
                    {tagline.length}/80
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Store Description</label>
                <textarea value={description} rows={6}
                  onChange={(e) => { setDescription(e.target.value.slice(0, 1000)); markDirty() }}
                  placeholder="Tell customers about your story, your craft, and what makes you unique…"
                  className={`${inputCls} resize-none`}/>
                <div className="flex justify-between mt-1.5">
                  <p className="text-xs text-[#9ca3af]">Appears on your storefront page</p>
                  <p className={`text-xs font-medium ${description.length > 900 ? 'text-[#d97706]' : 'text-[#9ca3af]'}`}>
                    {description.length}/1000
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Contact tab ── */}
          {tab === 'contact' && (
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 space-y-5">
              <div>
                <p className="text-sm font-semibold text-[#111111] mb-1">Business Contact</p>
                <p className="text-xs text-[#9ca3af]">How customers and Vendorly can reach you</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Business Email</label>
                  <input type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); markDirty() }}
                    className={inputCls}/>
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input value={phone}
                    onChange={(e) => { setPhone(e.target.value); markDirty() }}
                    className={inputCls}/>
                </div>
              </div>

              <div>
                <label className={labelCls}>Website</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af]">🌐</span>
                  <input value={website}
                    onChange={(e) => { setWebsite(e.target.value); markDirty() }}
                    placeholder="https://yourwebsite.com"
                    className={`${inputCls} pl-8`}/>
                </div>
              </div>

              <hr className="border-[#f5f5f4]"/>

              <div>
                <p className="text-sm font-semibold text-[#111111] mb-1">Business Address</p>
                <p className="text-xs text-[#9ca3af] mb-4">Used for payout records — not shown publicly</p>

                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Street Address</label>
                    <input value={addressLine1}
                      onChange={(e) => { setAddressLine1(e.target.value); markDirty() }}
                      placeholder="123 Main Street"
                      className={inputCls}/>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className={labelCls}>City</label>
                      <input value={addressCity}
                        onChange={(e) => { setAddressCity(e.target.value); markDirty() }}
                        className={inputCls}/>
                    </div>
                    <div>
                      <label className={labelCls}>State</label>
                      <input value={addressState}
                        onChange={(e) => { setAddressState(e.target.value); markDirty() }}
                        className={inputCls}/>
                    </div>
                    <div>
                      <label className={labelCls}>ZIP / Postcode</label>
                      <input value={addressZip}
                        onChange={(e) => { setAddressZip(e.target.value); markDirty() }}
                        className={inputCls}/>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Country</label>
                    <Select
                      options={[
                        { value: 'NG', label: 'Nigeria' },
                        { value: 'US', label: 'United States' },
                        { value: 'GB', label: 'United Kingdom' },
                        { value: 'CA', label: 'Canada' },
                        { value: 'AU', label: 'Australia' },
                        { value: 'GH', label: 'Ghana' },
                        { value: 'KE', label: 'Kenya' },
                        { value: 'ZA', label: 'South Africa' },
                      ]}
                      value={addressCountry}
                      onChange={(v) => { setAddressCountry(v); markDirty() }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Policies tab ── */}
          {tab === 'policies' && (
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 space-y-5">
              <div className="flex items-start gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-xs text-[#d97706] leading-relaxed">
                  Clear, honest policies build customer trust and reduce disputes. These are displayed on your public store page.
                </p>
              </div>

              <div>
                <label className={labelCls}>Shipping Policy</label>
                <textarea value={shippingPolicy} rows={6}
                  onChange={(e) => { setShippingPolicy(e.target.value); markDirty() }}
                  className={`${inputCls} resize-none`}/>
                <p className="text-xs text-[#9ca3af] mt-1.5">
                  Include processing time, carriers used, and estimated delivery windows
                </p>
              </div>

              <div>
                <label className={labelCls}>Return & Refund Policy</label>
                <textarea value={returnPolicy} rows={6}
                  onChange={(e) => { setReturnPolicy(e.target.value); markDirty() }}
                  className={`${inputCls} resize-none`}/>
                <p className="text-xs text-[#9ca3af] mt-1.5">
                  Specify the return window, item condition requirements, and how customers can initiate a return
                </p>
              </div>

              {/* Policy completeness */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <p className="text-xs font-semibold text-[#16a34a]">Both policies are set</p>
                </div>
                <p className="text-xs text-[#16a34a]">
                  Stores with clear policies see up to 23% fewer disputes and higher conversion rates.
                </p>
              </div>
            </div>
          )}

          {/* ── Social tab ── */}
          {tab === 'social' && (
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 space-y-5">
              <div>
                <p className="text-sm font-semibold text-[#111111] mb-1">Social Media Links</p>
                <p className="text-xs text-[#9ca3af]">
                  Add your social handles to appear on your storefront and build trust with customers
                </p>
              </div>

              {[
                {
                  label: 'Instagram', value: instagram, set: setInstagram,
                  placeholder: '@yourhandle or full URL',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="1.75"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                },
                {
                  label: 'Twitter / X', value: twitter, set: setTwitter,
                  placeholder: '@yourhandle',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.75"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>,
                },
                {
                  label: 'Facebook', value: facebook, set: setFacebook,
                  placeholder: 'Page name or full URL',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1877f2" strokeWidth="1.75"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
                },
                {
                  label: 'TikTok', value: tiktok, set: setTiktok,
                  placeholder: '@yourhandle',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.75"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>,
                },
                {
                  label: 'YouTube', value: youtube, set: setYoutube,
                  placeholder: 'Channel URL',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="1.75"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
                },
              ].map((s) => (
                <div key={s.label}>
                  <label className={labelCls}>{s.label}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{s.icon}</span>
                    <input value={s.value}
                      onChange={(e) => { s.set(e.target.value); markDirty() }}
                      placeholder={s.placeholder}
                      className={`${inputCls} pl-10`}/>
                    {s.value && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4">

          {/* Live store preview */}
          <div className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f5f5f4]">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Store Preview</p>
            </div>
            {/* Mini banner */}
            <div className="h-20 bg-[#f5f5f4] relative">
              {banner && (
                <Image src={banner} alt="" fill className="object-cover"
                  style={{ objectPosition: `${bannerPosition.x}% ${bannerPosition.y}%` }} />
              )}
            </div>
            {/* Logo + info */}
            <div className="px-4 pb-4 pt-0">
              <div className="w-14 h-14 rounded-xl bg-white border-2 border-white shadow-md -mt-7 mb-3 overflow-hidden relative">
                {logo
                  ? <Image src={logo} alt="" fill className="object-cover"/>
                  : <div className="absolute inset-0 bg-[#f5f5f4] flex items-center justify-center text-xl">🏪</div>
                }
              </div>
              <p className="text-sm font-bold text-[#111111] leading-tight">
                {storeName || 'Your Store Name'}
              </p>
              <p className="text-xs text-[#9ca3af] mt-0.5 line-clamp-2">
                {tagline || 'Your store tagline appears here'}
              </p>
              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24"
                      fill={i < Math.round(vendor.rating) ? '#f59e0b' : 'none'}
                      stroke="#f59e0b" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-[#9ca3af]">
                  {vendor.rating} ({vendor.reviewCount} reviews)
                </span>
              </div>
              <Link href={`/vendors/${vendor.storeSlug}`}
                className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium border border-[#e5e5e5] py-2 rounded-xl hover:bg-[#f5f5f4] transition-colors text-[#6b6b6b]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                View public storefront
              </Link>
            </div>
          </div>

          {/* Store health */}
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">
              Profile Completeness
            </p>
            {[
              { label: 'Store name',     done: !!storeName },
              { label: 'Tagline',        done: !!tagline },
              { label: 'Description',    done: description.length > 50 },
              { label: 'Logo',           done: !!logo },
              { label: 'Banner',         done: !!banner },
              { label: 'Email',          done: !!email },
              { label: 'Shipping policy',done: shippingPolicy.length > 20 },
              { label: 'Return policy',  done: returnPolicy.length > 20 },
              { label: 'Social link',    done: !!(instagram || twitter || facebook) },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 mb-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  item.done ? 'bg-[#16a34a]' : 'bg-[#f5f5f4]'
                }`}>
                  {item.done && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${item.done ? 'text-[#6b6b6b]' : 'text-[#9ca3af]'}`}>
                  {item.label}
                </span>
              </div>
            ))}
            {/* Progress bar */}
            {(() => {
              const items = [!!storeName, !!tagline, description.length > 50, !!logo, !!banner, !!email, shippingPolicy.length > 20, returnPolicy.length > 20, !!(instagram || twitter || facebook)]
              const done  = items.filter(Boolean).length
              const pct   = Math.round((done / items.length) * 100)
              return (
                <div className="mt-3 pt-3 border-t border-[#f5f5f4]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#9ca3af]">Profile strength</span>
                    <span className={`font-semibold ${pct === 100 ? 'text-[#16a34a]' : pct >= 70 ? 'text-[#d97706]' : 'text-[#dc2626]'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#f5f5f4] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct === 100 ? '#16a34a' : pct >= 70 ? '#d97706' : '#dc2626',
                      }}/>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Current plan */}
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Current Plan</p>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: plan.bg, color: plan.color }}>
                {plan.label}
              </span>
            </div>
            <div className="space-y-1.5 mb-4">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-xs text-[#6b6b6b]">{f}</span>
                </div>
              ))}
            </div>
            {vendor.plan !== 'enterprise' && (
              <Link href="/vendor/settings?tab=billing"
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#111111] text-white py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors">
                Upgrade plan →
              </Link>
            )}
          </div>

          {/* Store stats */}
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Store Stats</p>
            <div className="space-y-2.5">
              {[
                { label: 'Products listed', value: vendor.productCount },
                { label: 'Total sales',      value: vendor.totalSales.toLocaleString() },
                { label: 'Total revenue',    value: `₦${vendor.totalRevenue.toLocaleString()}` },
                { label: 'Store rating',     value: `${vendor.rating} ★ (${vendor.reviewCount})` },
                { label: 'Member since',     value: new Date(vendor.joinedAt).toLocaleDateString('en', { month: 'short', year: 'numeric' }) },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#9ca3af]">{s.label}</span>
                  <span className="text-xs font-semibold text-[#111111]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>

    {bannerModalOpen && (
      <BannerPositionModal
        src={pendingBannerSrc}
        initialPosition={bannerPosition}
        onConfirm={(pos) => {
          setBanner(pendingBannerSrc)
          setBannerPosition(pos)
          setBannerModalOpen(false)
          markDirty()
        }}
        onClose={() => setBannerModalOpen(false)}
      />
    )}
    </>
  )
}

function BannerPositionModal({
  src,
  initialPosition,
  onConfirm,
  onClose,
}: {
  src: string
  initialPosition: { x: number; y: number }
  onConfirm: (pos: { x: number; y: number }) => void
  onClose: () => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initialPosition)
  const dragging = useRef(false)
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current || !frameRef.current) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const { width, height } = frameRef.current.getBoundingClientRect()
      const dx = clientX - dragStart.current.mx
      const dy = clientY - dragStart.current.my
      setPosition({
        x: Math.max(0, Math.min(100, dragStart.current.px - (dx / width)  * 100)),
        y: Math.max(0, Math.min(100, dragStart.current.py - (dy / height) * 100)),
      })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend',  onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend',  onUp)
    }
  }, [])

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragStart.current = { mx: clientX, my: clientY, px: position.x, py: position.y }
    e.preventDefault()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5e5]">
          <div>
            <h2 className="font-semibold text-[#111111]">Position Banner</h2>
            <p className="text-xs text-[#9ca3af] mt-0.5">Drag the image to choose what's in frame</p>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#111111] transition-colors p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Drag area */}
        <div className="p-5">
          <div
            ref={frameRef}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className="relative w-full h-44 overflow-hidden rounded-xl cursor-grab active:cursor-grabbing select-none bg-[#f5f5f4]"
            style={{ touchAction: 'none' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Banner"
              draggable={false}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ objectFit: 'cover', objectPosition: `${position.x}% ${position.y}%` }}
            />
            {/* Drag hint overlay — fades out after first drag */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-2 bg-black/40 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
                </svg>
                Drag to reposition
              </div>
            </div>
          </div>

          {/* Coordinates display */}
          <p className="text-xs text-[#9ca3af] text-right mt-2">
            Position: {Math.round(position.x)}% × {Math.round(position.y)}%
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-sm font-medium text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(position)}
            className="flex-1 py-2.5 bg-[#111111] text-white rounded-xl text-sm font-semibold hover:bg-[#2a2a2a] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}