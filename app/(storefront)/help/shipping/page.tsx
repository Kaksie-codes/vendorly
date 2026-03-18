// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/help/shipping/page.tsx
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

function ShippingRow({ zone, standard, express }: { zone: string; standard: string; express: string }) {
  return (
    <tr className="border-t border-[#f5f5f4]">
      <td className="py-3 pr-4 text-sm font-medium text-[#111111]">{zone}</td>
      <td className="py-3 pr-4 text-sm text-[#6b6b6b]">{standard}</td>
      <td className="py-3 text-sm text-[#6b6b6b]">{express}</td>
    </tr>
  )
}

export default function ShippingPolicyPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help/faq' }, { label: 'Shipping Policy' }]} className="mb-8 max-w-3xl mx-auto" />

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c8a951] mb-2">Help Centre</p>
        <h1 className="font-serif text-4xl font-bold text-[#111111] mb-3">Shipping Policy</h1>
        <p className="text-sm text-[#9ca3af]">Last updated: March 2025</p>
      </div>

      <div className="max-w-3xl mx-auto">

        <div className="mb-8 text-[#6b6b6b] leading-relaxed">
          <p>
            Vendorly facilitates shipping between independent vendors and customers across Nigeria.
            Shipping rates, timelines, and carriers are managed by individual vendors. The information
            below reflects our platform-wide standards and guidelines.
          </p>
        </div>

        <Section title="Delivery Timeframes">
          <p>Estimated delivery times after an order is confirmed and dispatched by the vendor:</p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border border-[#e5e5e5] rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[#fafaf9]">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Delivery Zone</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Standard</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Express</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f4] px-4">
                <ShippingRow zone="Lagos (same zone)"    standard="1–2 business days"  express="Same day / next day" />
                <ShippingRow zone="South West Nigeria"  standard="2–4 business days"  express="1–2 business days" />
                <ShippingRow zone="South East / South South" standard="3–5 business days" express="2–3 business days" />
                <ShippingRow zone="North Nigeria"        standard="4–7 business days"  express="2–4 business days" />
                <ShippingRow zone="Remote areas"         standard="5–10 business days" express="Not available" />
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#9ca3af] mt-2">Times are estimates and may vary based on vendor location, courier availability, and public holidays.</p>
        </Section>

        <Section title="Shipping Costs">
          <p>Shipping fees are calculated at checkout based on:</p>
          <ul>
            <li>The vendor's location and your delivery address</li>
            <li>The weight and dimensions of your items</li>
            <li>Your selected shipping speed (standard or express)</li>
          </ul>
          <p>
            <strong>Free shipping</strong> is available on orders over <strong>₦50,000</strong> from participating vendors.
            Free shipping eligibility is shown on the product page and at checkout.
          </p>
          <p>
            If your cart contains items from multiple vendors, shipping may be calculated separately
            for each vendor's portion of the order.
          </p>
        </Section>

        <Section title="Shipping Carriers">
          <p>Vendors on Vendorly may use the following carriers:</p>
          <ul>
            <li><strong>GIG Logistics</strong> — nationwide coverage, tracked delivery</li>
            <li><strong>DHL</strong> — premium express delivery, real-time tracking</li>
            <li><strong>Sendbox</strong> — same-day and next-day within Lagos</li>
            <li><strong>Kwik Delivery</strong> — same-day delivery in major cities</li>
            <li><strong>Vendor's own dispatch</strong> — some vendors deliver directly for local orders</li>
          </ul>
          <p>The carrier used for your order will be shown in your shipping confirmation email.</p>
        </Section>

        <Section title="Order Tracking">
          <p>
            Once your order is shipped, you will receive an email with your tracking number and a link
            to follow your package. You can also track your order at any time from:
          </p>
          <ul>
            <li><a href="/help/track">Our Track Order page</a> — enter your order number and email</li>
            <li><a href="/account?tab=orders">My Account → Orders</a> — view real-time status if you are signed in</li>
          </ul>
        </Section>

        <Section title="Failed Deliveries">
          <p>
            If a delivery attempt fails (e.g., no one is available at the address), the courier will
            typically try again on the next business day or leave a notification card. After 2 failed
            attempts, the package may be returned to the vendor.
          </p>
          <p>
            If your package is returned, the vendor will contact you to arrange re-delivery. Additional
            delivery charges may apply for re-attempts.
          </p>
        </Section>

        <Section title="Damaged or Lost Packages">
          <p>
            If your package arrives damaged, take photos immediately and contact the vendor through your
            order page. For packages that appear lost (no tracking update for 5+ business days), contact
            us at <a href="mailto:support@vendorly.com">support@vendorly.com</a> and we will investigate.
          </p>
          <p>
            All packages dispatched through Vendorly's partnered carriers are covered for basic loss
            and damage claims up to the value of the order.
          </p>
        </Section>

        <Section title="International Shipping">
          <p>
            Vendorly currently ships within Nigeria only. We are actively working to expand our delivery
            network to other African countries. Sign up for our newsletter to be the first to know when
            international shipping becomes available.
          </p>
        </Section>

        {/* Footer links */}
        <div className="border-t border-[#e5e5e5] pt-6 mt-8 flex flex-wrap gap-4 text-sm text-[#9ca3af]">
          <Link href="/help/faq" className="hover:text-[#c8a951] transition-colors">FAQ</Link>
          <span>·</span>
          <Link href="/help/returns" className="hover:text-[#c8a951] transition-colors">Returns Policy</Link>
          <span>·</span>
          <Link href="/help/track" className="hover:text-[#c8a951] transition-colors">Track Order</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-[#c8a951] transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
