// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/account/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import {
  getOrdersByUser,
  getCustomerById,
  mockProducts,
} from '@/lib/mock-data'
import type { Order, Address } from '@/types'
import { Badge } from '@/components/ui/Badge'

// Use mock user-1 as the logged-in customer
const MOCK_USER_ID = 'user-1'

type Tab = 'orders' | 'wishlist' | 'profile' | 'addresses'
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'orders',    label: 'My Orders',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg> },
  { id: 'wishlist',  label: 'Wishlist',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg> },
  { id: 'profile',   label: 'Profile',      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
  { id: 'addresses', label: 'Addresses',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg> },
]

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending:          'bg-[#fef3c7] text-[#d97706]',
  confirmed:        'bg-[#dbeafe] text-[#2563eb]',
  processing:       'bg-[#dbeafe] text-[#2563eb]',
  shipped:          'bg-[#e0e7ff] text-[#7c3aed]',
  out_for_delivery: 'bg-[#e0e7ff] text-[#7c3aed]',
  delivered:        'bg-[#dcfce7] text-[#16a34a]',
  cancelled:        'bg-[#fee2e2] text-[#dc2626]',
  refunded:         'bg-[#fef3c7] text-[#d97706]',
}

export default function AccountPage() {
  const customer = getCustomerById(MOCK_USER_ID)
  const orders   = getOrdersByUser(MOCK_USER_ID)
  const [tab, setTab] = useState<Tab>('orders')

  const wishlistProducts = mockProducts.filter((p) => customer?.wishlist.includes(p.id)).slice(0, 8)

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Account Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-8 p-5 rounded-2xl bg-[#fafaf9] border border-[#e5e5e5]">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#f5f5f4] border-2 border-white shadow shrink-0">
          {customer?.avatar
            ? <Image src={customer.avatar} alt={customer.firstName} fill className="object-cover" sizes="56px" />
            : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#6b6b6b]">{customer?.firstName[0]}</div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-[#111111]">{customer?.firstName} {customer?.lastName}</h1>
          <p className="text-sm text-[#9ca3af] truncate">{customer?.email}</p>
        </div>
        <div className="hidden sm:flex gap-5">
          <Stat value={orders.length}                  label="Orders" />
          <Stat value={customer?.wishlist.length ?? 0} label="Wishlist" />
          <Stat value={`₦${(customer?.totalSpent ?? 0).toLocaleString()}`} label="Total Spent" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Sidebar nav ─────────────────────────────────────────────── */}
        <aside className="flex lg:flex-col gap-1 lg:w-52 shrink-0 overflow-x-auto lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all w-full text-left',
                tab === t.id
                  ? 'bg-[#111111] text-white'
                  : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]',
              ].join(' ')}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#dc2626] hover:bg-[#fee2e2] transition-all w-full text-left mt-auto whitespace-nowrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sign Out
          </button>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* ORDERS */}
          {tab === 'orders' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#111111] mb-5">My Orders</h2>
              {orders.length === 0 ? (
                <EmptyState icon="📦" title="No orders yet" subtitle="When you place an order it will appear here." cta={{ label: 'Start Shopping', href: '/products' }} />
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => <OrderRow key={order.id} order={order} />)}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST */}
          {tab === 'wishlist' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#111111] mb-5">My Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <EmptyState icon="❤️" title="Your wishlist is empty" subtitle="Save products you love by tapping the heart icon." cta={{ label: 'Browse Products', href: '/products' }} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {wishlistProducts.map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}`} className="group flex flex-col gap-2 rounded-2xl overflow-hidden border border-[#e5e5e5] hover:border-[#c8a951] transition-all">
                      <div className="relative aspect-square bg-[#f5f5f4] overflow-hidden">
                        {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="250px" />}
                      </div>
                      <div className="p-3 flex flex-col gap-0.5">
                        <p className="text-xs font-medium text-[#111111] line-clamp-1 group-hover:text-[#c8a951] transition-colors">{p.name}</p>
                        <p className="text-xs font-semibold text-[#111111]">₦{p.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {tab === 'profile' && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#111111] mb-5">Profile Details</h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
                <ProfileField label="First Name" value={customer?.firstName ?? ''} />
                <ProfileField label="Last Name"  value={customer?.lastName  ?? ''} />
                <ProfileField label="Email"      value={customer?.email     ?? ''} span />
                <ProfileField label="Phone"      value={customer?.phone     ?? ''} />
                <ProfileField label="Member Since" value={new Date(customer?.createdAt ?? '').toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })} />
              </div>
              <button className="mt-6 px-6 py-2.5 text-sm font-medium bg-[#111111] text-white rounded-xl hover:bg-[#2a2a2a] transition-colors">
                Edit Profile
              </button>
            </div>
          )}

          {/* ADDRESSES */}
          {tab === 'addresses' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-2xl font-bold text-[#111111]">Saved Addresses</h2>
                <button className="text-sm font-medium text-[#c8a951] border border-[#c8a951] px-4 py-2 rounded-xl hover:bg-[#f7f1e3] transition-colors">
                  + Add Address
                </button>
              </div>
              {(!customer?.addresses || customer.addresses.length === 0) ? (
                <EmptyState icon="📍" title="No addresses saved" subtitle="Add a shipping address to speed up checkout." />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {customer.addresses.map((addr) => <AddressCard key={addr.id} address={addr} />)}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-serif font-bold text-lg text-[#111111]">{value}</span>
      <span className="text-xs text-[#9ca3af]">{label}</span>
    </div>
  )
}

function OrderRow({ order }: { order: Order }) {
  const statusStyle = ORDER_STATUS_STYLES[order.status] ?? 'bg-[#f5f5f4] text-[#6b6b6b]'
  const statusLabel = order.status.replace(/_/g, ' ')
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-[#e5e5e5] hover:border-[#c8a951] transition-colors">
      {/* Thumbnails */}
      <div className="flex gap-1.5 shrink-0">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#f5f5f4]">
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="w-14 h-14 rounded-lg bg-[#f5f5f4] flex items-center justify-center text-xs font-bold text-[#6b6b6b]">
            +{order.items.length - 3}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-semibold text-sm text-[#111111]">{order.orderNumber}</p>
          <span className={`text-[0.65rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full capitalize ${statusStyle}`}>
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-[#9ca3af]">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Total + action */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="font-serif font-bold text-[#111111]">₦{order.total.toLocaleString()}</span>
        <Link
          href={`/account/orders/${order.id}`}
          className="text-xs font-medium text-[#6b6b6b] border border-[#e5e5e5] px-3 py-1.5 rounded-lg hover:border-[#111111] hover:text-[#111111] transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  )
}

function AddressCard({ address }: { address: Address }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl border border-[#e5e5e5] bg-[#fafaf9]">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-[#111111]">{address.label ?? 'Address'}</p>
        {address.isDefault && <Badge variant="gold" size="sm">Default</Badge>}
      </div>
      <div className="text-sm text-[#6b6b6b] flex flex-col gap-0.5">
        <p>{address.firstName} {address.lastName}</p>
        <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p>{address.country}</p>
        {address.phone && <p>{address.phone}</p>}
      </div>
      <div className="flex gap-3 mt-1">
        <button className="text-xs font-medium text-[#c8a951] hover:underline">Edit</button>
        {!address.isDefault && <button className="text-xs font-medium text-[#6b6b6b] hover:text-[#111111]">Set Default</button>}
        {!address.isDefault && <button className="text-xs font-medium text-[#dc2626] hover:underline">Delete</button>}
      </div>
    </div>
  )
}

function ProfileField({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 ${span ? 'sm:col-span-2' : ''}`}>
      <label className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">{label}</label>
      <div className="px-3 py-2.5 text-sm border border-[#e5e5e5] rounded-xl bg-white text-[#111111]">{value || '—'}</div>
    </div>
  )
}

function EmptyState({ icon, title, subtitle, cta }: {
  icon: string; title: string; subtitle: string; cta?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="font-semibold text-[#111111]">{title}</p>
      <p className="text-sm text-[#9ca3af]">{subtitle}</p>
      {cta && (
        <Link href={cta.href} className="mt-2 px-5 py-2.5 text-sm font-medium bg-[#111111] text-white rounded-xl hover:bg-[#2a2a2a] transition-colors">
          {cta.label}
        </Link>
      )}
    </div>
  )
}