// -----------------------------------------------------------------------------
// File: Navbar.tsx
// Path: components/layout/Navbar.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Shop',    href: '/products' },
  { label: 'Vendors', href: '/vendors' },
  { label: 'New In',  href: '/products?filter=new' },
  { label: 'Sale',    href: '/products?filter=sale' },
]

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  const cartCount = 3 // mock

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-[200] transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#e5e5e5]'
            : 'bg-white border-b border-[#e5e5e5]',
        ].join(' ')}
      >
        {/* Announcement bar */}
        <div className="bg-[#111111] text-white text-xs text-center py-2 px-4 tracking-wide">
          Free shipping on orders over ₦50,000 &nbsp;·&nbsp;
          <Link href="/products?filter=sale" className="underline underline-offset-2 hover:text-[#c8a951] transition-colors">
            Shop Sale
          </Link>
        </div>

        {/* Main nav row */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left — desktop nav links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'text-sm font-medium transition-colors duration-150',
                    pathname.startsWith(link.href.split('?')[0])
                      ? 'text-[#111111]'
                      : 'text-[#6b6b6b] hover:text-[#111111]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Center — logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none group"
            >
              <span className="font-serif text-2xl font-bold tracking-tight text-[#111111] group-hover:text-[#c8a951] transition-colors duration-200">
                Vendorly
              </span>
              <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#9ca3af] mt-0.5">
                Marketplace
              </span>
            </Link>

            {/* Right — action icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-[#6b6b6b] hover:text-[#111111] hover:bg-[#f5f5f4] transition-all"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              <Link href="/account" className="p-2 rounded-lg text-[#6b6b6b] hover:text-[#111111] hover:bg-[#f5f5f4] transition-all" aria-label="Account">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </Link>

              <Link href="/account?tab=wishlist" className="hidden sm:flex p-2 rounded-lg text-[#6b6b6b] hover:text-[#111111] hover:bg-[#f5f5f4] transition-all" aria-label="Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </Link>

              <Link href="/cart" className="relative p-2 rounded-lg text-[#6b6b6b] hover:text-[#111111] hover:bg-[#f5f5f4] transition-all" aria-label="Cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center bg-[#c8a951] text-white text-[0.6rem] font-bold rounded-full px-1 leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden ml-1 p-2 rounded-lg text-[#6b6b6b] hover:text-[#111111] hover:bg-[#f5f5f4] transition-all"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#e5e5e5] bg-white">
            <nav className="w-full max-w-[1440px] mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith(link.href.split('?')[0])
                      ? 'bg-[#f5f5f4] text-[#111111]'
                      : 'text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-[#e5e5e5] flex flex-col gap-1">
                <Link href="/account" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111] transition-colors">
                  My Account
                </Link>
                <Link href="/account?tab=wishlist" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#6b6b6b] hover:bg-[#f5f5f4] hover:text-[#111111] transition-colors">
                  Wishlist
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e5e5]">
              <svg width="18" height="18" className="text-[#9ca3af] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search products, vendors, categories…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
                }}
                className="flex-1 text-base text-[#111111] placeholder:text-[#9ca3af] outline-none bg-transparent"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="shrink-0 p-1.5 rounded-lg text-[#9ca3af] hover:text-[#111111] hover:bg-[#f5f5f4] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!searchQuery ? (
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-3">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Handmade jewelry', 'Skincare', 'Laptops', 'Home decor', 'Vintage clothing'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 text-sm bg-[#f5f5f4] text-[#6b6b6b] rounded-full hover:bg-[#111111] hover:text-white transition-all duration-150"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-5 py-4">
                <Link
                  href={`/products?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="flex items-center gap-2 text-sm text-[#111111] hover:text-[#c8a951] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  Search for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </Link>
              </div>
            )}
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => { setSearchOpen(false); setSearchQuery('') }} />
        </div>
      )}

      {/* Spacer for fixed navbar height */}
      <div className="h-[calc(32px+64px)]" />
    </>
  )
}