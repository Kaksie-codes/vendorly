'use client'

// -----------------------------------------------------------------------------
// File: ConditionalLayout.tsx
// Path: components/layout/ConditionalLayout.tsx
//
// Client wrapper that hides the Navbar and Footer on auth pages.
// Auth pages are full-screen standalone — they don't use the storefront chrome.
// -----------------------------------------------------------------------------

import { usePathname } from 'next/navigation'
import { Navbar }      from './Navbar'
import { Footer }      from './Footer'

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth   = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (isAuth) {
    // Auth pages: render children with no chrome
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
