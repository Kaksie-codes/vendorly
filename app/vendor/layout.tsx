// -----------------------------------------------------------------------------
// File: layout.tsx
// Path: app/vendor/layout.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutModal } from '@/components/ui/SignOutModal'

const NAV = [
  { href: '/vendor/dashboard', label: 'Dashboard',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { href: '/vendor/products',  label: 'Products',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { href: '/vendor/analytics', label: 'Analytics',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { href: '/vendor/orders',    label: 'Orders',       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { href: '/vendor/payouts',   label: 'Payouts',      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { href: '/vendor/coupons',   label: 'Coupons',      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { href: '/vendor/reviews',   label: 'Reviews',      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { href: '/vendor/customers', label: 'Customers',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { href: '/vendor/profile',   label: 'Store Profile', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { href: '/vendor/settings',  label: 'Settings',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
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
        active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
      }`}
    >
      <span className={active ? 'text-[#c8a951]' : ''}>{item.icon}</span>
      {item.label}
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8a951]" />}
    </Link>
  )
}

function Sidebar({ onNav, isActive, onSignOut }: { onNav?: () => void; isActive: (href: string) => boolean; onSignOut: () => void }) {
  return (
    <>
      <div className="px-6 py-5 border-b border-white/10 shrink-0">
        <Link href="/" className="flex flex-col">
          <span className="font-heading text-lg font-bold text-white leading-none">Vendorly</span>
          <span className="text-[0.6rem] text-white/40 uppercase tracking-[0.15em] mt-0.5">Seller Portal</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
        {NAV.map((item) => (
          <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={onNav} />
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-1 shrink-0">
        <Link href="/admin/dashboard" onClick={onNav}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Admin Portal
        </Link>
        <Link href="/" onClick={onNav}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Storefront
        </Link>
        <button onClick={onSignOut}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-[#ef4444] hover:bg-white/[0.06] transition-colors w-full text-left">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </>
  )
}

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open,        setOpen]        = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/vendor/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafaf9]">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#111111]">
        <Sidebar isActive={isActive} onSignOut={() => setSignOutOpen(true)} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-72 bg-[#111111] flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="font-heading font-bold text-white">Seller Portal</span>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <Sidebar isActive={isActive} onNav={() => setOpen(false)} onSignOut={() => { setOpen(false); setSignOutOpen(true) }} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#111111] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-white text-sm">Vendorly</Link>
        <button onClick={() => setOpen(true)} className="text-white/60 hover:text-white p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto lg:pt-0 pt-14">
        {children}
      </main>

      {signOutOpen && <SignOutModal onClose={() => setSignOutOpen(false)} />}
    </div>
  )
}








// // -----------------------------------------------------------------------------
// // File: layout.tsx
// // Path: app/vendor/layout.tsx
// // -----------------------------------------------------------------------------

// import React from 'react'
// import Link  from 'next/link'

// const NAV = [
//   { href: '/vendor/dashboard', label: 'Dashboard',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
//   { href: '/vendor/products',  label: 'Products',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
//   { href: '/vendor/orders',    label: 'Orders',      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
//   { href: '/vendor/payouts',   label: 'Payouts',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
//   { href: '/vendor/settings',  label: 'Settings',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
// ]

// export default function VendorLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-[#fafaf9]">
//       {/* Sidebar */}
//       <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#111111] min-h-screen sticky top-0 h-screen">
//         {/* Logo */}
//         <div className="px-6 py-5 border-b border-white/10">
//           <Link href="/" className="flex flex-col">
//             <span className="font-serif text-lg font-bold text-white leading-none">Vendorly</span>
//             <span className="text-[0.6rem] text-white/40 uppercase tracking-[0.15em] mt-0.5">Seller Portal</span>
//           </Link>
//         </div>

//         {/* Nav */}
//         <nav className="flex flex-col gap-1 p-4 flex-1">
//           {NAV.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
//             >
//               {item.icon}
//               {item.label}
//             </Link>
//           ))}
//         </nav>

//         {/* Bottom */}
//         <div className="p-4 border-t border-white/10">
//           <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors">
//             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
//             Back to Storefront
//           </Link>
//         </div>
//       </aside>

//       {/* Mobile top bar */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#111111] px-4 py-3 flex items-center justify-between">
//         <span className="font-serif font-bold text-white">Vendorly Seller</span>
//         <div className="flex gap-3">
//           {NAV.slice(0, 3).map((item) => (
//             <Link key={item.href} href={item.href} className="text-white/60 hover:text-white transition-colors">{item.icon}</Link>
//           ))}
//         </div>
//       </div>

//       {/* Main */}
//       <main className="flex-1 min-w-0 lg:pt-0 pt-14">
//         {children}
//       </main>
//     </div>
//   )
// }