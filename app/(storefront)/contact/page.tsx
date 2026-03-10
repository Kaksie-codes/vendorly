// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/contact/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const TOPICS = [
  'Order issue', 'Return or refund', 'Product question',
  'Vendor support', 'Account problem', 'Payment issue', 'Other',
]

const FAQS = [
  { q: 'How long does shipping take?', a: 'Delivery times depend on the vendor and your location. Most vendors ship within Lagos in 1–3 days, and nationwide in 3–7 business days. International orders take 7–21 days. Check each vendor\'s store page for their specific policy.' },
  { q: 'How do I return an item?', a: 'Go to your account, find the order, and click "Request Return." Returns are handled per-vendor but all sellers must accept returns within their stated policy. Our support team helps mediate if needed.' },
  { q: 'Is my payment secure?', a: 'Yes. All payments are processed through Paystack and are fully encrypted. Vendorly never stores raw card details. We hold funds in escrow until delivery is confirmed.' },
  { q: 'Can I sell on Vendorly?', a: 'Absolutely. Create a regular account, then apply to become a seller from your account dashboard. Approval usually takes 24 hours. Starter accounts are free — no upfront cost.' },
  { q: 'What happens if my order doesn\'t arrive?', a: 'Open a dispute from your order page within 14 days of the expected delivery date. Our support team will investigate and you\'ll receive a full refund if the order cannot be resolved.' },
  { q: 'Do you offer bulk or wholesale purchasing?', a: 'Some vendors offer bulk pricing. Contact the vendor directly via their store page, or email us at wholesale@vendorly.com for large-volume inquiries.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#c8a951] mb-3 block">Support</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#111111] mb-4">How can we help?</h1>
        <p className="text-[#6b6b6b] max-w-xl mx-auto">Our team is available Monday–Friday, 9am–6pm WAT. Average response time is under 4 hours.</p>
      </div>

      {/* Quick support channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto">
        {[
          { icon: '💬', label: 'Live Chat',    sub: 'Usually replies in < 5 min',  cta: 'Start Chat',   href: '#' },
          { icon: '📧', label: 'Email Us',     sub: 'support@vendorly.com',         cta: 'Send Email',   href: 'mailto:support@vendorly.com' },
          { icon: '📞', label: 'Call Support', sub: '+234 800 VND-ORLY',            cta: 'Call Now',     href: 'tel:+2348008636759' },
        ].map((c) => (
          <a key={c.label} href={c.href} className="flex flex-col items-center gap-2 p-6 bg-white rounded-3xl border border-[#e5e5e5] hover:border-[#c8a951] hover:shadow-sm transition-all text-center group">
            <span className="text-3xl">{c.icon}</span>
            <p className="font-semibold text-[#111111] group-hover:text-[#c8a951] transition-colors">{c.label}</p>
            <p className="text-xs text-[#9ca3af]">{c.sub}</p>
            <span className="text-xs font-semibold text-[#c8a951] mt-1">{c.cta} →</span>
          </a>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">

        {/* Contact form */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#111111] mb-6">Send us a message</h2>

          {sent ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center bg-white rounded-3xl border border-[#e5e5e5]">
              <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <p className="font-semibold text-[#111111]">Message sent!</p>
                <p className="text-sm text-[#9ca3af] mt-1">We'll get back to you at <strong>{form.email}</strong> within 4 hours.</p>
              </div>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', topic: '', message: '' }) }} className="text-sm text-[#c8a951] underline">
                Send another message
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#e5e5e5] p-6 sm:p-8 flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <CField label="Your Name"  value={form.name}  onChange={(v) => update('name', v)}  placeholder="Amara Okonkwo" />
                <CField label="Email"      value={form.email} onChange={(v) => update('email', v)} type="email" placeholder="you@example.com" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Topic</label>
                <select value={form.topic} onChange={(e) => update('topic', e.target.value)} className="px-4 py-3 text-sm border border-[#e5e5e5] rounded-xl bg-white focus:outline-none focus:border-[#c8a951] transition">
                  <option value="">Select a topic…</option>
                  {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  rows={5}
                  placeholder="Tell us what's happening in as much detail as possible…"
                  className="px-4 py-3 text-sm border border-[#e5e5e5] rounded-xl resize-none focus:outline-none focus:border-[#c8a951] transition"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={loading || !form.name || !form.email || !form.message}
                className="w-full py-3 bg-[#111111] text-white font-semibold text-sm rounded-xl hover:bg-[#2a2a2a] disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/></svg>}
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#111111] mb-6">Frequently asked questions</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-[#fafaf9] transition-colors"
                >
                  <span className="font-medium text-sm text-[#111111]">{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" className={`shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-[#6b6b6b] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-[#9ca3af] mt-5">
            Still need help? Visit our{' '}
            <Link href="/help" className="text-[#c8a951] hover:underline font-medium">Help Center</Link>
            {' '}or chat with us.
          </p>
        </div>
      </div>
    </div>
  )
}

function CField({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="px-4 py-3 text-sm border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/10 transition bg-white"
      />
    </div>
  )
}