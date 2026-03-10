// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/admin/users/[id]/page.tsx
// -----------------------------------------------------------------------------

import React        from 'react'
import Link         from 'next/link'
import Image        from 'next/image'
import { notFound } from 'next/navigation'
import { getUserById, mockUsers, getOrdersByUser, getReviewsByUser, getVendorById } from '@/lib/mock-data'
import { AdminUserActions } from '@/components/admin/AdminUserActions'

export async function generateStaticParams() {
  return mockUsers.map((u) => ({ id: u.id }))
}

const STATUS_PILL: Record<string, string> = {
  active:               'bg-[#dcfce7] text-[#16a34a]',
  suspended:            'bg-[#fee2e2] text-[#dc2626]',
  pending_verification: 'bg-[#fef3c7] text-[#d97706]',
}

const ORDER_STATUS_PILL: Record<string, string> = {
  pending:          'bg-[#fef3c7] text-[#d97706]',
  confirmed:        'bg-[#dbeafe] text-[#2563eb]',
  processing:       'bg-[#dbeafe] text-[#2563eb]',
  shipped:          'bg-[#ede9fe] text-[#7c3aed]',
  out_for_delivery: 'bg-[#ede9fe] text-[#7c3aed]',
  delivered:        'bg-[#dcfce7] text-[#16a34a]',
  cancelled:        'bg-[#fee2e2] text-[#dc2626]',
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = getUserById(id)
  if (!user) notFound()

  const orders  = getOrdersByUser(user.id)
  const reviews = getReviewsByUser(user.id)

  // If vendor role, find their store
  const vendorStore = user.role === 'vendor'
    ? (await import('@/lib/mock-data')).mockVendors.find((v) => v.userId === user.id)
    : null

  const totalSpent    = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0)
  const totalItems    = orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0)

  return (
    <div className="p-6 lg:p-8 max-w-[1000px]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-5">
        <Link href="/admin/users" className="hover:text-[#ef4444] transition-colors">Users</Link>
        <span>/</span>
        <span className="text-[#111111] font-medium">{user.firstName} {user.lastName}</span>
      </nav>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
            {user.avatar
              ? <Image src={user.avatar} alt="" fill className="object-cover" sizes="80px" />
              : <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#9ca3af]">{user.firstName[0]}</span>
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="font-serif text-2xl font-bold text-[#111111]">{user.firstName} {user.lastName}</h1>
              <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_PILL[user.status]}`}>
                {user.status.replace('_', ' ')}
              </span>
              <span className="text-xs font-semibold bg-[#f5f5f4] text-[#6b6b6b] px-2.5 py-1 rounded-full capitalize">{user.role}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#9ca3af] mb-3">
              <span className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  {user.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Joined {new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <AdminUserActions user={user} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Orders',   value: String(orders.length) },
          { label: 'Total Spent',    value: `₦${totalSpent.toLocaleString()}` },
          { label: 'Items Purchased', value: String(totalItems) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{s.label}</p>
            <p className="font-serif text-xl font-bold text-[#111111] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Vendor store link */}
      {vendorStore && (
        <div className="bg-[#f7f1e3] border border-[#e8d5a3] rounded-2xl p-4 mb-5 flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
            {vendorStore.logo && <Image src={vendorStore.logo} alt={vendorStore.storeName} fill className="object-cover" sizes="40px" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111111]">{vendorStore.storeName}</p>
            <p className="text-xs text-[#9ca3af]">{vendorStore.plan} plan · {vendorStore.status}</p>
          </div>
          <Link href={`/admin/vendors/${vendorStore.id}`}
            className="px-4 py-2 text-sm font-semibold bg-[#c8a951] text-white rounded-xl hover:bg-[#a8892f] transition-colors">
            View Store
          </Link>
        </div>
      )}

      {/* Orders */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 mb-5">
        <h2 className="font-semibold text-[#111111] mb-4">Order History ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-[#9ca3af] py-4 text-center">No orders yet</p>
        ) : (
          <div className="divide-y divide-[#f5f5f4]">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                {/* Items thumbnails */}
                <div className="flex -space-x-2 shrink-0">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={item.id} className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-white bg-[#f5f5f4]" style={{ zIndex: 2 - i }}>
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="36px" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111111]">{order.orderNumber}</p>
                  <p className="text-xs text-[#9ca3af]">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${ORDER_STATUS_PILL[order.status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <p className="text-sm font-semibold text-[#111111] w-24 text-right shrink-0">₦{order.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
          <h2 className="font-semibold text-[#111111] mb-4">Reviews Left ({reviews.length})</h2>
          <div className="divide-y divide-[#f5f5f4]">
            {reviews.map((review) => (
              <div key={review.id} className="py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  {review.product?.images[0] && (
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#f5f5f4] border border-[#e5e5e5] shrink-0">
                      <Image src={review.product.images[0].url} alt="" fill className="object-cover" sizes="36px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="text-sm font-medium text-[#111111] truncate">{review.product?.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < review.rating ? '#c8a951' : 'none'} stroke="#c8a951" strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </div>
                      <span className={`text-[0.6rem] font-semibold uppercase px-2 py-0.5 rounded-full ${review.status === 'published' ? 'bg-[#dcfce7] text-[#16a34a]' : review.status === 'pending' ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
                        {review.status}
                      </span>
                    </div>
                    {review.title && <p className="text-xs font-semibold text-[#111111]">{review.title}</p>}
                    <p className="text-xs text-[#6b6b6b] line-clamp-2">{review.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}