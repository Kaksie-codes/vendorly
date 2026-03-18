// -----------------------------------------------------------------------------
// File: layout.tsx
// Path: app/admin/layout.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutModal } from '@/components/ui/SignOutModal'

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
    href: '/admin/categories',
    label: 'Categories',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/></svg>,
  },
  {
    href: '/admin/payouts',
    label: 'Payouts',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    href: '/admin/reviews',
    label: 'Reviews',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  {
    href: '/admin/coupons',
    label: 'Coupons',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  },
  {
    href: '/admin/ai',
    label: 'AI Command',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  },
]

function NavItem({ item, active, onClick }: {
  item: typeof NAV[0]
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
      }`}
    >
      <span className={active ? 'text-[#ef4444]' : 'text-white/40'}>{item.icon}</span>
      {item.label}
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ef4444]" />}
    </Link>
  )
}

function Sidebar({ onNav, isActive, onSignOut }: { onNav?: () => void; isActive: (href: string) => boolean; onSignOut: () => void }) {
  return (
    <>
      {/* ── Fixed top: logo ── */}
      <div className="px-6 py-5 border-b border-white/10 shrink-0">
        <Link href="/admin/dashboard" className="flex flex-col">
          <span className="font-heading text-lg font-bold text-white leading-none">Vendorly</span>
          <span className="text-[0.6rem] text-[#ef4444]/80 uppercase tracking-[0.15em] mt-0.5 font-semibold">Admin Console</span>
        </Link>
      </div>

      {/* ── Scrollable center: nav ── */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
        {NAV.map((item) => (
          <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={onNav} />
        ))}
      </nav>

      {/* ── Fixed bottom: links + admin badge ── */}
      <div className="p-3 border-t border-white/10 flex flex-col gap-1 shrink-0">
        <Link href="/vendor/dashboard" onClick={onNav}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Vendor Portal
        </Link>
        <Link href="/" onClick={onNav}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          Storefront
        </Link>
        <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1">
          <div className="w-7 h-7 rounded-full bg-[#ef4444]/20 flex items-center justify-center text-[0.6rem] font-bold text-[#ef4444] shrink-0">A</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white/70 truncate">Admin User</p>
            <p className="text-[0.6rem] text-white/30 truncate">admin@vendorly.com</p>
          </div>
          <button onClick={onSignOut} title="Sign out"
            className="text-white/30 hover:text-[#ef4444] transition-colors p-1 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex min-h-screen bg-bg-subtle">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#0f0f0f] sticky top-0 h-screen">
        <Sidebar isActive={isActive} onSignOut={() => setSignOutOpen(true)} />
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-[#0f0f0f] flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <div className="flex flex-col">
                <span className="font-heading font-bold text-white text-sm">Vendorly</span>
                <span className="text-[0.5rem] text-[#ef4444]/80 uppercase tracking-widest font-semibold">Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <Sidebar isActive={isActive} onNav={() => setMobileOpen(false)} onSignOut={() => { setMobileOpen(false); setSignOutOpen(true) }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0f0f0f] px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex flex-col">
          <span className="font-heading font-bold text-white text-sm">Vendorly</span>
          <span className="text-[0.5rem] text-[#ef4444]/80 uppercase tracking-widest font-semibold">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/60 hover:text-white transition-colors p-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        {children}
      </main>

      {signOutOpen && <SignOutModal onClose={() => setSignOutOpen(false)} />}
    </div>
  )
}
