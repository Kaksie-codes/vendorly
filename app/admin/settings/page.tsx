// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/settings/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'

type Tab = 'general' | 'plans' | 'fees' | 'notifications' | 'security'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'general',       label: 'General',        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  { id: 'plans',         label: 'Plans & Pricing', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { id: 'fees',          label: 'Commission Fees', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'notifications', label: 'Email Templates', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  { id: 'security',      label: 'Security',        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
]

export default function AdminSettingsPage() {
  const [tab,   setTab]   = useState<Tab>('general')
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  // General
  const [general, setGeneral] = useState({
    platformName: 'Vendorly',
    supportEmail: 'support@vendorly.com',
    helpEmail:    'help@vendorly.com',
    currency:     'NGN',
    timezone:     'Africa/Lagos',
    maintenanceMode: false,
    newRegistrations: true,
    newVendorSignups: true,
  })

  // Fees
  const [fees, setFees] = useState({
    platformFeePercent: '10',
    paymentProcessing:  '1.5',
    minWithdrawal:      '5000',
    payoutFrequency:    'weekly',
    payoutDelay:        '7',
  })

  // Plans
  const PLANS = [
    { id: 'free',       name: 'Free',       price: '0',    fee: '15', products: '10',   features: 'Basic listings, Email support' },
    { id: 'basic',      name: 'Basic',      price: '2500', fee: '12', products: '100',  features: 'Analytics, Priority support' },
    { id: 'pro',        name: 'Pro',        price: '7500', fee: '10', products: '1000', features: 'Full analytics, Coupons, API access' },
    { id: 'enterprise', name: 'Enterprise', price: '0',    fee: '8',  products: '∞',    features: 'Custom terms, Dedicated support' },
  ]

  // Notifications
  const EMAIL_TEMPLATES = [
    { id: 'welcome_vendor',    label: 'Vendor Welcome Email',   enabled: true },
    { id: 'order_placed',      label: 'Order Placed (vendor)',  enabled: true },
    { id: 'payout_processed',  label: 'Payout Processed',       enabled: true },
    { id: 'vendor_approved',   label: 'Vendor Approved',        enabled: true },
    { id: 'vendor_rejected',   label: 'Vendor Rejected',        enabled: true },
    { id: 'product_flagged',   label: 'Product Flagged',        enabled: false },
    { id: 'weekly_report',     label: 'Weekly Admin Report',    enabled: true },
    { id: 'low_stock_alert',   label: 'Low Stock Alert',        enabled: false },
  ]
  const [templates, setTemplates] = useState<Record<string, boolean>>(
    Object.fromEntries(EMAIL_TEMPLATES.map((t) => [t.id, t.enabled]))
  )

  return (
    <div className="p-6 lg:p-8 max-w-[1000px]">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-[1.75rem] font-bold text-[#111111]">Platform Settings</h1>
        <p className="text-sm text-[#9ca3af] mt-0.5">Configure Vendorly platform-wide behaviour</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-7">

        {/* Sidebar */}
        <aside className="flex lg:flex-col gap-1 shrink-0 lg:w-48 overflow-x-auto lg:overflow-visible">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all text-left shrink-0 ${tab === t.id ? 'bg-[#111111] text-white' : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]'}`}>
              <span className={tab === t.id ? 'text-[#ef4444]' : 'text-[#9ca3af]'}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* ── GENERAL ── */}
          {tab === 'general' && (
            <>
              <Card title="Platform Identity">
                <div className="grid sm:grid-cols-2 gap-4">
                  <F label="Platform Name" value={general.platformName} onChange={(v) => setGeneral((s) => ({ ...s, platformName: v }))} span />
                  <F label="Support Email"  value={general.supportEmail} onChange={(v) => setGeneral((s) => ({ ...s, supportEmail: v }))} type="email" />
                  <F label="Help Email"     value={general.helpEmail}    onChange={(v) => setGeneral((s) => ({ ...s, helpEmail: v }))}    type="email" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Default Currency</label>
                    <select value={general.currency} onChange={(e) => setGeneral((s) => ({ ...s, currency: e.target.value }))}
                      className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white">
                      <option value="NGN">NGN — Nigerian Naira</option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="GBP">GBP — British Pound</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Timezone</label>
                    <select value={general.timezone} onChange={(e) => setGeneral((s) => ({ ...s, timezone: e.target.value }))}
                      className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white">
                      <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (ET)</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card title="Platform Controls">
                <div className="divide-y divide-[#f5f5f4]">
                  {[
                    { key: 'newRegistrations' as const, label: 'Allow New Customer Registrations', sub: 'Let new customers create accounts on the platform' },
                    { key: 'newVendorSignups'  as const, label: 'Allow New Vendor Sign-ups',         sub: 'Let new vendors apply to sell on Vendorly' },
                    { key: 'maintenanceMode'   as const, label: 'Maintenance Mode',                  sub: 'Take the storefront offline for maintenance (admins can still log in)' },
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="pr-4">
                        <p className="text-sm font-medium text-[#111111]">{label}</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">{sub}</p>
                      </div>
                      <Toggle
                        checked={general[key]}
                        onChange={(v) => setGeneral((s) => ({ ...s, [key]: v }))}
                        danger={key === 'maintenanceMode'}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <SaveBar saved={saved} onSave={save} />
            </>
          )}

          {/* ── PLANS ── */}
          {tab === 'plans' && (
            <>
              <Card title="Vendor Plans">
                <div className="flex flex-col gap-3">
                  {PLANS.map((plan) => (
                    <div key={plan.id} className="p-4 rounded-2xl border border-[#e5e5e5] bg-[#fafaf9]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            plan.id === 'free' ? 'bg-[#f5f5f4] text-[#9ca3af]' :
                            plan.id === 'basic' ? 'bg-[#dbeafe] text-[#2563eb]' :
                            plan.id === 'pro' ? 'bg-[#ede9fe] text-[#7c3aed]' :
                            'bg-[#fef3c7] text-[#d97706]'
                          }`}>{plan.name}</span>
                          <p className="text-xs text-[#9ca3af]">{plan.features}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[0.6rem] font-semibold uppercase tracking-wider text-[#9ca3af]">Monthly Fee (₦)</label>
                          <div className="flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden bg-white">
                            <span className="px-2 py-1.5 text-xs text-[#9ca3af] bg-[#f5f5f4] border-r border-[#e5e5e5]">₦</span>
                            <input type="number" defaultValue={plan.price} className="flex-1 px-2 py-1.5 text-xs focus:outline-none bg-white" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[0.6rem] font-semibold uppercase tracking-wider text-[#9ca3af]">Commission (%)</label>
                          <div className="flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden bg-white">
                            <input type="number" defaultValue={plan.fee} className="flex-1 px-2 py-1.5 text-xs focus:outline-none bg-white text-right" />
                            <span className="px-2 py-1.5 text-xs text-[#9ca3af] bg-[#f5f5f4] border-l border-[#e5e5e5]">%</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[0.6rem] font-semibold uppercase tracking-wider text-[#9ca3af]">Max Products</label>
                          <input type="text" defaultValue={plan.products} className="px-2 py-1.5 text-xs border border-[#e5e5e5] rounded-lg focus:outline-none bg-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <SaveBar saved={saved} onSave={save} />
            </>
          )}

          {/* ── FEES ── */}
          {tab === 'fees' && (
            <>
              <Card title="Commission & Fee Structure">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Platform Fee (%)</label>
                    <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
                      <input type="number" value={fees.platformFeePercent}
                        onChange={(e) => setFees((f) => ({ ...f, platformFeePercent: e.target.value }))}
                        className="flex-1 px-3 py-2.5 text-sm focus:outline-none text-right" />
                      <span className="px-3 py-2.5 text-sm text-[#9ca3af] bg-[#f5f5f4] border-l border-[#e5e5e5]">%</span>
                    </div>
                    <p className="text-xs text-[#9ca3af]">Taken from each transaction before vendor payout</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Payment Processing (%)</label>
                    <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
                      <input type="number" value={fees.paymentProcessing}
                        onChange={(e) => setFees((f) => ({ ...f, paymentProcessing: e.target.value }))}
                        className="flex-1 px-3 py-2.5 text-sm focus:outline-none text-right" />
                      <span className="px-3 py-2.5 text-sm text-[#9ca3af] bg-[#f5f5f4] border-l border-[#e5e5e5]">%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Payout Configuration">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Minimum Withdrawal (₦)</label>
                    <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
                      <span className="px-3 py-2.5 text-sm text-[#9ca3af] bg-[#f5f5f4] border-r border-[#e5e5e5]">₦</span>
                      <input type="number" value={fees.minWithdrawal}
                        onChange={(e) => setFees((f) => ({ ...f, minWithdrawal: e.target.value }))}
                        className="flex-1 px-3 py-2.5 text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Payout Delay (days)</label>
                    <input type="number" value={fees.payoutDelay}
                      onChange={(e) => setFees((f) => ({ ...f, payoutDelay: e.target.value }))}
                      className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] bg-white" />
                    <p className="text-xs text-[#9ca3af]">Days after order delivery before vendor can withdraw</p>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Default Payout Frequency</label>
                    <div className="flex gap-3">
                      {['daily', 'weekly', 'biweekly', 'monthly'].map((freq) => (
                        <label key={freq} className="flex items-center gap-2 cursor-pointer">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${fees.payoutFrequency === freq ? 'border-[#ef4444]' : 'border-[#d1d5db]'}`}>
                            {fees.payoutFrequency === freq && <div className="w-2 h-2 rounded-full bg-[#ef4444]" />}
                          </div>
                          <span className="text-sm font-medium text-[#111111] capitalize">{freq}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              <SaveBar saved={saved} onSave={save} />
            </>
          )}

          {/* ── EMAIL TEMPLATES ── */}
          {tab === 'notifications' && (
            <>
              <Card title="Automated Email Triggers">
                <div className="divide-y divide-[#f5f5f4]">
                  {EMAIL_TEMPLATES.map(({ id, label }) => (
                    <div key={id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#f5f5f4] flex items-center justify-center">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        </div>
                        <p className="text-sm font-medium text-[#111111]">{label}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-xs text-[#ef4444] hover:underline font-medium">Edit</button>
                        <Toggle checked={templates[id]} onChange={(v) => setTemplates((t) => ({ ...t, [id]: v }))} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <SaveBar saved={saved} onSave={save} />
            </>
          )}

          {/* ── SECURITY ── */}
          {tab === 'security' && (
            <>
              <Card title="Admin Access">
                <div className="flex flex-col gap-4 max-w-sm">
                  <F label="Current Password" value="" onChange={() => {}} type="password" />
                  <F label="New Password"      value="" onChange={() => {}} type="password" />
                  <F label="Confirm Password"  value="" onChange={() => {}} type="password" />
                </div>
                <button className="px-5 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-[#2a2a2a] transition-colors">
                  Update Password
                </button>
              </Card>

              <Card title="Two-Factor Authentication">
                <div className="flex items-center justify-between p-4 bg-[#fafaf9] rounded-xl border border-[#e5e5e5]">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">Require 2FA for Admins</p>
                    <p className="text-xs text-[#9ca3af] mt-0.5">All admin accounts must enable two-factor authentication</p>
                  </div>
                  <Toggle checked={true} onChange={() => {}} />
                </div>
              </Card>

              <Card title="Audit Log">
                <div className="divide-y divide-[#f5f5f4]">
                  {[
                    { action: 'Vendor approved',    target: 'Sakura Studio',      time: '2 hours ago',  admin: 'Admin User' },
                    { action: 'Payout processed',   target: 'Crafted & Co.',      time: '5 hours ago',  admin: 'Admin User' },
                    { action: 'User suspended',      target: 'user@example.com',  time: 'Yesterday',    admin: 'Admin User' },
                    { action: 'Platform fee updated', target: '10% → 10%',         time: '3 days ago',   admin: 'Admin User' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-[#ef4444] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111111]">{log.action}</p>
                        <p className="text-xs text-[#9ca3af]">{log.target} · {log.admin}</p>
                      </div>
                      <p className="text-xs text-[#9ca3af] shrink-0">{log.time}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Danger Zone">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-4 bg-[#fff1f2] border border-[#fecdd3] rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-[#dc2626]">Clear All Sessions</p>
                      <p className="text-xs text-[#fca5a5] mt-0.5">Force all admin users to log in again</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-semibold text-[#dc2626] border border-[#fca5a5] rounded-xl hover:bg-[#fee2e2] transition-colors">
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#fff1f2] border border-[#fecdd3] rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-[#dc2626]">Enable Maintenance Mode</p>
                      <p className="text-xs text-[#fca5a5] mt-0.5">Take the public storefront offline immediately</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-semibold text-[#dc2626] border border-[#fca5a5] rounded-xl hover:bg-[#fee2e2] transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 sm:p-6 flex flex-col gap-4">
      <h2 className="font-semibold text-[#111111] text-base pb-3 border-b border-[#f5f5f4]">{title}</h2>
      {children}
    </div>
  )
}

function F({ label, value, onChange, type = 'text', span, placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; span?: boolean; placeholder?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${span ? 'sm:col-span-2' : ''}`}>
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/10 transition bg-white" />
    </div>
  )
}

function Toggle({ checked, onChange, danger }: { checked: boolean; onChange: (v: boolean) => void; danger?: boolean }) {
  const activeColor = danger ? 'bg-[#ef4444]' : 'bg-[#111111]'
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? activeColor : 'bg-[#e5e5e5]'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  )
}

function SaveBar({ saved, onSave }: { saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onSave}
        className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] ${saved ? 'bg-[#16a34a] text-white' : 'bg-[#111111] text-white hover:bg-[#2a2a2a]'}`}>
        {saved ? '✓ Saved' : 'Save Changes'}
      </button>
      {saved && <p className="text-xs text-[#16a34a] font-medium">Settings saved successfully.</p>}
    </div>
  )
}