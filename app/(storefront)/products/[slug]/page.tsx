// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/products/[slug]/page.tsx
// -----------------------------------------------------------------------------

import React       from 'react'
import Link        from 'next/link'
import Image       from 'next/image'
import { notFound } from 'next/navigation'
import {
  getProductBySlug,
  getProductsByVendor,
  getReviewsByProduct,
  mockVendors,
} from '@/lib/mock-data'
import { Rating }            from '@/components/ui/Rating'
import { Badge }             from '@/components/ui/Badge'
import { Breadcrumb }        from '@/components/ui/Container'
import { ProductCard }       from '@/components/storefront/ProductCard'
import { ProductGallery }    from '@/components/storefront/ProductGallery'
import { AddToCartSection }  from '@/components/storefront/AddToCartSection'

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const { mockProducts } = await import('@/lib/mock-data')
  return mockProducts.map((p) => ({ slug: p.slug }))
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const vendor      = mockVendors.find((v) => v.id === product.vendorId)
  const reviews     = getReviewsByProduct(product.id)
  const relatedRaw  = getProductsByVendor(product.vendorId).filter((p) => p.id !== product.id).slice(0, 4)

  const price       = product.price
  const compareAt   = product.compareAtPrice
  const discountPct = compareAt ? Math.round((1 - price / compareAt) * 100) : null
  const inStock     = product.stock > 0

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Home',     href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]} />
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

        {/* Left — Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Right — Info */}
        <div className="flex flex-col gap-6">

          {/* Vendor */}
          {vendor && (
            <Link
              href={`/vendors/${vendor.storeSlug}`}
              className="inline-flex items-center gap-2 w-fit group"
            >
              <div className="relative w-6 h-6 rounded-md overflow-hidden bg-bg-subtle border border-border-subtle">
                {vendor.logo
                  ? <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="24px" />
                  : <span className="w-full h-full flex items-center justify-center text-[0.55rem] font-bold text-text-secondary">{vendor.storeName[0]}</span>
                }
              </div>
              <span className="text-xs font-medium text-text-secondary group-hover:text-accent-gold transition-colors">
                {vendor.storeName}
              </span>
            </Link>
          )}

          {/* Name + badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.isNew         && <Badge variant="default" size="sm">New</Badge>}
              {product.isBestseller  && <Badge variant="gold"    size="sm">Bestseller</Badge>}
              {product.compareAtPrice && <Badge variant="error"  size="sm">{discountPct}% Off</Badge>}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <Rating value={product.rating} showValue />
            <span className="text-sm text-text-muted">{product.reviewCount} reviews</span>
            <span className="text-sm text-text-muted">·</span>
            <span className="text-sm text-text-muted">{product.soldCount} sold</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold text-text-primary">
              ₦{price.toLocaleString()}
            </span>
            {compareAt && (
              <>
                <span className="text-lg text-text-muted line-through">₦{compareAt.toLocaleString()}</span>
                <span className="text-sm font-semibold text-success">Save {discountPct}%</span>
              </>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-text-secondary text-sm leading-relaxed border-t border-border-subtle pt-4">
              {product.shortDescription}
            </p>
          )}

          {/* Add to cart — client component */}
          <AddToCartSection product={product} />

          {/* Trust micro-badges */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { icon: '🚚', text: 'Free shipping over ₦50,000' },
              { icon: '↩️', text: '30-day returns' },
              { icon: '🔒', text: 'Secure checkout' },
            ].map((b) => (
              <span key={b.text} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span>{b.icon}</span>{b.text}
              </span>
            ))}
          </div>

          {/* Product details accordion */}
          <div className="border-t border-border-subtle pt-4 flex flex-col divide-y divide-border-subtle">
            <DetailRow label="SKU"       value={product.sku} />
            <DetailRow label="Condition" value={product.condition.replace('_', ' ')} />
            {product.weight && (
              <DetailRow label="Weight" value={`${product.weight}g`} />
            )}
            {product.dimensions && (
              <DetailRow
                label="Dimensions"
                value={`${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} ${product.dimensions.unit}`}
              />
            )}
            <DetailRow label="Stock" value={inStock ? `${product.stock} available` : 'Out of stock'} highlight={!inStock} />
            {product.tags.length > 0 && (
              <div className="flex items-start gap-4 py-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider w-24 shrink-0 mt-0.5">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/products?q=${tag}`}
                      className="px-2.5 py-0.5 text-xs bg-bg-subtle text-text-secondary rounded-full hover:bg-accent-gold-muted hover:text-accent-gold-dark transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Description + Reviews ──────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-12 mb-20">

        {/* Description */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold text-text-primary mb-4">About this product</h2>
          <p className="text-text-secondary leading-relaxed">{product.description}</p>

          {product.shippingInfo && (
            <div className="mt-6 p-4 bg-bg-muted rounded-xl border border-border-subtle">
              <h3 className="font-semibold text-sm text-text-primary mb-1">Shipping</h3>
              <p className="text-sm text-text-secondary">{product.shippingInfo}</p>
            </div>
          )}

          {product.returnPolicy && (
            <div className="mt-3 p-4 bg-bg-muted rounded-xl border border-border-subtle">
              <h3 className="font-semibold text-sm text-text-primary mb-1">Returns</h3>
              <p className="text-sm text-text-secondary">{product.returnPolicy}</p>
            </div>
          )}
        </div>

        {/* Vendor card */}
        {vendor && (
          <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border-subtle bg-bg-muted h-fit">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border-subtle bg-bg-primary shrink-0">
                {vendor.logo
                  ? <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="48px" />
                  : <div className="w-full h-full flex items-center justify-center text-lg font-bold text-text-secondary">{vendor.storeName[0]}</div>
                }
              </div>
              <div>
                <p className="font-semibold text-sm text-text-primary">{vendor.storeName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-accent-gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <span className="text-xs text-text-secondary">{vendor.rating.toFixed(1)} · {vendor.productCount} products</span>
                </div>
              </div>
            </div>

            {vendor.tagline && (
              <p className="text-xs text-text-muted leading-relaxed">{vendor.tagline}</p>
            )}

            <Link
              href={`/vendors/${vendor.storeSlug}`}
              className="w-full text-center text-sm font-medium text-text-primary border border-border-subtle rounded-lg py-2.5 hover:bg-text-primary hover:text-text-inverse hover:border-text-primary transition-all duration-200"
            >
              Visit Store
            </Link>
          </div>
        )}
      </div>

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="mb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-text-primary">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-1">
                <Rating value={product.rating} showValue />
                <span className="text-sm text-text-muted">based on {product.reviewCount} reviews</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="flex flex-col gap-3 p-4 rounded-2xl bg-bg-muted border border-border-subtle">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-border-subtle flex items-center justify-center text-xs font-bold text-text-secondary shrink-0">
                      {review.user?.firstName?.[0] ?? '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary leading-none">
                        {review.user ? `${review.user.firstName} ${review.user.lastName[0]}.` : 'Anonymous'}
                      </p>
                      {review.verifiedPurchase && (
                        <span className="text-[0.6rem] text-success font-semibold uppercase tracking-wider">Verified</span>
                      )}
                    </div>
                  </div>
                  <Rating value={review.rating} size="sm" />
                </div>

                {review.title && (
                  <p className="font-semibold text-sm text-text-primary">{review.title}</p>
                )}
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-4">{review.body}</p>
                <p className="text-xs text-text-muted mt-auto">
                  {new Date(review.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Related products ──────────────────────────────────────────────── */}
      {relatedRaw.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-1">More from {vendor?.storeName}</p>
              <h2 className="font-serif text-2xl font-bold text-text-primary">You Might Also Like</h2>
            </div>
            {vendor && (
              <Link href={`/vendors/${vendor.storeSlug}`} className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                View store <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedRaw.map((p) => (
              <ProductCard key={p.id} product={p} vendor={vendor} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ─── Detail Row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-4 py-2.5">
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider w-24 shrink-0">{label}</span>
      <span className={`text-sm capitalize ${highlight ? 'text-error font-medium' : 'text-text-primary'}`}>{value}</span>
    </div>
  )
}