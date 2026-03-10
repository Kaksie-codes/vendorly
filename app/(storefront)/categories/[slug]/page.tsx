// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/categories/[slug]/page.tsx
// -----------------------------------------------------------------------------

import React        from 'next/link'
import Link         from 'next/link'
import { notFound } from 'next/navigation'
import {
  getFeaturedCategories,
  getProductsByCategory,
  mockVendors,
} from '@/lib/mock-data'
import { ProductCard } from '@/components/storefront/ProductCard'
import { Breadcrumb }  from '@/components/ui/Container'

export async function generateStaticParams() {
  return getFeaturedCategories().map((c) => ({ slug: c.slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = getFeaturedCategories()
  const category   = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const products = getProductsByCategory(category.id)

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Products', href: '/products' },
          { label: category.name },
        ]} />
      </div>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden mb-10 h-48 sm:h-64 bg-[#f5f5f4]">
        {category.image && (
          <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
          <div className="flex items-center gap-3 mb-2">
            {category.icon && <span className="text-3xl">{category.icon}</span>}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">{category.name}</h1>
          </div>
          {category.description && <p className="text-white/70 text-sm sm:text-base max-w-xl">{category.description}</p>}
          <p className="text-white/50 text-xs mt-2">{category.productCount} products</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — other categories */}
        <aside className="hidden lg:flex flex-col gap-2 w-48 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Browse Categories</p>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={[
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all',
                cat.id === category.id
                  ? 'bg-[#111111] text-white font-medium'
                  : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]',
              ].join(' ')}
            >
              {cat.icon && <span className="text-base">{cat.icon}</span>}
              {cat.name}
            </Link>
          ))}
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#9ca3af]">{products.length} products</p>
            <Link href={`/search?q=${encodeURIComponent(category.name)}`} className="text-sm text-[#c8a951] hover:underline font-medium">
              Filter & Sort →
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <span className="text-4xl">{category.icon ?? '📦'}</span>
              <p className="font-semibold text-[#111111]">No products yet in {category.name}</p>
              <Link href="/products" className="text-sm text-[#c8a951] underline">Browse all products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} vendor={mockVendors.find((v) => v.id === p.vendorId)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}