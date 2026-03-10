// -----------------------------------------------------------------------------
// File: layout.tsx
// Path: app/(vendor)/layout.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link  from 'next/link'

const NAV = [
  { href: '/vendor/dashboard', label: 'Dashboard',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { href: '/vendor/products',  label: 'Products',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { href: '/vendor/orders',    label: 'Orders',      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { href: '/vendor/payouts',   label: 'Payouts',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { href: '/vendor/settings',  label: 'Settings',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
]

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fafaf9]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#111111] min-h-screen sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-lg font-bold text-white leading-none">Vendorly</span>
            <span className="text-[0.6rem] text-white/40 uppercase tracking-[0.15em] mt-0.5">Seller Portal</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#111111] px-4 py-3 flex items-center justify-between">
        <span className="font-serif font-bold text-white">Vendorly Seller</span>
        <div className="flex gap-3">
          {NAV.slice(0, 3).map((item) => (
            <Link key={item.href} href={item.href} className="text-white/60 hover:text-white transition-colors">{item.icon}</Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14">
        {children}
      </main>
    </div>
  )
}