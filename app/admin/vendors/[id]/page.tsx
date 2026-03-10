// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/vendors/[id]/page.tsx
// -----------------------------------------------------------------------------

import React        from 'react'
import Link         from 'next/link'
import Image        from 'next/image'
import { notFound } from 'next/navigation'
import { getVendorById, mockVendors, mockVendorAnalytics, getProductsByVendor, getOrdersByVendor, getReviewsByVendor } from '@/lib/mock-data'
import { AdminVendorActions } from '@/components/admin/AdminVendorActions'

export async function generateStaticParams() {
  return mockVendors.map((v) => ({ id: v.id }))
}

const STATUS_PILL: Record<string, string> = {
  active:    'bg-[#dcfce7] text-[#16a34a]',
  pending:   'bg-[#fef3c7] text-[#d97706]',
  suspended: 'bg-[#fee2e2] text-[#dc2626]',
  rejected:  'bg-[#f5f5f4] text-[#6b6b6b]',
}

export default async function AdminVendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vendor  = getVendorById(id)
  if (!vendor) notFound()

  const analytics = mockVendorAnalytics[id]
  const products  = getProductsByVendor(id)
  const orders    = getOrdersByVendor(id)
  const reviews   = getReviewsByVendor(id)

  const paidOrders    = orders.filter((o) => o.paymentStatus === 'paid')
  const totalRevenue  = paidOrders.reduce((s, o) => s + o.total, 0)
  const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0

  return (
    <div className="p-6 lg:p-8 max-w-[1100px]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-5">
        <Link href="/admin/vendors" className="hover:text-[#ef4444] transition-colors">Vendors</Link>
        <span>/</span>
        <span className="text-[#111111] font-medium">{vendor.storeName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-5 mb-7">
        {/* Banner + logo */}
        <div className="relative w-full sm:w-64 h-32 rounded-2xl overflow-hidden bg-[#f5f5f4] shrink-0">
          {vendor.banner && <Image src={vendor.banner} alt="banner" fill className="object-cover" sizes="256px" />}
          <div className="absolute bottom-3 left-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white bg-[#f5f5f4]">
              {vendor.logo && <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" sizes="48px" />}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif text-2xl font-bold text-[#111111]">{vendor.storeName}</h1>
                <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_PILL[vendor.status]}`}>
                  {vendor.status}
                </span>
                <span className="text-xs font-semibold bg-[#ede9fe] text-[#7c3aed] px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {vendor.plan}
                </span>
              </div>
              <p className="text-[#6b6b6b] text-sm mt-1">{vendor.tagline}</p>
              <p className="text-xs text-[#9ca3af] mt-1">
                Joined {new Date(vendor.joinedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}{vendor.address.city}, {vendor.address.state}
              </p>
            </div>
            {/* Action buttons */}
            <AdminVendorActions vendor={vendor} />
          </div>

          {/* Contact */}
          <div className="flex flex-wrap gap-4 mt-3">
            <a href={`mailto:${vendor.email}`} className="flex items-center gap-1.5 text-xs text-[#6b6b6b] hover:text-[#ef4444] transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {vendor.email}
            </a>
            {vendor.phone && (
              <span className="flex items-center gap-1.5 text-xs text-[#6b6b6b]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                {vendor.phone}
              </span>
            )}
            {vendor.website && (
              <a href={vendor.website} target="_blank" className="flex items-center gap-1.5 text-xs text-[#6b6b6b] hover:text-[#ef4444] transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Revenue',  value: `₦${(totalRevenue / 1000).toFixed(1)}k`,    sub: `${paidOrders.length} paid orders` },
          { label: 'Products',       value: String(products.length),                      sub: `${products.filter((p) => p.status === 'active').length} active` },
          { label: 'Avg Order',      value: `₦${avgOrderValue.toFixed(0)}`,               sub: 'per transaction' },
          { label: 'Rating',         value: vendor.rating > 0 ? vendor.rating.toFixed(1) : '—', sub: `${reviews.length} reviews` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{s.label}</p>
            <p className="font-serif text-2xl font-bold text-[#111111] mt-1">{s.value}</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Products preview */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#111111]">Products ({products.length})</h2>
          <Link href={`/vendors/${vendor.storeSlug}`} target="_blank" className="text-xs text-[#ef4444] hover:underline font-medium">View Store →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.slice(0, 6).map((product) => (
            <div key={product.id} className="flex flex-col gap-1.5">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5]">
                {product.images[0] && <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="100px" />}
                {product.status !== 'active' && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-[0.5rem] font-semibold text-white uppercase tracking-wide bg-black/60 px-1.5 py-0.5 rounded">{product.status}</span>
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-[#111111] truncate leading-tight">{product.name}</p>
              <p className="text-xs text-[#9ca3af]">₦{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#111111]">Recent Orders ({orders.length})</h2>
          <Link href="/admin/orders" className="text-xs text-[#ef4444] hover:underline font-medium">All orders →</Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-[#9ca3af] py-4 text-center">No orders yet</p>
        ) : (
          <div className="divide-y divide-[#f5f5f4]">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-[#111111]">{order.orderNumber}</p>
                  <p className="text-xs text-[#9ca3af]">
                    {order.customer?.firstName} {order.customer?.lastName} · {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#111111]">₦{order.total.toLocaleString()}</p>
                  <p className="text-xs text-[#9ca3af] capitalize">{order.status.replace(/_/g, ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Store policies */}
      {(vendor.shippingPolicy || vendor.returnPolicy) && (
        <div className="grid sm:grid-cols-2 gap-5">
          {vendor.shippingPolicy && (
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
              <h3 className="font-semibold text-[#111111] mb-2">Shipping Policy</h3>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">{vendor.shippingPolicy}</p>
            </div>
          )}
          {vendor.returnPolicy && (
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
              <h3 className="font-semibold text-[#111111] mb-2">Return Policy</h3>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">{vendor.returnPolicy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}