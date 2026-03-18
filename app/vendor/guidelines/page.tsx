// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/vendor/guidelines/page.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-xl font-bold text-[#111111] mb-3">{number}. {title}</h2>
      <div className="text-[#6b6b6b] leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-[#111111] [&_a]:text-[#c8a951] [&_a:hover]:underline">
        {children}
      </div>
    </div>
  )
}

export default function VendorGuidelinesPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c8a951] mb-2">Vendor Resources</p>
        <h1 className="font-serif text-4xl font-bold text-[#111111] mb-3">Vendor Guidelines</h1>
        <p className="text-sm text-[#9ca3af]">Last updated: March 2025</p>
      </div>

      <div className="max-w-3xl mx-auto">

        <div className="mb-8 text-[#6b6b6b] leading-relaxed">
          <p>
            Welcome to Vendorly. These guidelines exist to ensure a fair, trustworthy, and high-quality
            marketplace for all buyers and sellers. By selling on Vendorly, you agree to follow these
            standards in addition to our <a href="/terms">Terms of Service</a>.
          </p>
        </div>

        <Section number="1" title="Account & Identity">
          <ul>
            <li>You must be at least 18 years old and legally permitted to enter into contracts in Nigeria.</li>
            <li>Provide accurate and up-to-date business information, including your store name, address, and banking details.</li>
            <li>Each person or business entity may operate only one vendor account. Multiple accounts are not permitted.</li>
            <li>Keep your login credentials secure and do not share access with unauthorised parties.</li>
          </ul>
        </Section>

        <Section number="2" title="Product Listings">
          <p>Your listings must accurately represent what you are selling:</p>
          <ul>
            <li>Use clear, honest product titles and descriptions. Do not use misleading language or exaggerated claims.</li>
            <li>All product images must be of the actual item for sale. Stock photos that misrepresent the product are not allowed.</li>
            <li>Prices must include all applicable taxes and fees. Hidden charges are not permitted.</li>
            <li>Clearly state the condition of each item (New, Like New, Good, Fair).</li>
            <li>Keep stock quantities accurate. Selling items you do not have in stock is a violation.</li>
            <li>Product categories must be correct and relevant to help buyers find your items.</li>
          </ul>
        </Section>

        <Section number="3" title="Prohibited Items">
          <p>The following items are <strong>strictly prohibited</strong> on Vendorly:</p>
          <ul>
            <li>Counterfeit, replica, or infringing goods of any kind</li>
            <li>Stolen or illegally obtained merchandise</li>
            <li>Weapons, firearms, or ammunition</li>
            <li>Controlled substances, prescription drugs, or illegal materials</li>
            <li>Adult content or sexually explicit material</li>
            <li>Items that promote hatred, violence, or discrimination</li>
            <li>Live animals or endangered species products</li>
            <li>Hazardous, toxic, or flammable materials without proper certification</li>
          </ul>
          <p>Listings found to be in violation will be removed immediately and your account may be suspended.</p>
        </Section>

        <Section number="4" title="Order Fulfilment">
          <ul>
            <li><strong>Confirm orders within 24 hours</strong> of receiving them during business days.</li>
            <li><strong>Dispatch orders within the timeframe stated</strong> on your store page. If you cannot fulfil an order, cancel it promptly and notify the buyer.</li>
            <li>Provide a tracking number for all shipments that support tracking.</li>
            <li>Package items securely to prevent damage in transit.</li>
            <li>Communicate proactively with buyers about any delays or issues.</li>
          </ul>
        </Section>

        <Section number="5" title="Customer Communication">
          <ul>
            <li>Respond to buyer messages within <strong>1 business day</strong>.</li>
            <li>Communicate professionally and courteously at all times.</li>
            <li>Do not attempt to move transactions off the Vendorly platform to avoid fees.</li>
            <li>Do not request personal financial information from buyers outside of the official checkout flow.</li>
          </ul>
        </Section>

        <Section number="6" title="Returns & Refunds">
          <ul>
            <li>You must state a clear return policy on your store page. Vendorly recommends a minimum 7-day return window for eligible items.</li>
            <li>Respond to return requests within 2 business days.</li>
            <li>Process approved refunds promptly. Refunds that are delayed beyond 7 days without reason may be escalated by Vendorly.</li>
            <li>For damaged or incorrect items, you are responsible for the cost of return shipping and replacement.</li>
          </ul>
        </Section>

        <Section number="7" title="Reviews & Feedback">
          <ul>
            <li>Do not offer incentives (discounts, free items, cash) in exchange for positive reviews.</li>
            <li>Do not post fake reviews or ask friends/family to leave reviews.</li>
            <li>Do not retaliate against buyers who leave negative reviews.</li>
            <li>Respond to negative reviews professionally and work to resolve underlying issues.</li>
          </ul>
        </Section>

        <Section number="8" title="Platform Fees & Payouts">
          <ul>
            <li>Vendorly charges a commission on each completed sale. The rate is shown in your Vendor Dashboard and agreed upon during onboarding.</li>
            <li>Payouts are processed every 7 days to your registered bank account, after applicable holding periods.</li>
            <li>Payouts may be withheld for accounts under review, with open disputes, or with outstanding violations.</li>
            <li>You are responsible for your own tax obligations on income earned through Vendorly.</li>
          </ul>
        </Section>

        <Section number="9" title="Account Suspension & Termination">
          <p>Vendorly reserves the right to suspend or permanently terminate vendor accounts for:</p>
          <ul>
            <li>Repeated or serious violations of these guidelines</li>
            <li>Fraudulent activity or misrepresentation</li>
            <li>High rates of order cancellations, disputes, or refunds</li>
            <li>Sustained poor performance (late fulfilment, low ratings)</li>
            <li>Any behaviour that harms buyers, other vendors, or the Vendorly platform</li>
          </ul>
          <p>We will provide notice and an opportunity to appeal except in cases of severe violations.</p>
        </Section>

        <Section number="10" title="Contact & Support">
          <p>If you have questions about these guidelines or need help:</p>
          <div className="bg-[#fafaf9] border border-[#e5e5e5] rounded-2xl p-5 mt-3">
            <p className="text-sm text-[#6b6b6b]"><strong className="text-[#111111]">Vendor Support</strong></p>
            <p className="text-sm text-[#6b6b6b] mt-1">
              Email: <a href="mailto:vendors@vendorly.com">vendors@vendorly.com</a>
            </p>
            <p className="text-sm text-[#6b6b6b]">
              Or open a ticket from your <a href="/vendor/dashboard">Vendor Dashboard</a>.
            </p>
          </div>
        </Section>

        {/* Footer links */}
        <div className="border-t border-[#e5e5e5] pt-6 mt-8 flex flex-wrap gap-4 text-sm text-[#9ca3af]">
          <Link href="/terms" className="hover:text-[#c8a951] transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="/privacy-policy" className="hover:text-[#c8a951] transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/vendor/register" className="hover:text-[#c8a951] transition-colors">Start Selling</Link>
          <span>·</span>
          <Link href="/vendor/dashboard" className="hover:text-[#c8a951] transition-colors">Vendor Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
