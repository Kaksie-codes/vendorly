// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/help/returns/page.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Container'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-xl font-bold text-[#111111] mb-3">{title}</h2>
      <div className="text-[#6b6b6b] leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-[#111111] [&_a]:text-[#c8a951] [&_a:hover]:underline">
        {children}
      </div>
    </div>
  )
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
        {num}
      </div>
      <div>
        <p className="font-semibold text-[#111111] text-sm">{title}</p>
        <p className="text-sm text-[#6b6b6b] mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

export default function ReturnsPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help/faq' }, { label: 'Returns & Refunds' }]} className="mb-8 max-w-3xl mx-auto" />

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c8a951] mb-2">Help Centre</p>
        <h1 className="font-serif text-4xl font-bold text-[#111111] mb-3">Returns & Refunds</h1>
        <p className="text-sm text-[#9ca3af]">Last updated: March 2025</p>
      </div>

      <div className="max-w-3xl mx-auto">

        <div className="mb-8 text-[#6b6b6b] leading-relaxed">
          <p>
            We want you to be completely happy with your Vendorly purchase. If something isn't right,
            here's everything you need to know about our returns process.
          </p>
        </div>

        {/* How to return */}
        <Section title="How to Return an Item">
          <div className="flex flex-col gap-4 py-2">
            <Step num={1} title="Request a return" desc="Go to My Account → Orders, find your order, and click 'Request Return'. Select the item(s) you'd like to return and the reason." />
            <Step num={2} title="Wait for vendor approval" desc="The vendor will review your request within 2 business days and provide return instructions, including the return address." />
            <Step num={3} title="Ship the item back" desc="Pack the item securely and ship it to the address provided. Keep your tracking number as proof of postage." />
            <Step num={4} title="Receive your refund" desc="Once the vendor confirms receipt and inspects the item, your refund will be processed within 3–5 business days." />
          </div>
        </Section>

        <Section title="Return Eligibility">
          <p>Items are eligible for return if:</p>
          <ul>
            <li>The return is requested within the vendor's return window (usually <strong>7–14 days</strong> from delivery)</li>
            <li>The item is in its original condition — unused, unworn, with original tags and packaging</li>
            <li>The item is not listed as non-returnable on the product page</li>
          </ul>
          <p>The following items are generally <strong>not eligible for return</strong>:</p>
          <ul>
            <li>Perishable goods (food, fresh produce)</li>
            <li>Custom-made or personalised items</li>
            <li>Intimate apparel, swimwear, and pierced jewellery (for hygiene reasons)</li>
            <li>Digital products and gift cards</li>
            <li>Items marked as final sale</li>
          </ul>
          <p>
            Each vendor sets their own return policy, visible on their store page. We recommend reviewing
            the policy before purchasing.
          </p>
        </Section>

        <Section title="Damaged, Defective, or Wrong Items">
          <p>
            If you received an item that is damaged, defective, or not what you ordered, we will resolve
            this at no cost to you:
          </p>
          <ul>
            <li>Take clear photos of the item and packaging</li>
            <li>Contact us within <strong>48 hours of delivery</strong> via your order page or at <a href="mailto:support@vendorly.com">support@vendorly.com</a></li>
            <li>We will arrange a free return and either send a replacement or issue a full refund</li>
          </ul>
          <p>You should not have to pay return shipping for items that arrive damaged or incorrect.</p>
        </Section>

        <Section title="Refund Timeline">
          <p>Once your return is received and approved:</p>
          <ul>
            <li><strong>Vendor inspection:</strong> 1–2 business days after package is received</li>
            <li><strong>Refund initiation:</strong> 3–5 business days after inspection approval</li>
            <li><strong>Funds in your account:</strong> 5–10 business days depending on your bank</li>
          </ul>
          <p>
            Refunds are issued to the original payment method. If your card has expired, contact us
            and we will arrange an alternative refund method.
          </p>
        </Section>

        <Section title="Return Shipping Costs">
          <p>
            Unless the item is damaged, defective, or incorrect, <strong>the cost of return shipping is the
            buyer's responsibility</strong>. We recommend using a tracked service and retaining your proof
            of postage until the refund is confirmed.
          </p>
          <p>
            Some vendors offer free returns — this will be clearly stated on their store or product page.
          </p>
        </Section>

        <Section title="Exchanges">
          <p>
            Vendorly does not currently support direct exchanges. To get a different size, colour, or
            item, please return the original item and place a new order. If you need help with this
            process, <a href="/contact">contact our support team</a>.
          </p>
        </Section>

        <Section title="Disputes">
          <p>
            If a vendor does not respond to your return request or disputes the return, contact us at{' '}
            <a href="mailto:support@vendorly.com">support@vendorly.com</a> with your order number and
            details. We will mediate and help resolve the issue within 5 business days.
          </p>
          <p>
            In cases of clear vendor policy violations or fraud, Vendorly reserves the right to issue
            refunds directly and take action against the vendor's account.
          </p>
        </Section>

        {/* Footer links */}
        <div className="border-t border-[#e5e5e5] pt-6 mt-8 flex flex-wrap gap-4 text-sm text-[#9ca3af]">
          <Link href="/help/faq" className="hover:text-[#c8a951] transition-colors">FAQ</Link>
          <span>·</span>
          <Link href="/help/shipping" className="hover:text-[#c8a951] transition-colors">Shipping Policy</Link>
          <span>·</span>
          <Link href="/help/track" className="hover:text-[#c8a951] transition-colors">Track Order</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-[#c8a951] transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
