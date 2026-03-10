// -----------------------------------------------------------------------------
// File: layout.tsx
// Path: app/admin/layout.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link        from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    href: '/admin/vendors',
    label: 'Vendors',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  },
  {
    href: '/admin/payouts',
    label: 'Payouts',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex min-h-screen bg-[#f5f5f4]">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#0f0f0f] min-h-screen sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="font-serif text-lg font-bold text-white leading-none">Vendorly</span>
            <span className="text-[0.6rem] text-[#ef4444]/80 uppercase tracking-[0.15em] mt-0.5 font-semibold">Admin Console</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {NAV.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/6',
                ].join(' ')}
              >
                <span className={active ? 'text-[#ef4444]' : 'text-white/40'}>{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ef4444]" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 flex flex-col gap-1">
          <Link href="/vendor/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/6 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Vendor Portal
          </Link>
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/6 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
            Storefront
          </Link>
          {/* Admin badge */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1">
            <div className="w-7 h-7 rounded-full bg-[#ef4444]/20 flex items-center justify-center text-[0.6rem] font-bold text-[#ef4444]">A</div>
            <div>
              <p className="text-xs font-medium text-white/70">Admin User</p>
              <p className="text-[0.6rem] text-white/30">admin@vendorly.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex flex-col">
          <span className="font-serif font-bold text-white text-sm">Vendorly</span>
          <span className="text-[0.5rem] text-[#ef4444]/80 uppercase tracking-widest font-semibold">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/60 hover:text-white transition-colors p-1">
          {mobileOpen
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14" onClick={() => setMobileOpen(false)}>
          <div className="bg-[#0f0f0f] w-56 h-full flex flex-col p-3 gap-0.5" onClick={(e) => e.stopPropagation()}>
            {NAV.map((item) => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/6'}`}
                >
                  <span className={active ? 'text-[#ef4444]' : 'text-white/40'}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}