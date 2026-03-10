// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/account/orders/[id]/page.tsx
// -----------------------------------------------------------------------------

import React        from 'react'
import Link         from 'next/link'
import Image        from 'next/image'
import { notFound } from 'next/navigation'
import { getOrderById, mockOrders } from '@/lib/mock-data'
import { Breadcrumb } from '@/components/ui/Container'
import type { Order, TrackingEvent } from '@/types'

export async function generateStaticParams() {
  return mockOrders.map((o) => ({ id: o.id }))
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order  = getOrderById(id)
  if (!order) notFound()

  const isDelivered  = order.status === 'delivered'
  const isCancelled  = order.status === 'cancelled' || order.status === 'refunded'
  const trackingDone = order.trackingEvents ?? []

  // Build canonical timeline — merge tracking events with order statuses
  const timeline = trackingDone.length > 0 ? trackingDone : buildFallbackTimeline(order)

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Account',   href: '/account' },
          { label: 'Orders',    href: '/account' },
          { label: order.orderNumber },
        ]} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">{order.orderNumber}</h1>
          <p className="text-sm text-[#9ca3af] mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Left col ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Tracking timeline */}
          {!isCancelled && (
            <section>
              <h2 className="font-semibold text-[#111111] mb-5">Order Tracking</h2>

              {order.trackingNumber && (
                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-[#fafaf9] border border-[#e5e5e5] text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l3 5v3h-8V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  <span className="text-[#6b6b6b]">{order.trackingCarrier} · </span>
                  <span className="font-mono font-medium text-[#111111]">{order.trackingNumber}</span>
                </div>
              )}

              {order.estimatedDelivery && !isDelivered && (
                <div className="mb-5 p-3 rounded-xl bg-[#f7f1e3] border border-[#e8d5a3] text-sm text-[#a8892f] font-medium flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              )}

              {isDelivered && order.deliveredAt && (
                <div className="mb-5 p-3 rounded-xl bg-[#dcfce7] border border-[#bbf7d0] text-sm text-[#16a34a] font-medium flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-3.5 top-4 bottom-4 w-px bg-[#e5e5e5]" />
                <div className="flex flex-col gap-0">
                  {timeline.map((event, i) => {
                    const isLast    = i === timeline.length - 1
                    const isLatest  = i === 0
                    return (
                      <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                        <div className={[
                          'relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                          isLatest
                            ? 'border-[#c8a951] bg-[#c8a951]'
                            : 'border-[#e5e5e5] bg-white',
                        ].join(' ')}>
                          {isLatest && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <p className={`font-medium text-sm ${isLatest ? 'text-[#111111]' : 'text-[#6b6b6b]'}`}>{event.status}</p>
                          <p className="text-xs text-[#9ca3af] mt-0.5">{event.description}</p>
                          {event.location && <p className="text-xs text-[#9ca3af]">📍 {event.location}</p>}
                          <p className="text-xs text-[#c8a951] mt-1">
                            {new Date(event.timestamp).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Order items */}
          <section>
            <h2 className="font-semibold text-[#111111] mb-4">Items Ordered</h2>
            <div className="flex flex-col divide-y divide-[#f5f5f4] border border-[#e5e5e5] rounded-2xl overflow-hidden">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white">
                  <Link href={`/products/${item.productId}`} className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#f5f5f4] shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#111111] line-clamp-2 leading-snug">{item.name}</p>
                    <p className="text-xs text-[#9ca3af] mt-0.5">SKU: {item.sku}</p>
                    {item.selectedOptions && (
                      <p className="text-xs text-[#9ca3af]">
                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="font-semibold text-sm text-[#111111]">₦{item.totalPrice.toLocaleString()}</p>
                    <p className="text-xs text-[#9ca3af]">Qty: {item.quantity}</p>
                    <p className="text-xs text-[#9ca3af]">₦{item.unitPrice.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Addresses */}
          <div className="grid sm:grid-cols-2 gap-4">
            <AddressBlock label="Shipping Address" address={order.shippingAddress} />
            <AddressBlock label="Billing Address"  address={order.billingAddress} />
          </div>
        </div>

        {/* ── Right col — summary ───────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
            <h2 className="font-semibold text-[#111111] mb-4">Order Summary</h2>
            <div className="flex flex-col gap-2 text-sm">
              <SummaryRow label="Subtotal"  value={`₦${order.subtotal.toLocaleString()}`} />
              {order.discountAmount > 0 && (
                <SummaryRow label="Discount" value={`-₦${order.discountAmount.toLocaleString()}`} green />
              )}
              <SummaryRow label="Shipping"  value={order.shippingAmount === 0 ? 'Free' : `₦${order.shippingAmount.toLocaleString()}`} green={order.shippingAmount === 0} />
              {order.taxAmount > 0 && (
                <SummaryRow label="Tax"      value={`₦${order.taxAmount.toLocaleString()}`} />
              )}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#e5e5e5]">
              <span className="font-bold text-[#111111]">Total</span>
              <span className="font-serif text-xl font-bold text-[#111111]">₦{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment info */}
          <div className="p-5 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
            <h2 className="font-semibold text-[#111111] mb-3">Payment</h2>
            <div className="flex flex-col gap-1.5 text-sm text-[#6b6b6b]">
              <p>{order.paymentMethod}</p>
              {order.couponCode && <p>Coupon: <span className="font-mono text-[#16a34a]">{order.couponCode}</span></p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {order.status === 'delivered' && (
              <button className="w-full py-2.5 text-sm font-medium border border-[#e5e5e5] rounded-xl hover:bg-[#f5f5f4] transition-colors">
                Request Return
              </button>
            )}
            {(order.status === 'pending' || order.status === 'confirmed') && (
              <button className="w-full py-2.5 text-sm font-medium text-[#dc2626] border border-[#fee2e2] rounded-xl hover:bg-[#fee2e2] transition-colors">
                Cancel Order
              </button>
            )}
            <Link href="/account" className="text-center text-sm text-[#9ca3af] hover:text-[#111111] transition-colors py-1">
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFallbackTimeline(order: Order): TrackingEvent[] {
  const events: TrackingEvent[] = [
    { status: 'Order Placed', description: 'Your order has been received.', timestamp: order.createdAt },
  ]
  if (['confirmed','processing','shipped','out_for_delivery','delivered'].includes(order.status))
    events.unshift({ status: 'Confirmed', description: 'Your order has been confirmed.', timestamp: order.updatedAt })
  if (['shipped','out_for_delivery','delivered'].includes(order.status))
    events.unshift({ status: 'Shipped', description: 'Your order is on its way.', timestamp: order.updatedAt })
  if (['out_for_delivery','delivered'].includes(order.status))
    events.unshift({ status: 'Out for Delivery', description: 'Package is out for delivery.', timestamp: order.updatedAt })
  if (order.status === 'delivered')
    events.unshift({ status: 'Delivered', description: 'Package has been delivered.', timestamp: order.deliveredAt ?? order.updatedAt })
  return events
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  pending:          'bg-[#fef3c7] text-[#d97706]',
  confirmed:        'bg-[#dbeafe] text-[#2563eb]',
  processing:       'bg-[#dbeafe] text-[#2563eb]',
  shipped:          'bg-[#e0e7ff] text-[#7c3aed]',
  out_for_delivery: 'bg-[#e0e7ff] text-[#7c3aed]',
  delivered:        'bg-[#dcfce7] text-[#16a34a]',
  cancelled:        'bg-[#fee2e2] text-[#dc2626]',
  refunded:         'bg-[#fef3c7] text-[#d97706]',
  return_requested: 'bg-[#fef3c7] text-[#d97706]',
  returned:         'bg-[#f5f5f4] text-[#6b6b6b]',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full capitalize ${STATUS_STYLES[status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

function PaymentBadge({ status }: { status: string }) {
  const style = status === 'paid' ? 'bg-[#dcfce7] text-[#16a34a]' : status === 'failed' ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-[#fef3c7] text-[#d97706]'
  return (
    <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full ${style}`}>
      {status}
    </span>
  )
}

function AddressBlock({ label, address }: { label: string; address: Order['shippingAddress'] }) {
  return (
    <div className="p-4 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">{label}</p>
      <div className="text-sm text-[#6b6b6b] flex flex-col gap-0.5">
        <p className="font-medium text-[#111111]">{address.firstName} {address.lastName}</p>
        <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p>{address.country}</p>
        {address.phone && <p>{address.phone}</p>}
      </div>
    </div>
  )
}

function SummaryRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#6b6b6b]">{label}</span>
      <span className={green ? 'text-[#16a34a] font-medium' : 'text-[#111111]'}>{value}</span>
    </div>
  )
}