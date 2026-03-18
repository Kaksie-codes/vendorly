// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/orders/[id]/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { getOrderById } from '@/lib/mock-data'
import type { OrderStatus } from '@/types'

const VENDOR_ID = 'vendor-1'

const STATUS_PILL: Record<string, string> = {
  pending:          'bg-[#fef3c7] text-[#d97706]',
  confirmed:        'bg-[#dbeafe] text-[#2563eb]',
  processing:       'bg-[#dbeafe] text-[#2563eb]',
  shipped:          'bg-[#ede9fe] text-[#7c3aed]',
  out_for_delivery: 'bg-[#ede9fe] text-[#7c3aed]',
  delivered:        'bg-[#dcfce7] text-[#16a34a]',
  cancelled:        'bg-[#fee2e2] text-[#dc2626]',
  refunded:         'bg-[#fee2e2] text-[#dc2626]',
  return_requested: 'bg-[#fef3c7] text-[#d97706]',
  returned:         'bg-[#f5f5f4] text-[#6b6b6b]',
}

const PAYMENT_PILL: Record<string, string> = {
  paid:               'bg-[#dcfce7] text-[#16a34a]',
  pending:            'bg-[#fef3c7] text-[#d97706]',
  failed:             'bg-[#fee2e2] text-[#dc2626]',
  refunded:           'bg-[#fee2e2] text-[#dc2626]',
  partially_refunded: 'bg-[#fef3c7] text-[#d97706]',
}

const NEXT_ACTION: Partial<Record<OrderStatus, string>> = {
  pending:          'Confirm Order',
  confirmed:        'Start Processing',
  processing:       'Mark as Shipped',
  shipped:          'Out for Delivery',
  out_for_delivery: 'Mark Delivered',
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:          'confirmed',
  confirmed:        'processing',
  processing:       'shipped',
  shipped:          'out_for_delivery',
  out_for_delivery: 'delivered',
}

