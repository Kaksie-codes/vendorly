// -----------------------------------------------------------------------------
// File: layout.tsx
// Path: app/(storefront)/layout.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import { Navbar }       from '@/components/layout/Navbar'
import { Footer }       from '@/components/layout/Footer'
import { CartProvider } from '@/components/storefront/CartProvider'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  )
}