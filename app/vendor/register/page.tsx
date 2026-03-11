// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/register/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link  from 'next/link'
import Image from 'next/image'

type Step = 'account' | 'store' | 'details' | 'plan' | 'done'
const STEPS: Step[] = ['account', 'store', 'details', 'plan', 'done']
const STEP_LABELS: Record<Step, string> = {
  account: 'Account',
  store:   'Store Info',
  details: 'Details',
  plan:    'Choose Plan',
  done:    'Done',
}

const PLANS = [
  {
    id:       'free',
    name:     'Starter',
    price:    'Free',
    sub:      'Forever free',
    features: ['Up to 10 products', 'Basic analytics', 'Standard support', '5% commission'],
    highlight: false,
  },
  {
    id:       'basic',
    name:     'Basic',
    price:    '₦5,000',
    sub:      'per month',
    features: ['Up to 50 products', 'Advanced analytics', 'Priority support', '3% commission', 'Promoted listings'],
    highlight: false,
  },
  {
    id:       'pro',
    name:     'Pro',
    price:    '₦15,000',
    sub:      'per month',
    features: ['Unlimited products', 'Full analytics suite', 'Dedicated support', '2% commission', 'Featured store badge', 'Custom store URL'],
    highlight: true,
  },
  {
    id:       'enterprise',
    name:     'Enterprise',
    price:    'Custom',
    sub:      'contact us',
    features: ['Everything in Pro', 'API access', 'White-label options', '0% commission', 'Account manager', 'SLA guarantee'],
    highlight: false,
  },
]

