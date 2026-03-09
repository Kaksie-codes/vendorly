// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/cart/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import { useCart }    from '@/components/storefront/CartProvider'
import { mockVendors } from '@/lib/mock-data'

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart()

  const shipping  = subtotal >= 50000 ? 0 : 2500
  const total     = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#f5f5f4] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#111111]">Your cart is empty</h1>
            <p className="text-sm text-[#9ca3af] mt-1">Looks like you haven&apos;t added anything yet.</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors">
            Start Shopping
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#111111]">Your Cart <span className="text-[#9ca3af] font-normal text-2xl">({items.length})</span></h1>
        <button onClick={clearCart} className="text-xs text-[#9ca3af] hover:text-[#dc2626] transition-colors underline underline-offset-2">
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* ── Items ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col divide-y divide-[#f5f5f4]">
          {items.map((item) => {
            const vendor = mockVendors.find((v) => v.id === item.product?.vendorId)
            const image  = item.product?.images[0]

            return (
              <div key={item.id} className="flex gap-4 py-5 first:pt-0">
                {/* Image */}
                <Link href={`/products/${item.product?.slug}`} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#f5f5f4] shrink-0">
                  {image && (
                    <Image src={image.url} alt={image.alt ?? item.product?.name ?? ''} fill className="object-cover" sizes="112px" />
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  {vendor && (
                    <Link href={`/vendors/${vendor.storeSlug}`} className="text-xs text-[#9ca3af] hover:text-[#c8a951] transition-colors truncate">
                      {vendor.storeName}
                    </Link>
                  )}
                  <Link href={`/products/${item.product?.slug}`} className="font-medium text-sm text-[#111111] leading-snug line-clamp-2 hover:text-[#c8a951] transition-colors">
                    {item.product?.name}
                  </Link>

                  {item.selectedOptions && Object.entries(item.selectedOptions).length > 0 && (
                    <p className="text-xs text-[#9ca3af]">
                      {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors"
                        aria-label="Decrease"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#111111] select-none">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors"
                        aria-label="Increase"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l0 14" /></svg>
                      </button>
                    </div>

                    {/* Price + remove */}
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-[#111111]">₦{(item.price * item.quantity).toLocaleString()}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#9ca3af] hover:text-[#dc2626] transition-colors"
                        aria-label="Remove item"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Order Summary ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5] h-fit sticky top-[calc(32px+64px+24px)]">
          <h2 className="font-serif text-xl font-bold text-[#111111]">Order Summary</h2>

          {/* Coupon */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              className="flex-1 px-3 py-2 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#c8a951] transition bg-white"
            />
            <button className="px-4 py-2 text-sm font-medium bg-[#111111] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors">Apply</button>
          </div>

          {/* Lines */}
          <div className="flex flex-col gap-2 border-t border-[#e5e5e5] pt-4">
            <LineRow label="Subtotal" value={`₦${subtotal.toLocaleString()}`} />
            <LineRow
              label="Shipping"
              value={shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
              green={shipping === 0}
            />
            {shipping > 0 && (
              <p className="text-xs text-[#9ca3af]">Add ₦{(50000 - subtotal).toLocaleString()} more for free shipping</p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-4">
            <span className="font-semibold text-[#111111]">Total</span>
            <span className="font-serif text-xl font-bold text-[#111111]">₦{total.toLocaleString()}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-[#111111] text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-[#2a2a2a] transition-all active:scale-[0.98]"
          >
            Proceed to Checkout
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>

          <Link href="/products" className="text-center text-xs text-[#9ca3af] hover:text-[#111111] transition-colors">
            ← Continue Shopping
          </Link>

          {/* Trust */}
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#f5f5f4]">
            {['🔒 Secure', '↩️ Returns', '🚚 Fast Delivery'].map((b) => (
              <span key={b} className="text-[0.65rem] text-[#9ca3af]">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LineRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#6b6b6b]">{label}</span>
      <span className={green ? 'text-[#16a34a] font-medium' : 'text-[#111111]'}>{value}</span>
    </div>
  )
}