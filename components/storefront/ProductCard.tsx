// -----------------------------------------------------------------------------
// File: ProductCard.tsx
// Path: components/storefront/ProductCard.tsx
// -----------------------------------------------------------------------------

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product, Vendor } from '@/types'
import { Rating } from '@/components/ui/Rating'

type Props = {
  product: Product
  vendor?: Vendor
}

export function ProductCard({ product, vendor }: Props) {
  const image = product.images[0]
  const price = product.variants?.[0]?.price ?? product.price

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f5f5f4]">
        {image && (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew        && <span className="bg-[#111111] text-white text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md">New</span>}
          {product.compareAtPrice && <span className="bg-[#dc2626] text-white text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md">Sale</span>}
        </div>

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[#6b6b6b] hover:text-[#dc2626] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        {/* Quick add */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => e.preventDefault()}
            className="w-full bg-[#111111]/90 backdrop-blur-sm text-white text-xs font-medium py-2.5 rounded-xl hover:bg-[#111111] transition-colors"
          >
            Quick Add
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        {vendor && <p className="text-xs text-[#9ca3af] truncate">{vendor.storeName}</p>}
        <h3 className="text-sm font-medium text-[#111111] leading-snug line-clamp-2 group-hover:text-[#c8a951] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Rating value={product.rating} size="sm" />
          <span className="text-xs text-[#9ca3af]">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-[#111111]">₦{price.toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-[#9ca3af] line-through">₦{product.compareAtPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  )
}