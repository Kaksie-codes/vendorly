// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/register/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link        from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })
  const [showPwd,  setShowPwd]  = useState(false)
  const [agreed,   setAgreed]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState<Record<string, string>>({})
  const [done,     setDone]     = useState(false)

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 8) e.password = 'Min 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!agreed) e.agreed = 'You must agree to continue'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 py-12 text-center">
        <Link href="/" className="font-serif text-3xl font-bold text-[#111111] mb-10">Vendorly</Link>
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#e5e5e5] shadow-sm p-10 flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#111111]">You're in, {form.firstName}!</h1>
            <p className="text-sm text-[#9ca3af] mt-1">Your account has been created. Start shopping or set up your store.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button onClick={() => router.push('/')} className="flex-1 py-3 bg-[#111111] text-white font-semibold text-sm rounded-xl hover:bg-[#2a2a2a] transition-all active:scale-[0.98]">
              Start Shopping
            </button>
            <button onClick={() => router.push('/vendor/register')} className="flex-1 py-3 border border-[#e5e5e5] text-[#111111] font-semibold text-sm rounded-xl hover:bg-[#fafaf9] transition-all">
              Become a Seller
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="font-serif text-3xl font-bold text-[#111111] mb-10 hover:opacity-80 transition-opacity">
        Vendorly
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-[#e5e5e5] shadow-sm p-8">
          <h1 className="font-serif text-2xl font-bold text-[#111111] mb-1">Create your account</h1>
          <p className="text-sm text-[#9ca3af] mb-6">
            One account for shopping and selling. Already have one?{' '}
            <Link href="/login" className="text-[#c8a951] font-semibold hover:underline">Sign in</Link>
          </p>

          {/* Social signup */}
          <div className="flex flex-col gap-3 mb-6">
            {[
              { label: 'Sign up with Google',   icon: '🔵' },
              { label: 'Sign up with Facebook', icon: '🔷' },
            ].map((s) => (
              <button key={s.label} className="flex items-center justify-center gap-3 w-full py-2.5 border border-[#e5e5e5] rounded-xl text-sm font-medium text-[#6b6b6b] hover:bg-[#fafaf9] hover:border-[#d1d5db] transition-all">
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#f5f5f4]" />
            <span className="text-xs text-[#d1d5db] font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#f5f5f4]" />
          </div>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" value={form.firstName} onChange={(v) => update('firstName', v)} error={errors.firstName} />
              <FormField label="Last Name"  value={form.lastName}  onChange={(v) => update('lastName', v)}  error={errors.lastName} />
            </div>

            <FormField label="Email" value={form.email} onChange={(v) => update('email', v)} type="email" error={errors.email} placeholder="you@example.com" />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`w-full px-4 py-3 pr-11 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white ${errors.password ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e5e5e5] focus:border-[#c8a951]'}`}
                />
                <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b6b6b]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#dc2626]">{errors.password}</p>}

              {/* Password strength */}
              {form.password && (
                <div className="flex gap-1 mt-1">
                  {[8, 12, 16].map((len, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all ${form.password.length >= len ? i === 0 ? 'bg-[#dc2626]' : i === 1 ? 'bg-[#d97706]' : 'bg-[#16a34a]' : 'bg-[#f5f5f4]'}`} />
                  ))}
                  <span className="text-[0.6rem] text-[#9ca3af] ml-1">{form.password.length < 8 ? 'Weak' : form.password.length < 12 ? 'Fair' : 'Strong'}</span>
                </div>
              )}
            </div>

            <FormField label="Confirm Password" value={form.confirmPassword} onChange={(v) => update('confirmPassword', v)} type="password" error={errors.confirmPassword} placeholder="Re-enter password" />

            {/* Agreement */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setErrors((er) => ({ ...er, agreed: '' })) }} className="mt-0.5 accent-[#c8a951]" />
                <span className="text-sm text-[#6b6b6b]">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#c8a951] hover:underline">Terms of Service</Link>{' '}and{' '}
                  <Link href="/privacy" className="text-[#c8a951] hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-[#dc2626] mt-1 ml-6">{errors.agreed}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-[#111111] text-white font-semibold text-sm rounded-xl hover:bg-[#2a2a2a] disabled:opacity-60 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/></svg>}
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </div>

          <p className="text-center text-xs text-[#9ca3af] mt-4">
            Want to sell?{' '}
            <Link href="/vendor/register" className="text-[#c8a951] font-medium hover:underline">Apply to become a seller</Link>
            {' '}after signing up.
          </p>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, type = 'text', error, placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; error?: string; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white ${error ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e5e5e5] focus:border-[#c8a951]'}`}
      />
      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
    </div>
  )
}