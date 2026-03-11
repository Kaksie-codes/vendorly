import Link from 'next/link'
import React from 'react'
import { Badge } from '../ui/Badge'

const PromoBanner = () => {
  return (
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
  )
}

export default PromoBanner
