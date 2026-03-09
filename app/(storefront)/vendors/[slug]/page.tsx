// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/vendors/[slug]/page.tsx
// -----------------------------------------------------------------------------

import React        from 'react'
import Link         from 'next/link'
import Image        from 'next/image'
import { notFound } from 'next/navigation'
import {
  getVendorBySlug,
  getProductsByVendor,
  getReviewsByVendor,
  mockVendors,
} from '@/lib/mock-data'
import { Rating }      from '@/components/ui/Rating'
import { Badge }       from '@/components/ui/Badge'
import { Breadcrumb }  from '@/components/ui/Container'
import { ProductCard } from '@/components/storefront/ProductCard'
import { VendorTabs }  from '@/components/storefront/VendorTabs'

export async function generateStaticParams() {
  return mockVendors.map((v) => ({ slug: v.storeSlug }))
}

export default async function VendorStorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vendor   = getVendorBySlug(slug)
  if (!vendor) notFound()

  const products = getProductsByVendor(vendor.id)
  const reviews  = getReviewsByVendor(vendor.id)

  const joinedYear = new Date(vendor.joinedAt).getFullYear()
  const featured   = products.filter((p) => p.featured).slice(0, 4)
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4)

  return (
    <div>
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative h-56 sm:h-72 bg-[#f5f5f4] overflow-hidden">
        {vendor.banner
          ? <Image src={vendor.banner} alt={vendor.storeName} fill className="object-cover" sizes="100vw" priority />
          : <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f4] via-[#e5e5e5] to-[#d1d5db]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* ── Store Header ───────────────────────────────────────────────── */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Logo */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0 bg-white">
            {vendor.logo
              ? <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="96px" />
              : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#6b6b6b] bg-[#f5f5f4]">{vendor.storeName[0]}</div>
            }
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-1 sm:pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">{vendor.storeName}</h1>
              {vendor.plan !== 'free' && <Badge variant="gold" size="sm">{vendor.plan}</Badge>}
              {vendor.status === 'active' && (
                <span className="flex items-center gap-1 text-xs text-[#16a34a] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />Verified Seller
                </span>
              )}
            </div>
            {vendor.tagline && <p className="text-sm text-[#6b6b6b]">{vendor.tagline}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <Rating value={vendor.rating} size="sm" showValue />
                <span className="text-xs text-[#9ca3af]">({vendor.reviewCount} reviews)</span>
              </div>
              <span className="text-xs text-[#9ca3af]">{vendor.productCount} products</span>
              <span className="text-xs text-[#9ca3af]">Joined {joinedYear}</span>
            </div>
          </div>

          {/* Social links */}
          {vendor.socialLinks && (
            <div className="flex gap-2 sm:pb-1">
              {vendor.socialLinks.instagram && (
                <a href={vendor.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e5e5e5] text-[#6b6b6b] hover:text-[#c8a951] hover:border-[#c8a951] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
              )}
              {vendor.socialLinks.twitter && (
                <a href={vendor.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e5e5e5] text-[#6b6b6b] hover:text-[#c8a951] hover:border-[#c8a951] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                </a>
              )}
              {vendor.socialLinks.facebook && (
                <a href={vendor.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e5e5e5] text-[#6b6b6b] hover:text-[#c8a951] hover:border-[#c8a951] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[
            { label: 'Home',    href: '/' },
            { label: 'Vendors', href: '/vendors' },
            { label: vendor.storeName },
          ]} />
        </div>

        {/* ── Tabs: Products / About / Reviews ────────────────────────── */}
        <VendorTabs
          vendor={vendor}
          products={products}
          reviews={reviews}
          featured={featured}
          bestsellers={bestsellers}
        />
      </div>
    </div>
  )
}