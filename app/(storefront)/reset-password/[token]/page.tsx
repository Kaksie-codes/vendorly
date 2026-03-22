'use client'

// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/reset-password/[token]/page.tsx
//
// The user arrives here from the reset-password email link:
//   /reset-password/<raw-token>
// We send the token + new password to POST /auth/reset-password/:token
// -----------------------------------------------------------------------------

import React, { useState } from 'react'
import Link                from 'next/link'
import { useRouter }       from 'next/navigation'
import { z }               from 'zod'
import { apiClient }       from '@/lib/api/client'

const schema = z.object({
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})

type FormErrors = { password?: string; confirmPassword?: string }

function strengthLevel(pwd: string) {
  if (pwd.length === 0) return { level: 0, label: '',       color: '' }
  if (pwd.length < 8)   return { level: 1, label: 'Weak',   color: '#ef4444' }
  if (pwd.length < 12)  return { level: 2, label: 'Fair',   color: '#f59e0b' }
  if (pwd.length < 16)  return { level: 3, label: 'Good',   color: '#10b981' }
  return                       { level: 4, label: 'Strong', color: '#059669' }
}

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()

  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd,         setShowPwd]         = useState(false)
  const [errors,          setErrors]          = useState<FormErrors>({})
  const [apiError,        setApiError]        = useState('')
  const [loading,         setLoading]         = useState(false)
  const [done,            setDone]            = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    const result = schema.safeParse({ password, confirmPassword })
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
      await apiClient.post(`/auth/reset-password/${params.token}`, { newPassword: password })
      setDone(true)
      // Redirect to login after a short pause
      setTimeout(() => router.replace('/login'), 2500)
    } catch (err: any) {
      setApiError(err.message ?? 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  const strength = strengthLevel(password)

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[44%] xl:w-[42%] bg-[#0c0c0c] flex-col relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#c8a951] opacity-[0.06] rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex flex-col leading-none group w-fit">
            <span className="font-serif text-xl font-bold text-white group-hover:text-[#c8a951] transition-colors">Vendorly</span>
            <span className="text-[0.45rem] tracking-[0.35em] uppercase text-[#c8a951] mt-0.5">Marketplace</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#c8a951]/10 border border-[#c8a951]/20 flex items-center justify-center mb-8">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="1.75">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white leading-snug mb-4">Choose a strong<br />new password.</h2>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              Pick something you haven&apos;t used before. We recommend at least 12 characters with a mix of letters and numbers.
            </p>
          </div>

          <p className="text-xs text-[#4b5563] pt-8 border-t border-white/[0.06]">
            Remembered your password?{' '}
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

          {done ? (
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">Password reset!</h1>
                <p className="text-sm text-[#6b7280] mt-2">Your password has been updated. Redirecting you to sign in…</p>
              </div>
              <Link href="/login" className="w-full py-3 bg-[#111827] text-white font-semibold text-sm rounded-xl hover:bg-[#1f2937] transition-all text-center block">
                Sign In Now
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#111827] mb-1">Set new password</h1>
              <p className="text-[#6b7280] text-sm mb-8">Choose a new password for your account.</p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {apiError && (
                  <div className="flex items-start gap-2.5 px-3.5 py-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-sm text-[#dc2626]">
                    <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {apiError}
                  </div>
                )}

                {/* New password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">New Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors((er) => ({ ...er, password: '' })) }}
                      placeholder="Min. 8 characters"
                      autoFocus
                      className={`w-full px-4 py-3 pr-11 text-sm border rounded-xl outline-none transition bg-white placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#c8a951]/20 ${errors.password ? 'border-[#ef4444] focus:border-[#ef4444]' : 'border-[#e5e7eb] focus:border-[#c8a951]'}`}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]">
                      {showPwd
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-[#ef4444]">{errors.password}</p>}

                  {password && (
                    <div className="flex items-center gap-1.5 mt-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ backgroundColor: i <= strength.level ? strength.color : '#f3f4f6' }} />
                      ))}
                      <span className="text-[0.6rem] ml-1 font-medium" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors((er) => ({ ...er, confirmPassword: '' })) }}
                    placeholder="Re-enter password"
                    className={`px-4 py-3 text-sm border rounded-xl outline-none transition bg-white placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#c8a951]/20 ${errors.confirmPassword ? 'border-[#ef4444] focus:border-[#ef4444]' : 'border-[#e5e7eb] focus:border-[#c8a951]'}`}
                  />
                  {errors.confirmPassword && <p className="text-xs text-[#ef4444]">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#111827] text-white font-semibold text-sm rounded-xl hover:bg-[#1f2937] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-1"
                >
                  {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/></svg>}
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

    </div>
  )
}
