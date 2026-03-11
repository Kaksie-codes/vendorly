'use client'

// -----------------------------------------------------------------------------
// File: Hero.tsx
// Path: components/storefront/Hero.tsx
// -----------------------------------------------------------------------------

import Image from 'next/image'
import React from 'react'
import { motion, Variants } from 'framer-motion'
import { getFeaturedProducts } from '@/lib/mock-data'
import { Button } from '@/components/ui/Button'

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const mosaicContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
}

const mosaicItem: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

const pillVariant: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: -8 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const statItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease: 'easeOut' } },
}

// ── Arrow icon ────────────────────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────
const Hero = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 4)

  return (
    <section className="relative overflow-hidden bg-bg-muted">
      <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Copy ─────────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-6 max-w-xl"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Pill badge */}
            <motion.div variants={pillVariant} className="w-fit">
              <div className="inline-flex items-center gap-2 bg-accent-gold-muted border border-accent-gold-light text-accent-gold-dark text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-accent-gold"
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                New arrivals every week
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight"
            >
              Shop from{' '}
              <motion.span
                className="italic text-accent-gold inline-block"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                independent
              </motion.span>
              <br />
              vendors you love
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="text-base text-text-secondary leading-relaxed max-w-md"
            >
              Discover handpicked products from hundreds of verified vendors — fashion, beauty,
              tech, home decor and more, all in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Button
                  href="/products"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight />}
                >
                  Shop Now
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Button
                  href="/vendors"
                  variant="outline"
                  size="lg"
                >
                  Browse Vendors
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex items-center gap-6 pt-2">
              {[
                { value: '500+', label: 'Active Vendors' },
                { value: '12k+', label: 'Products' },
                { value: '4.8★', label: 'Avg. Rating' },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && (
                    <motion.div
                      className="w-px h-8 bg-border-subtle"
                      variants={fadeIn}
                    />
                  )}
                  <motion.div
                    className="flex flex-col"
                    variants={statItem}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    <span className="font-serif text-2xl font-bold text-text-primary">{stat.value}</span>
                    <span className="text-xs text-text-muted mt-0.5">{stat.label}</span>
                  </motion.div>
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Product mosaic ───────────────────────────────────── */}
          <motion.div
            className="hidden lg:grid grid-cols-2 gap-4 h-130"
            variants={mosaicContainer}
            initial="hidden"
            animate="show"
          >
            {featuredProducts.slice(0, 3).map((product, i) => (
              <motion.div
                key={product.id}
                variants={mosaicItem}
                className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'row-span-2' : ''}`}
                whileHover="hovered"
              >
                {/* Wrap with a motion.a for hover group coordination */}
                <motion.a
                  href={`/products/${product.slug}`}
                  className="block w-full h-full relative"
                >
                  <Image
                    src={product.images[0]?.url ?? `https://picsum.photos/seed/${product.id}/600/800`}
                    alt={product.images[0]?.alt ?? product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1440px) 30vw"
                    priority={i === 0}
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"
                    initial={{ opacity: 0 }}
                    variants={{ hovered: { opacity: 1 } }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Image scale on hover via CSS — Framer can't animate `object-cover` children */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1 }}
                    variants={{ hovered: { scale: 1.06 } }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originX: 0.5, originY: 0.5 }}
                  />

                  {/* Label slide up */}
                  <motion.div
                    className="absolute bottom-3 left-3 right-3"
                    initial={{ y: 10, opacity: 0 }}
                    variants={{ hovered: { y: 0, opacity: 1 } }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <p className="text-white text-sm font-semibold truncate drop-shadow-sm">{product.name}</p>
                    <p className="text-white/70 text-xs mt-0.5 truncate">View product →</p>
                  </motion.div>

                  {/* Gold corner accent */}
                  <motion.div
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    variants={{ hovered: { scale: 1, opacity: 1 } }}
                    transition={{ duration: 0.25, ease: 'backOut' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gold line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-accent-gold), transparent)', opacity: 0.4 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </section>
  )
}

export default Hero