export default function VendorRegisterPage() {
  const [step,       setStep]       = useState<Step>('account')
  const [plan,       setPlan]       = useState('pro')
  const [agreed,     setAgreed]     = useState(false)

  // Form state
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    storeName: '', storeSlug: '', tagline: '',
    description: '', phone: '', website: '',
    city: '', state: '', country: 'NG',
    category1: '', category2: '',
    logo: null as File | null,
  })

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const stepIdx = STEPS.indexOf(step)
  const goNext  = () => step !== 'done' && setStep(STEPS[stepIdx + 1])
  const goBack  = () => stepIdx > 0 && setStep(STEPS[stepIdx - 1])

  const isLastForm = step === 'plan'

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col">
      {/* Top nav */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#e5e5e5]">
        <Link href="/" className="font-serif text-xl font-bold text-[#111111]">Vendorly</Link>
        <p className="text-sm text-[#9ca3af]">Already have an account? <Link href="/account" className="text-[#c8a951] font-medium">Sign in</Link></p>
      </div>

      <div className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-2xl">

          {/* Progress */}
          {step !== 'done' && (
            <div className="flex items-center gap-0 mb-10">
              {STEPS.filter((s) => s !== 'done').map((s, i) => {
                const done    = i < stepIdx
                const current = s === step
                return (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={[
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                        done    ? 'bg-[#16a34a] text-white' :
                        current ? 'bg-[#111111] text-white' :
                                  'bg-[#f5f5f4] text-[#9ca3af]',
                      ].join(' ')}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className={`text-[0.65rem] font-medium hidden sm:block ${current ? 'text-[#111111]' : 'text-[#9ca3af]'}`}>
                        {STEP_LABELS[s]}
                      </span>
                    </div>
                    {i < 3 && <div className={`flex-1 h-px mx-2 mb-5 ${done ? 'bg-[#16a34a]' : 'bg-[#e5e5e5]'}`} />}
                  </React.Fragment>
                )
              })}
            </div>
          )}

          {/* ── Step: Account ─────────────────────────────────────────── */}
          {step === 'account' && (
            <Card title="Create your account" subtitle="Set up your seller account to get started">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First Name"  value={form.firstName}       onChange={(v) => update('firstName', v)} />
                <Field label="Last Name"   value={form.lastName}        onChange={(v) => update('lastName', v)} />
                <Field label="Email"       value={form.email}           onChange={(v) => update('email', v)}       type="email" span />
                <Field label="Password"    value={form.password}        onChange={(v) => update('password', v)}    type="password" />
                <Field label="Confirm Password" value={form.confirmPassword} onChange={(v) => update('confirmPassword', v)} type="password" />
              </div>
              <label className="flex items-start gap-2.5 mt-2 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-[#c8a951]" />
                <span className="text-sm text-[#6b6b6b]">
                  I agree to the <Link href="/terms" className="text-[#c8a951] hover:underline">Terms of Service</Link> and{' '}
                  <Link href="/privacy" className="text-[#c8a951] hover:underline">Privacy Policy</Link>
                </span>
              </label>
              <StepButtons onNext={goNext} nextLabel="Continue" nextDisabled={!form.firstName || !form.email || !form.password || !agreed} />
            </Card>
          )}

          {/* ── Step: Store Info ──────────────────────────────────────── */}
          {step === 'store' && (
            <Card title="Set up your store" subtitle="Create your brand identity on Vendorly">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Store Name" value={form.storeName} onChange={(v) => { update('storeName', v); update('storeSlug', v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) }} span />
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Store URL</label>
                  <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden focus-within:border-[#c8a951]">
                    <span className="px-3 py-2.5 bg-[#f5f5f4] text-xs text-[#9ca3af] border-r border-[#e5e5e5] whitespace-nowrap">vendorly.com/vendors/</span>
                    <input
                      type="text"
                      value={form.storeSlug}
                      onChange={(e) => update('storeSlug', e.target.value)}
                      className="flex-1 px-3 py-2.5 text-sm bg-white focus:outline-none"
                    />
                  </div>
                </div>
                <Field label="Tagline (optional)" value={form.tagline} onChange={(v) => update('tagline', v)} span placeholder="e.g. Handcrafted goods for modern living" />
              </div>

              {/* Logo upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Store Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f5f4] border-2 border-dashed border-[#e5e5e5] flex items-center justify-center text-[#9ca3af] overflow-hidden">
                    {form.logo
                      ? <Image src={URL.createObjectURL(form.logo)} alt="logo" width={64} height={64} className="object-cover w-full h-full" />
                      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    }
                  </div>
                  <label className="cursor-pointer px-4 py-2 text-sm font-medium border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f4] transition-colors">
                    Upload Logo
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setForm((f) => ({ ...f, logo: e.target.files?.[0] ?? null }))} />
                  </label>
                </div>
              </div>

              <StepButtons onBack={goBack} onNext={goNext} nextLabel="Continue" nextDisabled={!form.storeName} />
            </Card>
          )}

          {/* ── Step: Details ─────────────────────────────────────────── */}
          {step === 'details' && (
            <Card title="Store details" subtitle="Help customers find and trust your store">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Store Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={4}
                    placeholder="Tell customers about your store, what you sell, and what makes you special…"
                    className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#c8a951] bg-white"
                  />
                </div>
                <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} type="tel" />
                <Field label="Website (optional)" value={form.website} onChange={(v) => update('website', v)} type="url" placeholder="https://" />
                <Field label="City"  value={form.city}  onChange={(v) => update('city', v)} />
                <Field label="State" value={form.state} onChange={(v) => update('state', v)} />
              </div>

              <StepButtons onBack={goBack} onNext={goNext} nextLabel="Continue" nextDisabled={!form.description} />
            </Card>
          )}

          {/* ── Step: Plan ────────────────────────────────────────────── */}
          {step === 'plan' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl font-bold text-[#111111]">Choose your plan</h2>
                <p className="text-sm text-[#9ca3af] mt-1">Start free, upgrade anytime</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={[
                      'relative flex flex-col gap-3 p-5 rounded-2xl border text-left transition-all',
                      plan === p.id
                        ? 'border-[#c8a951] bg-[#f7f1e3] shadow-[0_0_0_2px_#c8a951]'
                        : 'border-[#e5e5e5] bg-white hover:border-[#c8a951]/50',
                    ].join(' ')}
                  >
                    {p.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c8a951] text-white text-[0.6rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#111111]">{p.name}</p>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="font-serif text-2xl font-bold text-[#111111]">{p.price}</span>
                          {p.sub !== 'contact us' && <span className="text-xs text-[#9ca3af]">{p.sub}</span>}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${plan === p.id ? 'border-[#c8a951] bg-[#c8a951]' : 'border-[#e5e5e5]'}`}>
                        {plan === p.id && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-[#6b6b6b]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <StepButtons onBack={goBack} onNext={goNext} nextLabel="Create My Store" />
            </div>
          )}

          {/* ── Done ─────────────────────────────────────────────────── */}
          {step === 'done' && (
            <div className="flex flex-col items-center gap-6 text-center py-8">
              <div className="w-20 h-20 rounded-full bg-[#dcfce7] flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#111111]">You're all set!</h2>
                <p className="text-[#6b6b6b] mt-2 max-w-sm">
                  Welcome to Vendorly, <span className="font-semibold">{form.storeName || 'your store'}</span>. Your seller account is being reviewed and will be live within 24 hours.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/vendor/dashboard" className="px-6 py-3 bg-[#111111] text-white text-sm font-medium rounded-xl hover:bg-[#2a2a2a] transition-colors">
                  Go to Dashboard
                </Link>
                <Link href="/vendor/products" className="px-6 py-3 border border-[#e5e5e5] text-[#111111] text-sm font-medium rounded-xl hover:bg-[#f5f5f4] transition-colors">
                  Add First Product
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-[#111111]">{title}</h2>
      <p className="text-sm text-[#9ca3af] mt-1 mb-6">{subtitle}</p>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', span, placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; span?: boolean; placeholder?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${span ? 'sm:col-span-2' : ''}`}>
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 bg-white transition"
      />
    </div>
  )
}

function StepButtons({ onBack, onNext, nextLabel, nextDisabled = false }: {
  onBack?: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button onClick={onBack} className="px-5 py-2.5 text-sm font-medium border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f4] transition-colors">
          ← Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 bg-[#111111] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {nextLabel}
      </button>
    </div>
  )
}