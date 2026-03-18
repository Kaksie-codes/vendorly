// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/forgot-password/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Container'

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [sent,      setSent]      = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return }
    setError(''); setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 py-12">

      <div className="w-full max-w-md mb-4 self-center">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Sign In', href: '/login' }, { label: 'Forgot Password' }]} />
      </div>

      <Link href="/" className="font-serif text-3xl font-bold text-[#111111] mb-10 hover:opacity-80 transition-opacity">
        Vendorly
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-[#e5e5e5] shadow-sm p-8">

          {sent ? (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#111111]">Check your inbox</h1>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                We sent a password reset link to <strong className="text-[#111111]">{email}</strong>.
                It will expire in 30 minutes.
              </p>
              <p className="text-xs text-[#9ca3af] mt-1">
                Didn't get it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-[#c8a951] hover:underline font-medium">
                  try again
                </button>.
              </p>
              <Link
                href="/login"
                className="mt-4 w-full py-3 bg-[#111111] text-white font-semibold text-sm rounded-xl hover:bg-[#2a2a2a] transition-colors text-center"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-[#111111] mb-1">Forgot password?</h1>
                <p className="text-sm text-[#9ca3af]">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fee2e2] border border-[#fecaca] rounded-xl text-sm text-[#dc2626]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="you@example.com"
                    className="px-4 py-3 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 bg-[#111111] text-white font-semibold text-sm rounded-xl hover:bg-[#2a2a2a] disabled:opacity-60 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/><path d="M21 12a9 9 0 00-9-9"/>
                    </svg>
                  )}
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </div>

              <p className="text-center text-sm text-[#9ca3af] mt-5">
                Remember your password?{' '}
                <Link href="/login" className="text-[#c8a951] font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
