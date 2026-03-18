// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/help/faq/page.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Container'

type FAQItem = { q: string; a: string }
type FAQSection = { title: string; icon: string; items: FAQItem[] }

const FAQ_DATA: FAQSection[] = [
  {
    title: 'Orders & Payments',
    icon: '🛍️',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse products, add items to your cart, then proceed to checkout. You\'ll need an account or can check out as a guest. Follow the steps to enter your shipping address and payment details.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept card payments (Visa, Mastercard, Verve), bank transfers, and USSD payments via our payment partners Paystack and Flutterwave. All transactions are secured with 256-bit encryption.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'You can cancel an order within 1 hour of placing it, as long as it hasn\'t been confirmed by the vendor. Go to My Account → Orders and select "Cancel Order". Once confirmed, cancellations must be requested through the vendor.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is shipped, you\'ll receive a tracking number by email. You can also track it on our Track Order page or under My Account → Orders → Order Details.',
      },
      {
        q: 'Why was my payment declined?',
        a: 'Payment failures are usually due to insufficient funds, incorrect card details, or bank restrictions on online purchases. Try a different card, check your details, or contact your bank. If the issue persists, contact us.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    icon: '📦',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Delivery times vary by vendor and location. Most orders within Lagos are delivered in 1–3 business days. Orders to other Nigerian cities typically take 3–7 business days. Estimated delivery dates are shown at checkout.',
      },
      {
        q: 'Is free shipping available?',
        a: 'Free shipping is available on orders over ₦50,000. Individual vendors may also offer free shipping on select items or promotions. Check the product page for vendor-specific shipping offers.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, Vendorly serves customers within Nigeria. We\'re working on expanding to more countries. Sign up for our newsletter to be notified when international shipping becomes available.',
      },
      {
        q: 'What if my package is delayed?',
        a: 'First, check your tracking link for updates. If your package hasn\'t moved in 5+ business days or the estimated date has passed, contact the vendor through your order page. You can also reach our support team if you need further help.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    icon: '↩️',
    items: [
      {
        q: 'What is the return policy?',
        a: 'Each vendor sets their own return policy, visible on their store page. Most vendors accept returns within 7–14 days of delivery for items in original, unused condition. Perishable goods, custom-made items, and intimate apparel are generally non-returnable.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Go to My Account → Orders, select the order, and click "Request Return". Fill in the reason and submit. The vendor will review your request and provide return instructions within 2 business days.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Once the vendor confirms receipt of your return, refunds are processed within 3–5 business days. The time it takes to appear in your account depends on your bank — typically 5–10 business days.',
      },
      {
        q: 'What if I receive a damaged or wrong item?',
        a: 'We\'re sorry to hear that. Take photos of the item and contact us immediately at support@vendorly.com or through your order page. We\'ll work quickly to resolve the issue, which may include a replacement or full refund.',
      },
    ],
  },
  {
    title: 'Account & Profile',
    icon: '👤',
    items: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign In" at the top of the page and select "Create Account". Enter your name, email, and password. You\'ll receive a verification email — click the link to activate your account.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'Click "Sign In", then "Forgot password?". Enter your email address and we\'ll send you a reset link. The link is valid for 30 minutes. Check your spam folder if you don\'t see it.',
      },
      {
        q: 'How do I update my delivery addresses?',
        a: 'Go to My Account → Addresses to add, edit, or remove delivery addresses. You can save multiple addresses and choose your preferred one at checkout.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Go to My Account → Profile → Settings and select "Delete Account". This permanently removes your data. Note that this cannot be undone and you\'ll lose access to order history.',
      },
    ],
  },
  {
    title: 'Vendors & Selling',
    icon: '🏪',
    items: [
      {
        q: 'How do I become a vendor on Vendorly?',
        a: 'Click "Sell" in the navigation bar or visit our Vendor Registration page. Fill in your store details, verify your identity, and agree to our Vendor Guidelines. Approval typically takes 1–2 business days.',
      },
      {
        q: 'What commission does Vendorly charge?',
        a: 'Vendorly charges a small platform commission on each completed sale. The exact rate depends on your vendor plan. Full details are shown during registration and in your Vendor Dashboard.',
      },
      {
        q: 'When do I get paid?',
        a: 'Vendor payouts are processed on a rolling basis, typically every 7 days. Funds are transferred to your registered bank account after order confirmation and any applicable holding periods. View your payout schedule in the Vendor Dashboard.',
      },
    ],
  },
]

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-[#e5e5e5] rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#fafaf9] transition-colors"
          >
            <span className="text-sm font-medium text-[#111111]">{item.q}</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"
              className={`shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-[#6b6b6b] leading-relaxed border-t border-[#f5f5f4]">
              <p className="pt-3">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const filtered = activeSection
    ? FAQ_DATA.filter((s) => s.title === activeSection)
    : FAQ_DATA

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help/faq' }, { label: 'FAQ' }]} className="mb-8 max-w-3xl mx-auto" />

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c8a951] mb-2">Help Centre</p>
        <h1 className="font-serif text-4xl font-bold text-[#111111] mb-3">Frequently Asked Questions</h1>
        <p className="text-[#6b6b6b]">Can't find an answer? <Link href="/contact" className="text-[#c8a951] hover:underline font-medium">Contact our support team</Link></p>
      </div>

      {/* Category filter pills */}
      <div className="max-w-3xl mx-auto flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setActiveSection(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!activeSection ? 'bg-[#111111] text-white' : 'bg-[#f5f5f4] text-[#6b6b6b] hover:bg-[#e5e5e5]'}`}
        >
          All Topics
        </button>
        {FAQ_DATA.map((s) => (
          <button
            key={s.title}
            onClick={() => setActiveSection(activeSection === s.title ? null : s.title)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSection === s.title ? 'bg-[#111111] text-white' : 'bg-[#f5f5f4] text-[#6b6b6b] hover:bg-[#e5e5e5]'}`}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* FAQ sections */}
      <div className="max-w-3xl mx-auto space-y-8">
        {filtered.map((section) => (
          <div key={section.title}>
            <h2 className="font-serif text-xl font-bold text-[#111111] mb-4">
              {section.icon} {section.title}
            </h2>
            <FAQAccordion items={section.items} />
          </div>
        ))}
      </div>

      {/* Still need help */}
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-[#fafaf9] border border-[#e5e5e5] rounded-2xl text-center">
        <p className="font-semibold text-[#111111] mb-1">Still have questions?</p>
        <p className="text-sm text-[#6b6b6b] mb-4">Our support team is available Monday–Friday, 9am–6pm WAT.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-[#2a2a2a] transition-colors">
            Contact Support
          </Link>
          <a href="mailto:support@vendorly.com" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e5e5e5] text-sm font-medium rounded-xl text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors">
            support@vendorly.com
          </a>
        </div>
      </div>

      {/* Footer links */}
      <div className="max-w-3xl mx-auto border-t border-[#e5e5e5] pt-6 mt-8 flex flex-wrap gap-4 text-sm text-[#9ca3af] justify-center">
        <Link href="/help/shipping" className="hover:text-[#c8a951] transition-colors">Shipping Policy</Link>
        <span>·</span>
        <Link href="/help/returns" className="hover:text-[#c8a951] transition-colors">Returns</Link>
        <span>·</span>
        <Link href="/help/track" className="hover:text-[#c8a951] transition-colors">Track Order</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-[#c8a951] transition-colors">Terms of Service</Link>
      </div>
    </div>
  )
}
