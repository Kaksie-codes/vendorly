'use client'

// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/register/page.tsx
// -----------------------------------------------------------------------------

import React, { useState } from 'react'
import Link                from 'next/link'
import { useRouter }       from 'next/navigation'
import { z }               from 'zod'
import { useAuthStore }    from '@/store/authStore'
import { apiClient }       from '@/lib/api/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'

// ─── Zod schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  firstName:       z.string().min(1, 'First name is required'),
  lastName:        z.string().min(1, 'Last name is required'),
  email:           z.string().email('Please enter a valid email address'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})

type Fields   = z.infer<typeof schema>
type FormErrors = Partial<Record<keyof Fields, string>>

// ─── Provider SVGs ────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// ─── Password strength ────────────────────────────────────────────────────────
function strengthLevel(pwd: string): { level: number; label: string; color: string } {
  if (pwd.length === 0)  return { level: 0, label: '',       color: '' }
  if (pwd.length < 8)    return { level: 1, label: 'Weak',   color: '#ef4444' }
  if (pwd.length < 12)   return { level: 2, label: 'Fair',   color: '#f59e0b' }
  if (pwd.length < 16)   return { level: 3, label: 'Good',   color: '#10b981' }
  return                        { level: 4, label: 'Strong', color: '#059669' }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState<Omit<Fields, never>>({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })
  const [showPwd,  setShowPwd]  = useState(false)
  const [agreed,   setAgreed]   = useState(false)
  const [errors,   setErrors]   = useState<FormErrors>({})
  const [apiError, setApiError] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!agreed) {
      setErrors((er) => ({ ...er, confirmPassword: 'You must agree to the Terms of Service to continue' }))
      return
    }

    const result = schema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors
        if (!fieldErrors[field]) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    try {
      setLoading(true)
      const res = await apiClient.post<{ data: { token: string; user: any } }>(
        '/auth/register',
        { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password },
      )
      setAuth(res.data.user, res.data.token)
      setDone(true)
    } catch (err: any) {
      setApiError(err.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">You&apos;re in, {form.firstName}!</h1>
            <p className="text-sm text-[#6b7280] mt-1">Your account is ready. Start shopping or set up your store.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button onClick={() => router.push('/account')} className="flex-1 py-3 bg-[#111827] text-white font-semibold text-sm rounded-xl hover:bg-[#1f2937] transition-all active:scale-[0.99]">
              Go to Account
            </button>
            <button onClick={() => router.push('/vendor/register')} className="flex-1 py-3 border border-[#e5e7eb] text-[#111827] font-semibold text-sm rounded-xl hover:bg-[#f9fafb] transition-all">
              Become a Seller
            </button>
          </div>
        </div>
      </div>
    )
  }

  const strength = strengthLevel(form.password)

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[44%] xl:w-[42%] bg-[#0c0c0c] flex-col relative overflow-hidden shrink-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#c8a951] opacity-[0.06] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#c8a951] opacity-[0.06] rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex flex-col leading-none group w-fit">
            <span className="font-serif text-xl font-bold text-white group-hover:text-[#c8a951] transition-colors">Vendorly</span>
            <span className="text-[0.45rem] tracking-[0.35em] uppercase text-[#c8a951] mt-0.5">Marketplace</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#c8a951]/10 border border-[#c8a951]/20 flex items-center justify-center mb-8">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="1.75">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white leading-snug mb-4">
              Join 2 million<br />happy shoppers.
            </h2>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              Create a free account to start shopping, save wishlists, track orders, and more.
            </p>

            {/* Feature list */}
            <ul className="mt-8 flex flex-col gap-3">
              {[
                'Track your orders in real time',
                'Save items to your wishlist',
                'Manage multiple delivery addresses',
                'Become a seller in minutes',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[#9ca3af]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-[#4b5563] pt-8 border-t border-white/[0.06]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#c8a951] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[400px]">

          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center leading-none">
              <span className="font-serif text-2xl font-bold text-[#111827]">Vendorly</span>
              <span className="text-[0.45rem] tracking-[0.3em] uppercase text-[#c8a951] mt-0.5">Marketplace</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#111827] mb-1">Create your account</h1>
          <p className="text-[#6b7280] text-sm mb-8">
            Already have one?{' '}
            <Link href="/login" className="text-[#c8a951] font-semibold hover:underline">Sign in</Link>
          </p>

          {/* ── OAuth providers ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <a
              href={`${API_URL}/auth/google`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f9fafb] hover:border-[#d1d5db] transition-all col-span-2"
            >
              <GoogleIcon /> Sign up with Google
            </a>
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f9fafb] hover:border-[#d1d5db] transition-all">
              <GitHubIcon /> GitHub
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f9fafb] hover:border-[#d1d5db] transition-all">
              <FacebookIcon /> Facebook
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f9fafb] hover:border-[#d1d5db] transition-all col-span-2">
              <XIcon /> Sign up with X
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#f3f4f6]" />
            <span className="text-xs text-[#9ca3af] font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#f3f4f6]" />
          </div>

          {/* ── Form ─────────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {apiError && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-sm text-[#dc2626]">
                <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {apiError}
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" value={form.firstName} onChange={(v) => update('firstName', v)} error={errors.firstName} autoFocus />
              <Field label="Last Name"  value={form.lastName}  onChange={(v) => update('lastName', v)}  error={errors.lastName} />
            </div>

            <Field label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} error={errors.email} placeholder="you@example.com" />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`w-full px-4 py-3 pr-11 text-sm border rounded-xl outline-none transition bg-white placeholder:text-[#9ca3af]
                    focus:ring-2 focus:ring-[#c8a951]/20
                    ${errors.password ? 'border-[#ef4444] focus:border-[#ef4444]' : 'border-[#e5e7eb] focus:border-[#c8a951]'}`}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#ef4444]">{errors.password}</p>}

              {/* Strength bar */}
              {form.password && (
                <div className="flex items-center gap-1.5 mt-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ backgroundColor: i <= strength.level ? strength.color : '#f3f4f6' }} />
                  ))}
                  <span className="text-[0.6rem] ml-1 font-medium" style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            <Field label="Confirm Password" type="password" value={form.confirmPassword} onChange={(v) => update('confirmPassword', v)} error={errors.confirmPassword} placeholder="Re-enter password" />

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setErrors((er) => ({ ...er, confirmPassword: '' })) }}
                className="mt-0.5 accent-[#c8a951]"
              />
              <span className="text-sm text-[#6b7280]">
                I agree to the{' '}
                <Link href="/terms" className="text-[#c8a951] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-[#c8a951] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#111827] text-white font-semibold text-sm rounded-xl hover:bg-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/></svg>}
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="lg:hidden text-center text-xs text-[#9ca3af] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#c8a951] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

// ─── Reusable field ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', error, placeholder, autoFocus }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; error?: string; placeholder?: string; autoFocus?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`px-4 py-3 text-sm border rounded-xl outline-none transition bg-white placeholder:text-[#9ca3af]
          focus:ring-2 focus:ring-[#c8a951]/20
          ${error ? 'border-[#ef4444] focus:border-[#ef4444]' : 'border-[#e5e7eb] focus:border-[#c8a951]'}`}
      />
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  )
}
