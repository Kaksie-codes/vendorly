import Link from 'next/link'
import React from 'react'
import { ProductCard } from './ProductCard'
import { getBestsellerProducts, mockVendors } from '@/lib/mock-data'

const BestSellers = () => {
    const bestsellerProducts = getBestsellerProducts().slice(0, 4)
  return (
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
  )
}

export default BestSellers
