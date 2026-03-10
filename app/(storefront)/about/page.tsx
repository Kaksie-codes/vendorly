// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/about/page.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link  from 'next/link'
import { mockVendors, mockProducts } from '@/lib/mock-data'

const STATS = [
  { value: '2,400+', label: 'Active Sellers' },
  { value: '48,000+', label: 'Products Listed' },
  { value: '320,000+', label: 'Happy Customers' },
  { value: '₦2.4B+', label: 'GMV Processed' },
]

const VALUES = [
  { icon: '🤝', title: 'Community First', body: 'We exist to help independent makers, artisans, and small businesses reach more customers — without the predatory fees of large platforms.' },
  { icon: '🔒', title: 'Safe & Trusted', body: 'Every vendor is verified. Every transaction is protected. Buyer and seller protections are built into every order.' },
  { icon: '🌍', title: 'Built for Africa', body: 'From payment methods to logistics partners, Vendorly is built for African commerce — with Naira pricing, local shipping, and local support.' },
  { icon: '📦', title: 'Artisan Quality', body: 'We curate sellers who care about craft. Every product on Vendorly meets quality standards so customers always get what they expect.' },
]

const TEAM = [
  { name: 'Adaeze Okafor',  role: 'CEO & Co-founder',      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
  { name: 'Emeka Nwosu',    role: 'CTO & Co-founder',      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Fatima Al-Amin', role: 'Head of Vendor Success', avatar: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=200&q=80' },
  { name: 'Kofi Mensah',    role: 'Head of Design',         avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
]

export default function AboutPage() {
  const activeVendors  = mockVendors.filter((v) => v.status === 'active').length
  const totalProducts  = mockProducts.filter((p) => p.status === 'active').length

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="py-20 sm:py-28 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-[#f7f1e3] text-[#a8892f] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Our Story</span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] leading-tight mb-6">
          Africa's marketplace for<br />
          <span className="text-[#c8a951]">independent makers</span>
        </h1>
        <p className="text-lg text-[#6b6b6b] leading-relaxed max-w-2xl mx-auto">
          Vendorly was founded in Lagos in 2022 with a simple belief: that talented artisans, independent brands, and passionate entrepreneurs deserve a platform that works for them — not against them.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center justify-center p-6 bg-[#fafaf9] rounded-3xl border border-[#e5e5e5]">
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">{s.value}</p>
            <p className="text-sm text-[#9ca3af] mt-1 text-center">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-3 block">Our Mission</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] mb-5 leading-tight">
            We level the playing field for small businesses
          </h2>
          <p className="text-[#6b6b6b] leading-relaxed mb-4">
            Big platforms charge big fees and bury small sellers under algorithmic feed changes. We built Vendorly as the alternative — lower commissions, better tools, and a community that lifts each other up.
          </p>
          <p className="text-[#6b6b6b] leading-relaxed">
            Today, Vendorly hosts thousands of sellers across Nigeria, Ghana, Kenya, and beyond — from solo artisans selling handmade jewellery to growing brands shipping across the continent.
          </p>
          <div className="flex gap-4 mt-7">
            <Link href="/vendor/register" className="px-6 py-3 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-[#2a2a2a] transition-colors">
              Become a Seller
            </Link>
            <Link href="/products" className="px-6 py-3 border border-[#e5e5e5] text-[#111111] text-sm font-semibold rounded-xl hover:bg-[#fafaf9] transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden bg-[#f5f5f4]">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
            alt="Artisan at work"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Values */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-3 block">What We Stand For</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">Our core values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => (
            <div key={v.title} className="flex flex-col gap-3 p-6 bg-white rounded-3xl border border-[#e5e5e5] hover:border-[#c8a951] hover:shadow-sm transition-all">
              <span className="text-3xl">{v.icon}</span>
              <h3 className="font-semibold text-[#111111]">{v.title}</h3>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-3 block">The Team</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">People behind Vendorly</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {TEAM.map((member) => (
            <div key={member.name} className="flex flex-col items-center gap-3 p-5 bg-[#fafaf9] rounded-3xl border border-[#e5e5e5]">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#e5e5e5]">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-[#111111] text-sm">{member.name}</p>
                <p className="text-xs text-[#9ca3af] mt-0.5">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-24 rounded-3xl bg-[#111111] px-8 py-16 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">Ready to join Vendorly?</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Whether you're here to shop or to sell, there's a place for you in our community.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-8 py-3.5 bg-[#c8a951] text-white font-semibold rounded-xl hover:bg-[#a8892f] transition-colors">
            Create Free Account
          </Link>
          <Link href="/contact" className="px-8 py-3.5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}