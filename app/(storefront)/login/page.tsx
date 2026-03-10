// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/login/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link   from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [tab,        setTab]        = useState<'login' | 'vendor'>('login')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [remember,   setRemember]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    router.push(tab === 'vendor' ? '/vendor/dashboard' : '/account')
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <Link href="/" className="font-serif text-3xl font-bold text-[#111111] mb-10 hover:opacity-80 transition-opacity">
        Vendorly
      </Link>

      <div className="w-full max-w-md">

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-[#f5f5f4] rounded-2xl mb-6">
          {(['login', 'vendor'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={[
                'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all',
                tab === t ? 'bg-white text-[#111111] shadow-sm' : 'text-[#9ca3af] hover:text-[#6b6b6b]',
              ].join(' ')}
            >
              {t === 'login' ? '🛍️ Shop Account' : '🏪 Seller Account'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-[#e5e5e5] shadow-sm p-8">
          <h1 className="font-serif text-2xl font-bold text-[#111111] mb-1">
            {tab === 'login' ? 'Welcome back' : 'Seller Sign In'}
          </h1>
          <p className="text-sm text-[#9ca3af] mb-6">
            {tab === 'login'
              ? 'Sign in to track orders, manage your wishlist and more.'
              : 'Access your vendor dashboard and manage your store.'}
          </p>

          {/* Social logins */}
          <div className="flex flex-col gap-3 mb-6">
            {[
              { label: 'Continue with Google', icon: '🔵' },
              { label: 'Continue with Facebook', icon: '🔷' },
            ].map((s) => (
              <button key={s.label} className="flex items-center justify-center gap-3 w-full py-2.5 border border-[#e5e5e5] rounded-xl text-sm font-medium text-[#6b6b6b] hover:bg-[#fafaf9] hover:border-[#d1d5db] transition-all">
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#f5f5f4]" />
            <span className="text-xs text-[#d1d5db] font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#f5f5f4]" />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fee2e2] border border-[#fecaca] rounded-xl text-sm text-[#dc2626]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Email</label>
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

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#c8a951] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
                />
                <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b6b6b]">
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[#c8a951]" />
              <span className="text-sm text-[#6b6b6b]">Remember me</span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-[#111111] text-white font-semibold text-sm rounded-xl hover:bg-[#2a2a2a] disabled:opacity-60 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/><path d="M21 12a9 9 0 00-9-9"/></svg>}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>

          <p className="text-center text-sm text-[#9ca3af] mt-5">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#c8a951] font-semibold hover:underline">Create one free</Link>
          </p>

          {tab === 'login' && (
            <p className="text-center text-sm text-[#9ca3af] mt-2">
              Want to sell on Vendorly?{' '}
              <Link href="/vendor/register" className="text-[#c8a951] font-semibold hover:underline">Become a seller</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}