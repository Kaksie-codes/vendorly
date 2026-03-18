// -----------------------------------------------------------------------------
// File: layout.tsx
// Path: app/(storefront)/layout.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import { Navbar }       from '@/components/layout/Navbar'
import { Footer }       from '@/components/layout/Footer'
import { CartProvider } from '@/providers/CartProvider'
import { AIAssistant }  from '@/components/ui/AIAssistant'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AIAssistant />
      </div>
    </CartProvider>
  )
}