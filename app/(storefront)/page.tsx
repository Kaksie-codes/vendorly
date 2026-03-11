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
      <section className="relative overflow-hidden bg-bg-muted">
        <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Copy */}
            <div className="flex flex-col gap-6 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-accent-gold-muted border border-accent-gold-light text-accent-gold-dark text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                New arrivals every week
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight">
                Shop from{' '}
                <span className="italic text-accent-gold">independent</span>
                <br />
                vendors you love
              </h1>

              <p className="text-base text-text-secondary leading-relaxed max-w-md">
                Discover handpicked products from hundreds of verified vendors — fashion, beauty,
                tech, home decor and more, all in one place.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-text-primary text-text-inverse text-sm font-medium px-6 py-3 rounded-lg hover:bg-neutral-hover transition-all duration-200 active:scale-[0.98]"
                >
                  Shop Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
                <Link
                  href="/vendors"
                  className="inline-flex items-center gap-2 bg-transparent text-text-primary border border-border-medium text-sm font-medium px-6 py-3 rounded-lg hover:bg-bg-subtle hover:border-text-primary transition-all duration-200"
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
                    {i > 0 && <div className="w-px h-8 bg-border-subtle" />}
                    <div className="flex flex-col">
                      <span className="font-serif text-2xl font-bold text-text-primary">{stat.value}</span>
                      <span className="text-xs text-text-muted mt-0.5">{stat.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Product mosaic */}
            <div className="hidden lg:grid grid-cols-2 gap-4 h-130">
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent-gold to-transparent opacity-40" />
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-2">Browse by Category</p>
            <h2 className="font-serif text-3xl font-bold text-text-primary">Shop Every Category</h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-bg-muted border border-border-subtle hover:border-accent-gold hover:bg-accent-gold-muted transition-all duration-200"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-primary border border-border-subtle text-2xl group-hover:scale-110 transition-transform duration-200">
                {cat.icon ?? '🛍️'}
              </div>
              <span className="text-sm font-medium text-text-primary text-center leading-tight">{cat.name}</span>
              <span className="text-xs text-text-muted">{cat.productCount ?? 0} items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <section className="bg-bg-muted py-16">
        <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-2">Curated for You</p>
              <h2 className="font-serif text-3xl font-bold text-text-primary">Featured Products</h2>
            </div>
            <Link href="/products?filter=featured" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
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
      <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-text-primary min-h-70 flex items-center">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, var(--color-accent-gold) 0%, transparent 60%), radial-gradient(circle at 80% 20%, var(--color-accent-gold) 0%, transparent 50%)' }}
          />
          <div className="relative z-10 w-full px-8 sm:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-4 max-w-lg">
              <Badge variant="gold">Limited Time Offer</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-inverse leading-tight">
                Up to <span className="text-accent-gold">40% off</span> on<br />
                selected items
              </h2>
              <p className="text-white/60 text-sm">Shop our biggest sale of the season. New deals added daily.</p>
              <Link
                href="/products?filter=sale"
                className="w-fit inline-flex items-center gap-2 bg-accent-gold text-text-inverse text-sm font-medium px-6 py-3 rounded-lg hover:bg-accent-gold-dark transition-all duration-200 active:scale-[0.98]"
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
                  <span className="font-serif text-3xl font-bold text-accent-gold">{stat.value}</span>
                  <span className="text-xs text-white/50 text-center">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ──────────────────────────────────────────────────── */}
      <section className="bg-bg-muted py-16">
        <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-2">Customer Favourites</p>
              <h2 className="font-serif text-3xl font-bold text-text-primary">Best Sellers</h2>
            </div>
            <Link href="/products?filter=bestsellers" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
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
      <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-2">Meet the Sellers</p>
            <h2 className="font-serif text-3xl font-bold text-text-primary">Featured Vendors</h2>
          </div>
          <Link href="/vendors" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            All vendors <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.storeSlug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-border-subtle hover:border-accent-gold hover:shadow-gold transition-all duration-300"
            >
              <div className="relative h-28 bg-bg-subtle overflow-hidden">
                {vendor.banner ? (
                  <Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-bg-subtle to-border-subtle" />
                )}
              </div>
              <div className="flex flex-col gap-2 p-4 flex-1 bg-bg-primary">
                <div className="flex items-center gap-3 -mt-8">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-bg-primary shadow-sm shrink-0 bg-bg-primary">
                    {vendor.logo ? (
                      <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-bg-subtle text-lg font-bold text-text-secondary">
                        {vendor.storeName[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm group-hover:text-accent-gold transition-colors">{vendor.storeName}</h3>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{vendor.tagline}</p>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-bg-subtle">
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-accent-gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    <span className="text-xs font-medium text-text-primary">{vendor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-text-muted">{vendor.productCount} products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────────────────── */}
      <section className="border-t border-border-subtle bg-bg-primary py-12">
        <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l3 5v3h-8V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, title: 'Fast Delivery',     subtitle: 'Same-day in Lagos' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,                                                                                                                                                                                                              title: 'Buyer Protection', subtitle: '100% secure checkout' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>,                                                                                                                                                                                    title: 'Easy Returns',     subtitle: '30-day return policy' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,                                                                                                                                                                                      title: 'Verified Vendors',  subtitle: 'All sellers are vetted' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-gold-muted text-accent-gold">{item.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}