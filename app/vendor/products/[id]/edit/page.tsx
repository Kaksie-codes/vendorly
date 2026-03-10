// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/products/[id]/edit/page.tsx
// -----------------------------------------------------------------------------

import React             from 'react'
import { notFound }      from 'next/navigation'
import { getProductById, mockProducts } from '@/lib/mock-data'
import { ProductForm }   from '@/components/vendor/ProductForm'
import { Breadcrumb }    from '@/components/ui/Container'
import Link              from 'next/link'

export async function generateStaticParams() {
  return mockProducts.map((p) => ({ id: p.id }))
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
  const product = getProductById(id)
  if (!product) notFound()

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Products', href: '/vendor/products' },
          { label: product.name, href: `/vendor/products` },
          { label: 'Edit' },
        ]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#111111]">Edit Product</h1>
            <p className="text-sm text-[#9ca3af] mt-0.5">{product.name}</p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-[#6b6b6b] border border-[#e5e5e5] px-4 py-2 rounded-xl hover:bg-[#f5f5f4] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Live
          </Link>
        </div>
      </div>
      <ProductForm product={product} />
    </div>
  )
}