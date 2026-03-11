import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  getFeaturedProducts
} from '@/lib/mock-data'

const Hero = () => {
    const featuredProducts   = getFeaturedProducts().slice(0, 4)
  return (
   <section className="relative overflow-hidden bg-bg-muted">
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
  )
}

export default Hero
