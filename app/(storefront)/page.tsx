// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/page.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  getFeaturedProducts,
  getBestsellerProducts,
  getFeaturedVendors,
  getFeaturedCategories,
  mockVendors,
} from '@/lib/mock-data'
import type { Vendor } from '@/types'
import { Badge }       from '@/components/ui/Badge'
import { ProductCard } from '@/components/storefront/ProductCard'

export default function HomePage() {
  const featuredProducts   = getFeaturedProducts().slice(0, 4)
  const bestsellerProducts = getBestsellerProducts().slice(0, 4)
  const featuredVendors    = getFeaturedVendors()
  const categories         = getFeaturedCategories().slice(0, 6)

  return (
    <div className="flex flex-col">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#fafaf9]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Copy */}
            <div className="flex flex-col gap-6 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[#f7f1e3] border border-[#e8d5a3] text-[#a8892f] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8a951]" />
                New arrivals every week
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] leading-[1.1] tracking-tight">
                Shop from{' '}
                <span className="italic text-[#c8a951]">independent</span>
                <br />
                vendors you love
              </h1>

              <p className="text-base text-[#6b6b6b] leading-relaxed max-w-md">
                Discover handpicked products from hundreds of verified vendors — fashion, beauty,
                tech, home decor and more, all in one place.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#2a2a2a] transition-all duration-200 active:scale-[0.98]"
                >
                  Shop Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
                <Link
                  href="/vendors"
                  className="inline-flex items-center gap-2 bg-transparent text-[#111111] border border-[#d1d5db] text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#f5f5f4] hover:border-[#111111] transition-all duration-200"
                >
                  Browse Vendors
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-2">
                {[
                  { value: '500+', label: 'Active Vendors' },
                  { value: '12k+', label: 'Products' },
                  { value: '4.8★', label: 'Avg. Rating' },
                ].map((stat, i) => (
                  <React.Fragment key={stat.label}>
                    {i > 0 && <div className="w-px h-8 bg-[#e5e5e5]" />}
                    <div className="flex flex-col">
                      <span className="font-serif text-2xl font-bold text-[#111111]">{stat.value}</span>
                      <span className="text-xs text-[#9ca3af] mt-0.5">{stat.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Product mosaic */}
            <div className="hidden lg:grid grid-cols-2 gap-4 h-[520px]">
              {featuredProducts.slice(0, 3).map((product, i) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={`relative rounded-2xl overflow-hidden group ${i === 0 ? 'row-span-2' : ''}`}
                >
                  <Image
                    src={product.images[0]?.url ?? `https://picsum.photos/seed/${product.id}/600/800`}
                    alt={product.images[0]?.alt ?? product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1440px) 30vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a951] to-transparent opacity-40" />
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-2">Browse by Category</p>
            <h2 className="font-serif text-3xl font-bold text-[#111111]">Shop Every Category</h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#6b6b6b] hover:text-[#111111] transition-colors">
            View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5] hover:border-[#c8a951] hover:bg-[#f7f1e3] transition-all duration-200"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-[#e5e5e5] text-2xl group-hover:scale-110 transition-transform duration-200">
                {cat.icon ?? '🛍️'}
              </div>
              <span className="text-sm font-medium text-[#111111] text-center leading-tight">{cat.name}</span>
              <span className="text-xs text-[#9ca3af]">{cat.productCount ?? 0} items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <section className="bg-[#fafaf9] py-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-2">Curated for You</p>
              <h2 className="font-serif text-3xl font-bold text-[#111111]">Featured Products</h2>
            </div>
            <Link href="/products?filter=featured" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#6b6b6b] hover:text-[#111111] transition-colors">
              View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} vendor={mockVendors.find((v) => v.id === p.vendorId)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-[#111111] min-h-[280px] flex items-center">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c8a951 0%, transparent 60%), radial-gradient(circle at 80% 20%, #c8a951 0%, transparent 50%)' }}
          />
          <div className="relative z-10 w-full px-8 sm:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-4 max-w-lg">
              <Badge variant="gold">Limited Time Offer</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Up to <span className="text-[#c8a951]">40% off</span> on<br />
                selected items
              </h2>
              <p className="text-white/60 text-sm">Shop our biggest sale of the season. New deals added daily.</p>
              <Link
                href="/products?filter=sale"
                className="w-fit inline-flex items-center gap-2 bg-[#c8a951] text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#a8892f] transition-all duration-200 active:scale-[0.98]"
              >
                Shop the Sale
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="flex gap-8">
              {[
                { value: '40%',    label: 'Max Discount' },
                { value: '200+',   label: 'Items on Sale' },
                { value: '3 days', label: 'Left' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span className="font-serif text-3xl font-bold text-[#c8a951]">{stat.value}</span>
                  <span className="text-xs text-white/50 text-center">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ──────────────────────────────────────────────────── */}
      <section className="bg-[#fafaf9] py-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-2">Customer Favourites</p>
              <h2 className="font-serif text-3xl font-bold text-[#111111]">Best Sellers</h2>
            </div>
            <Link href="/products?filter=bestsellers" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#6b6b6b] hover:text-[#111111] transition-colors">
              View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellerProducts.map((p) => (
              <ProductCard key={p.id} product={p} vendor={mockVendors.find((v) => v.id === p.vendorId)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED VENDORS ─────────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-2">Meet the Sellers</p>
            <h2 className="font-serif text-3xl font-bold text-[#111111]">Featured Vendors</h2>
          </div>
          <Link href="/vendors" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#6b6b6b] hover:text-[#111111] transition-colors">
            All vendors <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.storeSlug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-[#e5e5e5] hover:border-[#c8a951] hover:shadow-[0_8px_24px_-4px_rgb(200_169_81_/_0.15)] transition-all duration-300"
            >
              <div className="relative h-28 bg-[#f5f5f4] overflow-hidden">
                {vendor.banner ? (
                  <Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f4] to-[#e5e5e5]" />
                )}
              </div>
              <div className="flex flex-col gap-2 p-4 flex-1 bg-white">
                <div className="flex items-center gap-3 -mt-8">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white">
                    {vendor.logo ? (
                      <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#f5f5f4] text-lg font-bold text-[#6b6b6b]">
                        {vendor.storeName[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] text-sm group-hover:text-[#c8a951] transition-colors">{vendor.storeName}</h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5 line-clamp-2">{vendor.tagline}</p>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-[#f5f5f4]">
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#c8a951"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    <span className="text-xs font-medium text-[#111111]">{vendor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-[#9ca3af]">{vendor.productCount} products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────────────────── */}
      <section className="border-t border-[#e5e5e5] bg-white py-12">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l3 5v3h-8V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, title: 'Fast Delivery',     subtitle: 'Same-day in Lagos' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,                                                                                                                                                                                                              title: 'Buyer Protection', subtitle: '100% secure checkout' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>,                                                                                                                                                                                    title: 'Easy Returns',     subtitle: '30-day return policy' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,                                                                                                                                                                                      title: 'Verified Vendors',  subtitle: 'All sellers are vetted' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#f7f1e3] text-[#c8a951]">{item.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-[#111111]">{item.title}</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}