'use client'

// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/auth/callback/page.tsx
//
// Landing page after a successful OAuth login.
// Backend redirects here with a JWT:  /auth/callback?token=<jwt>
//
// 1. Read token from URL
// 2. Call GET /auth/me to get user data
// 3. Store both in auth store
// 4. Redirect to account page
// -----------------------------------------------------------------------------

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuthStore } from '@/store/authStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'

function CallbackHandler() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const setAuth      = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      router.replace('/auth/error?message=No+token+received+from+server')
      return
    }

    // Fetch the user profile using the new token
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((body) => {
        if (body?.data) {
          setAuth(body.data, token)
          router.replace('/account')
        } else {
          router.replace('/auth/error?message=Could+not+load+your+profile')
        }
      })
      .catch(() => {
        router.replace('/auth/error?message=Authentication+failed')
      })
  }, [router, searchParams, setAuth])

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center gap-4">
      <svg className="animate-spin text-[#c8a951]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
      </svg>
      <p className="text-sm text-[#6b7280]">Signing you in…</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <svg className="animate-spin text-[#c8a951]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
        </svg>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}
