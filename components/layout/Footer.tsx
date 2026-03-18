// -----------------------------------------------------------------------------
// File: Footer.tsx
// Path: components/layout/Footer.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'

const footerLinks = {
  Shop: [
    { label: 'All Products',     href: '/products' },
    { label: 'New Arrivals',     href: '/products?filter=new' },
    { label: 'Best Sellers',     href: '/products?filter=bestsellers' },
    { label: 'Sale',             href: '/products?filter=sale' },
    { label: 'All Vendors',      href: '/vendors' },
  ],
  Account: [
    { label: 'My Orders',        href: '/account?tab=orders' },
    { label: 'Wishlist',         href: '/account?tab=wishlist' },
    { label: 'Profile',          href: '/account?tab=profile' },
    { label: 'Addresses',        href: '/account?tab=addresses' },
    { label: 'Payment Methods',  href: '/account?tab=payment' },
  ],
  Vendors: [
    { label: 'Sell on Vendorly',  href: '/vendor/register' },
    { label: 'Vendor Dashboard',  href: '/vendor/dashboard' },
    { label: 'Vendor Guidelines', href: '/vendor/guidelines' },
    { label: 'Payouts',           href: '/vendor/payouts' },
  ],
  Help: [
    { label: 'FAQ',               href: '/help/faq' },
    { label: 'Shipping Policy',   href: '/help/shipping' },
    { label: 'Returns',           href: '/help/returns' },
    { label: 'Contact Us',        href: '/contact' },
    { label: 'Track Order',       href: '/help/track' },
  ],
}

const socialLinks = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-24">

      {/* Vendor CTA band */}
      <div className="border-b border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-white mb-1">
              Become a Vendorly Seller
            </h2>
            <p className="text-sm text-white/60">
              Join thousands of vendors already growing their business with us.
            </p>
          </div>
          <Link
            href="/vendor/register"
            className="shrink-0 inline-flex items-center gap-2 bg-[#c8a951] text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#a8892f] transition-all duration-200 active:scale-[0.98]"
          >
            Start Selling
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Link grid */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-4">
            <div>
              <span className="font-serif text-2xl font-bold text-white">Vendorly</span>
              <span className="block text-[0.6rem] tracking-[0.25em] uppercase text-white/40 mt-0.5">Marketplace</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-[220px]">
              Discover unique products from independent vendors across Nigeria and beyond.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-[#c8a951] hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Vendorly. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Cookie Policy', href: '/privacy-policy#cookies' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}