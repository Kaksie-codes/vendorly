// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/order-confirmation/[id]/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'
import { getOrderByNumber, getOrderById } from '@/lib/mock-data'
import { Breadcrumb } from '@/components/ui/Container'

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'delivered']

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const order = getOrderById(id) ?? getOrderByNumber(id)

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#111111] font-medium mb-2">Order not found</p>
          <Link href="/" className="text-sm text-[#c8a951] hover:underline">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Orders', href: '/account?tab=orders' }, { label: order.orderNumber }]} className="mb-8" />

        {/* ── Success header ── */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="admin-page-title mb-1">Order confirmed!</h1>
          <p className="text-[#6b6b6b] text-sm">
            Thanks for your order. We&apos;ve sent a confirmation to your email.
          </p>
          <div className="inline-flex items-center gap-2 mt-3 bg-white border border-[#e5e5e5] rounded-full px-4 py-1.5">
            <span className="text-xs text-[#9ca3af]">Order</span>
            <span className="text-xs font-semibold text-[#111111]">{order.orderNumber}</span>
          </div>
        </div>

        {/* ── Progress tracker ── */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 mb-4">
          <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">Order Status</p>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => {
              const stepIdx = STATUS_STEPS.indexOf(order.status as string)
              const done    = i <= stepIdx
              const current = i === stepIdx
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done ? 'bg-[#16a34a] text-white' : 'bg-[#f5f5f4] text-[#9ca3af]'
                    } ${current ? 'ring-2 ring-[#16a34a] ring-offset-2' : ''}`}>
                      {done ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : i + 1}
                    </div>
                    <span className={`text-[0.6rem] font-semibold capitalize text-center ${done ? 'text-[#16a34a]' : 'text-[#9ca3af]'}`}>
                      {step}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mb-5 ${i < stepIdx ? 'bg-[#16a34a]' : 'bg-[#e5e5e5]'}`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* ── Order items ── */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-[#f5f5f4]">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="divide-y divide-[#f5f5f4]">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                <div className="w-14 h-14 rounded-xl bg-[#f5f5f4] overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] truncate">{item.name}</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-[#111111] shrink-0">₦{item.totalPrice.toLocaleString()}</p>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="px-5 py-4 border-t border-[#e5e5e5] bg-[#fafaf9] space-y-2">
            <div className="flex justify-between text-sm text-[#6b6b6b]">
              <span>Subtotal</span><span>₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-[#6b6b6b]">
              <span>Shipping</span>
              <span>{order.shippingAmount === 0 ? 'Free' : `₦${order.shippingAmount.toLocaleString()}`}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-[#16a34a]">
                <span>Discount</span><span>−₦{order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#e5e5e5]">
              <span>Total</span><span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── Shipping address ── */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 mb-8">
          <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Shipping To</p>
          <p className="text-sm font-medium text-[#111111]">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p className="text-sm text-[#6b6b6b]">{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && <p className="text-sm text-[#6b6b6b]">{order.shippingAddress.line2}</p>}
          <p className="text-sm text-[#6b6b6b]">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/account/orders/${order.id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#111111] text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors"
          >
            Track Order
          </Link>
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#e5e5e5] text-[#111111] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#f5f5f4] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}