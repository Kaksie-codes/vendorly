'use client'

// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/forgot-password/page.tsx
// -----------------------------------------------------------------------------

import React, { useState } from 'react'
import Link                from 'next/link'
import { z }               from 'zod'
import { apiClient }       from '@/lib/api/client'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = schema.safeParse({ email })
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }

    try {
      setLoading(true)
      await apiClient.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[44%] xl:w-[42%] bg-[#0c0c0c] flex-col relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#c8a951] opacity-[0.06] rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex flex-col leading-none group w-fit">
            <span className="font-serif text-xl font-bold text-white group-hover:text-[#c8a951] transition-colors">Vendorly</span>
            <span className="text-[0.45rem] tracking-[0.35em] uppercase text-[#c8a951] mt-0.5">Marketplace</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#c8a951]/10 border border-[#c8a951]/20 flex items-center justify-center mb-8">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="1.75">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white leading-snug mb-4">Forgot your<br />password?</h2>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              No worries — it happens. Enter your email and we&apos;ll send you a secure reset link.
            </p>
          </div>

          <p className="text-xs text-[#4b5563] pt-8 border-t border-white/[0.06]">
            Remembered it?{' '}
            <Link href="/login" className="text-[#c8a951] hover:underline">Back to sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px]">

          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex flex-col items-center leading-none">
              <span className="font-serif text-2xl font-bold text-[#111827]">Vendorly</span>
              <span className="text-[0.45rem] tracking-[0.3em] uppercase text-[#c8a951] mt-0.5">Marketplace</span>
            </Link>
          </div>

          {sent ? (
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">Check your inbox</h1>
                <p className="text-sm text-[#6b7280] mt-2 leading-relaxed">
                  If <span className="font-medium text-[#374151]">{email}</span> is registered, a reset link is on its way. It expires in 1 hour.
                </p>
              </div>
              <p className="text-sm text-[#6b7280]">
                Didn&apos;t receive it?{' '}
                <button onClick={() => setSent(false)} className="text-[#c8a951] font-semibold hover:underline">Try again</button>
              </p>
              <Link href="/login" className="w-full py-3 bg-[#111827] text-white font-semibold text-sm rounded-xl hover:bg-[#1f2937] transition-all text-center block">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#111827] mb-1">Reset your password</h1>
              <p className="text-[#6b7280] text-sm mb-8">Enter your email and we&apos;ll send you a reset link.</p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {error && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-sm text-[#dc2626]">
                    <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="you@example.com"
                    autoFocus
                    className={`px-4 py-3 text-sm border rounded-xl outline-none transition bg-white placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#c8a951]/20 ${error ? 'border-[#ef4444] focus:border-[#ef4444]' : 'border-[#e5e7eb] focus:border-[#c8a951]'}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#111827] text-white font-semibold text-sm rounded-xl hover:bg-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/></svg>}
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm text-[#6b7280] mt-6">
                <Link href="/login" className="text-[#c8a951] font-semibold hover:underline">← Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  )
}
