// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/reset-password/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Container'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [showPwd,     setShowPwd]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [done,        setDone]        = useState(false)
  const [error,       setError]       = useState('')

  const strength = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8)          s++
    if (/[A-Z]/.test(password))        s++
    if (/[0-9]/.test(password))        s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#dc2626', '#d97706', '#2563eb', '#16a34a'][strength]

  const handleSubmit = async () => {
    if (!password)                   { setError('Please enter a new password.'); return }
    if (password.length < 8)         { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm)        { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setDone(true)
    setTimeout(() => router.push('/login'), 2500)
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 py-12">

      <div className="w-full max-w-md mb-4 self-center">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Sign In', href: '/login' }, { label: 'Reset Password' }]} />
      </div>

      <Link href="/" className="font-serif text-3xl font-bold text-[#111111] mb-10 hover:opacity-80 transition-opacity">
        Vendorly
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-[#e5e5e5] shadow-sm p-8">

          {done ? (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#111111]">Password updated!</h1>
              <p className="text-sm text-[#6b6b6b]">Your password has been reset. Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-[#111111] mb-1">Set new password</h1>
                <p className="text-sm text-[#9ca3af]">Choose a strong password you haven't used before.</p>
              </div>

              <div className="flex flex-col gap-4">
                {error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fee2e2] border border-[#fecaca] rounded-xl text-sm text-[#dc2626]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                  </div>
                )}

                {/* New password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">New Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-3 pr-11 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
                      autoFocus
                    />
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b6b6b]">
                      {showPwd
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password && (
                    <div className="flex gap-1 mt-1">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300"
                          style={{ backgroundColor: i <= strength ? strengthColor : '#e5e5e5' }} />
                      ))}
                      <span className="text-xs font-medium ml-1" style={{ color: strengthColor }}>{strengthLabel}</span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 pr-11 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white ${
                        confirm && password !== confirm
                          ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/10'
                          : 'border-[#e5e5e5] focus:border-[#c8a951] focus:ring-[#c8a951]/10'
                      }`}
                    />
                    <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b6b6b]">
                      {showConfirm
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-xs text-[#dc2626]">Passwords do not match</p>
                  )}
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
                  {loading ? 'Updating…' : 'Update Password'}
                </button>
              </div>

              <p className="text-center text-sm text-[#9ca3af] mt-5">
                <Link href="/login" className="text-[#c8a951] font-semibold hover:underline">← Back to Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
