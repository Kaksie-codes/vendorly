'use client'

// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/auth/error/page.tsx
//
// Shown when OAuth login fails.
// The backend redirects here with an error message in the query string:
//   /auth/error?message=<reason>
// -----------------------------------------------------------------------------

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message      = searchParams.get('message') ?? 'Something went wrong during sign-in.'

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-[#e5e5e5] shadow-sm p-10 flex flex-col items-center gap-5 text-center">

      {/* Error icon */}
      <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-bold text-[#111111]">Sign-in failed</h1>
        <p className="text-sm text-[#6b6b6b] mt-2 leading-relaxed">{decodeURIComponent(message)}</p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Link
          href="/login"
          className="w-full py-3 bg-[#111111] text-white font-semibold text-sm rounded-xl hover:bg-[#2a2a2a] transition-all active:scale-[0.98] text-center"
        >
          Back to Sign In
        </Link>
        <Link
          href="/"
          className="w-full py-3 border border-[#e5e5e5] text-[#111111] font-semibold text-sm rounded-xl hover:bg-[#fafaf9] transition-all text-center"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="font-serif text-3xl font-bold text-[#111111] mb-10 hover:opacity-80 transition-opacity">
        Vendorly
      </Link>

      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#e5e5e5] shadow-sm p-10 flex items-center justify-center">
          <svg className="animate-spin text-[#c8a951]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
          </svg>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
