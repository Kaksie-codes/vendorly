// -----------------------------------------------------------------------------
// File: layout.tsx
// Path: app/(storefront)/layout.tsx
// -----------------------------------------------------------------------------

import React                       from 'react'
import { CartProvider }            from '@/providers/CartProvider'
import { AIAssistant }             from '@/components/ui/AIAssistant'
import { ConditionalLayout }       from '@/components/layout/ConditionalLayout'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <ConditionalLayout>{children}</ConditionalLayout>
        <AIAssistant />
      </div>
    </CartProvider>
  )
}
