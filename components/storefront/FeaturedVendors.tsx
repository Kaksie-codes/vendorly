import { getFeaturedVendors } from '@/lib/mock-data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const FeaturedVendors = () => {
     const featuredVendors    = getFeaturedVendors()
  return (
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
  )
}

export default FeaturedVendors