export default function VendorOrderDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const orderId = params?.id as string

  const order = getOrderById(orderId)
  if (!order) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <span className="text-5xl">🔍</span>
        <p className="font-semibold text-[#111111]">Order not found</p>
        <Link href="/vendor/orders" className="text-sm text-[#c8a951] hover:underline">← Back to orders</Link>
      </div>
    )
  }

  const vendorItems = order.items.filter((i) => i.vendorId === VENDOR_ID)
  const vendorTotal = vendorItems.reduce((s, i) => s + i.totalPrice, 0)

  const [status,   setStatus]   = useState<OrderStatus>(order.status)
  const [updating, setUpdating] = useState(false)

  const nextAction = NEXT_ACTION[status]
  const nextStatus = NEXT_STATUS[status]

  const handleAdvance = async () => {
    if (!nextStatus) return
    setUpdating(true)
    await new Promise((r) => setTimeout(r, 700))
    setStatus(nextStatus)
    setUpdating(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1000px]">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-5">
        <Link href="/vendor/orders" className="hover:text-[#c8a951] transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-[#111111] font-medium">{order.orderNumber}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#111111]">{order.orderNumber}</h1>
          <p className="text-sm text-[#9ca3af] mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_PILL[status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
              {status.replace(/_/g, ' ')}
            </span>
            <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${PAYMENT_PILL[order.paymentStatus] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'}`}>
              {order.paymentStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {nextAction && (
            <button
              onClick={handleAdvance}
              disabled={updating}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#111111] text-white rounded-xl hover:bg-[#2a2a2a] disabled:opacity-60 transition-colors"
            >
              {updating && (
                <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/><path d="M21 12a9 9 0 00-9-9"/>
                </svg>
              )}
              {updating ? 'Updating…' : nextAction}
            </button>
          )}
          <Link
            href="/vendor/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#e5e5e5] rounded-xl text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors"
          >
            ← All Orders
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5">

        {/* ── Left column ── */}
        <div className="space-y-5">

          {/* Your items */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f5f5f4]">
              <h2 className="font-semibold text-[#111111]">Your Items ({vendorItems.length})</h2>
              {order.items.length > vendorItems.length && (
                <p className="text-xs text-[#9ca3af] mt-0.5">This order also contains items from other vendors</p>
              )}
            </div>
            <div className="divide-y divide-[#f5f5f4]">
              {vendorItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f5f5f4] shrink-0 border border-[#e5e5e5]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111111] truncate">{item.name}</p>
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <p className="text-xs text-[#9ca3af]">
                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}
                    <p className="text-xs text-[#9ca3af]">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-[#111111]">₦{item.totalPrice.toLocaleString()}</p>
                    <p className="text-xs text-[#9ca3af]">×{item.quantity} · ₦{item.unitPrice.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-[#fafaf9] border-t border-[#f5f5f4] flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Your Subtotal</span>
              <span className="text-sm font-bold text-[#111111]">₦{vendorTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Tracking */}
          {(order.trackingEvents ?? []).length > 0 && (
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
              <h2 className="font-semibold text-[#111111] mb-4">Shipment Tracking</h2>
              {order.trackingNumber && (
                <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-[#fafaf9] rounded-xl border border-[#e5e5e5]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l3 5v3h-8V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  <div>
                    <p className="text-xs text-[#9ca3af]">{order.trackingCarrier}</p>
                    <p className="text-sm font-mono font-semibold text-[#111111]">{order.trackingNumber}</p>
                  </div>
                </div>
              )}
              <div className="relative pl-5">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#e5e5e5]" />
                {(order.trackingEvents ?? []).map((event, i) => (
                  <div key={i} className="relative flex gap-3 mb-4 last:mb-0">
                    <div className={`absolute -left-5 w-3.5 h-3.5 rounded-full border-2 border-white shrink-0 mt-0.5 ${i === 0 ? 'bg-[#16a34a]' : 'bg-[#d1d5db]'}`} />
                    <div>
                      <p className="text-sm font-medium text-[#111111]">{event.description}</p>
                      {event.location && <p className="text-xs text-[#9ca3af]">{event.location}</p>}
                      <p className="text-xs text-[#9ca3af]">
                        {new Date(event.timestamp).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
            <h2 className="font-semibold text-[#111111] mb-4">Customer</h2>
            {order.customer ? (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-[#111111]">{order.customer.firstName} {order.customer.lastName}</p>
                <p className="text-sm text-[#6b6b6b]">{order.customer.email}</p>
                {order.customer.phone && <p className="text-sm text-[#6b6b6b]">{order.customer.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-[#9ca3af]">Guest checkout</p>
            )}
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
            <h2 className="font-semibold text-[#111111] mb-3">Ship To</h2>
            <div className="text-sm text-[#6b6b6b] space-y-0.5">
              <p className="font-medium text-[#111111]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && <p className="mt-1">{order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
            <h2 className="font-semibold text-[#111111] mb-4">Order Summary</h2>
            <div className="space-y-2">
              <Row label="Subtotal"   value={`₦${order.subtotal.toLocaleString()}`} />
              {order.shippingAmount > 0 && <Row label="Shipping" value={`₦${order.shippingAmount.toLocaleString()}`} />}
              {order.taxAmount > 0      && <Row label="Tax"      value={`₦${order.taxAmount.toLocaleString()}`} />}
              {order.discountAmount > 0 && <Row label="Discount" value={`-₦${order.discountAmount.toLocaleString()}`} green />}
              <div className="border-t border-[#f5f5f4] pt-2 mt-2">
                <Row label="Total" value={`₦${order.total.toLocaleString()}`} bold />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#f5f5f4]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-1">Your share</p>
              <p className="text-lg font-bold text-[#111111]">₦{vendorTotal.toLocaleString()}</p>
            </div>
          </div>

          {/* Estimated delivery */}
          {order.estimatedDelivery && (
            <div className="bg-[#fafaf9] rounded-2xl border border-[#e5e5e5] p-4 flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="1.75"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div>
                <p className="text-xs text-[#9ca3af]">Estimated delivery</p>
                <p className="text-sm font-semibold text-[#111111]">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold, green }: { label: string; value: string; bold?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#9ca3af]">{label}</span>
      <span className={bold ? 'font-semibold text-[#111111]' : green ? 'text-[#16a34a] font-medium' : 'text-[#6b6b6b]'}>
        {value}
      </span>
    </div>
  )
}
