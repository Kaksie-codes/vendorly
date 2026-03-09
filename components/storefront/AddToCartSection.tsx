// -----------------------------------------------------------------------------
// File: AddToCartSection.tsx
// Path: components/storefront/AddToCartSection.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import type { Product } from '@/types'

type Props = {
  product: Product
}

export function AddToCartSection({ product }: Props) {
  const hasVariants  = (product.variants?.length ?? 0) > 0
  const variantOpts  = product.variantOptions ?? []

  // Selected options state: { Color: 'Black', Size: 'M' }
  const [selected,  setSelected]  = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    variantOpts.forEach((opt) => { if (opt.values[0]) init[opt.name] = opt.values[0] })
    return init
  })
  const [qty,       setQty]       = useState(1)
  const [added,     setAdded]     = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  // Find matching variant
  const activeVariant = hasVariants
    ? product.variants?.find((v) =>
        Object.entries(selected).every(([k, val]) => v.options[k] === val)
      )
    : undefined

  const price     = activeVariant?.price      ?? product.price
  const compareAt = activeVariant?.compareAtPrice ?? product.compareAtPrice
  const stock     = activeVariant?.stock      ?? product.stock
  const inStock   = stock > 0

  const handleAddToCart = () => {
    if (!inStock) return
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Variant selectors */}
      {variantOpts.map((opt) => (
        <div key={opt.name}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-2.5">
            {opt.name}
            {selected[opt.name] && (
              <span className="ml-2 normal-case text-[#111111] font-medium tracking-normal capitalize">
                — {selected[opt.name]}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((val) => {
              const isColor = opt.name.toLowerCase() === 'color'
              const isActive = selected[opt.name] === val

              // Check if this combination is in stock
              const variantForThis = product.variants?.find((v) =>
                v.options[opt.name] === val &&
                Object.entries(selected).every(([k, sv]) => k === opt.name || v.options[k] === sv)
              )
              const outOfStock = variantForThis ? variantForThis.stock === 0 : false

              return (
                <button
                  key={val}
                  onClick={() => setSelected((prev) => ({ ...prev, [opt.name]: val }))}
                  disabled={outOfStock}
                  className={[
                    'relative px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150',
                    isActive
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : outOfStock
                        ? 'border-[#e5e5e5] text-[#d1d5db] cursor-not-allowed line-through'
                        : 'border-[#e5e5e5] text-[#6b6b6b] hover:border-[#111111] hover:text-[#111111]',
                  ].join(' ')}
                >
                  {val}
                  {outOfStock && !isActive && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-full h-px bg-[#d1d5db] rotate-[-25deg] absolute" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Quantity + Add to cart */}
      <div className="flex items-center gap-3">

        {/* Qty stepper */}
        <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="w-10 h-11 flex items-center justify-center text-[#6b6b6b] hover:bg-[#f5f5f4] disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
          </button>
          <span className="w-10 text-center text-sm font-semibold text-[#111111] select-none">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            disabled={qty >= stock}
            className="w-10 h-11 flex items-center justify-center text-[#6b6b6b] hover:bg-[#f5f5f4] disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l0 14" /></svg>
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={[
            'flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
            inStock
              ? added
                ? 'bg-[#16a34a] text-white'
                : 'bg-[#111111] text-white hover:bg-[#2a2a2a]'
              : 'bg-[#f5f5f4] text-[#9ca3af] cursor-not-allowed',
          ].join(' ')}
        >
          {!inStock ? (
            'Out of Stock'
          ) : added ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              Added to Cart
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Add to Cart
            </>
          )}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted((v) => !v)}
          className={[
            'w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-150',
            wishlisted
              ? 'border-[#dc2626] bg-[#fef2f2] text-[#dc2626]'
              : 'border-[#e5e5e5] text-[#6b6b6b] hover:border-[#dc2626] hover:text-[#dc2626]',
          ].join(' ')}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      {/* Stock warning */}
      {inStock && stock <= 5 && (
        <p className="text-xs font-medium text-[#d97706] flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          Only {stock} left in stock — order soon
        </p>
      )}
    </div>
  )
}