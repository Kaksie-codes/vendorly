// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/terms/page.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Container'

export default function TermsPage() {
  const lastUpdated = 'March 2025'

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} className="mb-8 max-w-3xl mx-auto" />

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c8a951] mb-2">Legal</p>
        <h1 className="font-serif text-4xl font-bold text-[#111111] mb-3">Terms of Service</h1>
        <p className="text-sm text-[#9ca3af]">Last updated: {lastUpdated}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Intro */}
        <div className="mb-8 text-[#6b6b6b] leading-relaxed">
          <p>
            Welcome to Vendorly. These Terms of Service ("Terms") govern your use of the Vendorly platform,
            including our website, mobile applications, and related services (collectively, the "Platform").
            By accessing or using Vendorly, you agree to be bound by these Terms. If you do not agree, please
            do not use the Platform.
          </p>
        </div>

        <PolicySection number="1" title="Definitions">
          <ul>
            <li><strong>"Platform"</strong> refers to Vendorly and all its services.</li>
            <li><strong>"Buyer"</strong> refers to any user who browses or purchases products on the Platform.</li>
            <li><strong>"Vendor"</strong> refers to any registered seller who lists and sells products through the Platform.</li>
            <li><strong>"Listing"</strong> refers to a product or service offered for sale by a Vendor.</li>
            <li><strong>"Transaction"</strong> refers to any purchase made through the Platform.</li>
          </ul>
        </PolicySection>

        <PolicySection number="2" title="Eligibility">
          <p>
            You must be at least 18 years old to use the Platform. By using Vendorly, you represent and warrant
            that you are 18 or older and have the legal capacity to enter into these Terms. If you are using the
            Platform on behalf of a business, you represent that you are authorised to bind that business to these Terms.
          </p>
        </PolicySection>

        <PolicySection number="3" title="Account Registration">
          <p>To make purchases or sell on Vendorly, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Keep your account credentials confidential and not share your password</li>
            <li>Notify us immediately of any unauthorised access to your account</li>
            <li>Take responsibility for all activity that occurs under your account</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
          </p>
        </PolicySection>

        <PolicySection number="4" title="Buying on Vendorly">
          <p>When you make a purchase on Vendorly:</p>
          <ul>
            <li>You enter into a contract directly with the Vendor, not with Vendorly.</li>
            <li>Vendorly acts as an intermediary facilitating the transaction and processing payment.</li>
            <li>Product descriptions, pricing, and availability are set by Vendors. We do not guarantee accuracy.</li>
            <li>Delivery timelines are estimates provided by Vendors and are not guaranteed by Vendorly.</li>
            <li>Returns and refunds are subject to the Vendor's return policy displayed on their store page.</li>
          </ul>
        </PolicySection>

        <PolicySection number="5" title="Selling on Vendorly">
          <p>If you register as a Vendor, you additionally agree to:</p>
          <ul>
            <li>Provide accurate product descriptions, images, and pricing for all listings.</li>
            <li>Only list products you legally own or have the right to sell.</li>
            <li>Not list counterfeit, stolen, hazardous, or prohibited items.</li>
            <li>Fulfil orders promptly and communicate with buyers in good faith.</li>
            <li>Comply with all applicable laws, including consumer protection and tax regulations.</li>
            <li>Pay platform fees and commissions as set out in your Vendor agreement.</li>
            <li>Not circumvent the Platform to transact directly with buyers outside Vendorly.</li>
          </ul>
        </PolicySection>

        <PolicySection number="6" title="Prohibited Activities">
          <p>You agree not to:</p>
          <ul>
            <li>Use the Platform for any unlawful purpose or in violation of any regulations</li>
            <li>Engage in fraudulent, deceptive, or misleading conduct</li>
            <li>Harass, abuse, or harm other users or Vendors</li>
            <li>Post false reviews or manipulate ratings</li>
            <li>Scrape, copy, or reproduce Platform content without permission</li>
            <li>Attempt to gain unauthorised access to any part of the Platform</li>
            <li>Introduce malware, viruses, or other malicious code</li>
            <li>Use automated tools to interact with the Platform without our written consent</li>
          </ul>
        </PolicySection>

        <PolicySection number="7" title="Payments & Fees">
          <p>
            Vendorly uses third-party payment processors to handle all transactions. By making a purchase,
            you authorise us to charge your selected payment method for the total order amount, including
            applicable taxes and shipping fees.
          </p>
          <p>
            Vendors are charged a platform commission on each completed sale, as detailed in the Vendor
            dashboard. Payouts to Vendors are processed on a rolling basis, subject to our payout schedule.
          </p>
        </PolicySection>

        <PolicySection number="8" title="Returns & Disputes">
          <p>
            Each Vendor sets their own return policy. We encourage buyers to review a Vendor's policy before
            purchasing. If a dispute arises between a buyer and a Vendor, Vendorly may offer mediation at
            our discretion, but we are not responsible for resolving disputes or guaranteeing refunds unless
            the Vendor has violated our policies.
          </p>
          <p>
            In cases of clear fraud or a significant breach of Vendor obligations, Vendorly reserves the right
            to issue refunds and take action against the Vendor's account.
          </p>
        </PolicySection>

        <PolicySection number="9" title="Intellectual Property">
          <p>
            All content on the Platform — including logos, design, text, software, and graphics — is the
            property of Vendorly or its licensors and is protected by intellectual property laws. You may not
            use, reproduce, or distribute any Platform content without our express written permission.
          </p>
          <p>
            By uploading product images, descriptions, or other content to the Platform, you grant Vendorly
            a non-exclusive, royalty-free licence to use, display, and promote that content in connection
            with our services.
          </p>
        </PolicySection>

        <PolicySection number="10" title="Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Vendorly shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from your use of the Platform, including but
            not limited to loss of profits, data, or goodwill.
          </p>
          <p>
            Our total liability to you for any claim arising from these Terms or your use of the Platform
            shall not exceed the amount you paid to Vendorly in the three months preceding the claim.
          </p>
        </PolicySection>

        <PolicySection number="11" title="Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of the Federal Republic of
            Nigeria. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of
            the courts of Lagos State, Nigeria.
          </p>
        </PolicySection>

        <PolicySection number="12" title="Changes to These Terms">
          <p>
            We may update these Terms from time to time. We will notify registered users of material changes
            via email or an in-app notice. Your continued use of the Platform after the effective date of
            any changes constitutes your acceptance of the revised Terms.
          </p>
        </PolicySection>

        <PolicySection number="13" title="Contact Us">
          <p>For questions about these Terms, contact us:</p>
          <div className="bg-[#fafaf9] border border-[#e5e5e5] rounded-2xl p-5 mt-3">
            <p className="text-sm text-[#6b6b6b]"><strong className="text-[#111111]">Vendorly Ltd.</strong></p>
            <p className="text-sm text-[#6b6b6b]">1 Innovation Drive, Victoria Island, Lagos, Nigeria</p>
            <p className="text-sm text-[#6b6b6b] mt-1">
              Email: <a href="mailto:legal@vendorly.com" className="text-[#c8a951] hover:underline">legal@vendorly.com</a>
            </p>
            <p className="text-sm text-[#6b6b6b]">
              Or use our <Link href="/contact" className="text-[#c8a951] hover:underline">contact form</Link>.
            </p>
          </div>
        </PolicySection>

        {/* Footer links */}
        <div className="border-t border-[#e5e5e5] pt-6 mt-8 flex flex-wrap gap-4 text-sm text-[#9ca3af]">
          <Link href="/privacy-policy" className="hover:text-[#c8a951] transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-[#c8a951] transition-colors">Contact Us</Link>
          <span>·</span>
          <Link href="/" className="hover:text-[#c8a951] transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

function PolicySection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-xl font-bold text-[#111111] mb-3">
        {number}. {title}
      </h2>
      <div className="text-[#6b6b6b] leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-[#111111] [&_a]:text-[#c8a951] [&_a:hover]:underline">
        {children}
      </div>
    </div>
  )
}
