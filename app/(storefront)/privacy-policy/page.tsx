// -----------------------------------------------------------------------------
// File: page.tsx
// Path: app/(storefront)/privacy-policy/page.tsx
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Container'

export default function PrivacyPolicyPage() {
  const lastUpdated = 'March 2025'

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} className="mb-8 max-w-3xl mx-auto" />

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c8a951] mb-2">Legal</p>
        <h1 className="font-serif text-4xl font-bold text-[#111111] mb-3">Privacy Policy</h1>
        <p className="text-sm text-[#9ca3af]">Last updated: {lastUpdated}</p>
      </div>

      <div className="max-w-3xl mx-auto prose-like">
        {/* Intro */}
        <Section>
          <p className="text-[#6b6b6b] leading-relaxed">
            Vendorly ("we", "us", or "our") respects your privacy and is committed to protecting the personal
            information you share with us. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our platform, make purchases, or interact with our services.
            Please read this policy carefully. By using Vendorly, you agree to the practices described below.
          </p>
        </Section>

        <PolicySection number="1" title="Information We Collect">
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Account information</strong> — name, email address, phone number, and password when you register.</li>
            <li><strong>Profile data</strong> — shipping addresses, payment methods, wishlist, and purchase history.</li>
            <li><strong>Vendor information</strong> — store name, business address, banking details for payouts, and product listings.</li>
            <li><strong>Communications</strong> — messages you send us through support, reviews, or order inquiries.</li>
          </ul>
          <p>We also collect information automatically when you use the platform:</p>
          <ul>
            <li>Log data (IP address, browser type, pages visited, timestamps)</li>
            <li>Device information (device type, operating system)</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Transaction data (order amounts, items purchased, payment status)</li>
          </ul>
        </PolicySection>

        <PolicySection number="2" title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process orders and facilitate transactions between buyers and vendors</li>
            <li>Send order confirmations, shipping updates, and account notifications</li>
            <li>Personalise your shopping experience and product recommendations</li>
            <li>Process vendor payouts and maintain financial records</li>
            <li>Investigate and prevent fraudulent transactions and abuse</li>
            <li>Improve our platform, analyse usage trends, and conduct research</li>
            <li>Send marketing communications (with your consent, which you may withdraw at any time)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </PolicySection>

        <PolicySection number="3" title="Sharing Your Information">
          <p>We may share your information with:</p>
          <ul>
            <li><strong>Vendors</strong> — when you make a purchase, we share your name, delivery address, and order details with the relevant vendor to fulfil your order.</li>
            <li><strong>Payment processors</strong> — we use third-party payment services (e.g. Paystack, Flutterwave) to handle transactions securely. We do not store your full card details.</li>
            <li><strong>Service providers</strong> — hosting, analytics, email delivery, and customer support tools that assist us in operating the platform.</li>
            <li><strong>Legal authorities</strong> — when required by law, court order, or to protect our legal rights.</li>
          </ul>
          <p>We do not sell your personal data to third parties for marketing purposes.</p>
        </PolicySection>

        <PolicySection number="4" title="Cookies">
          <p>
            We use cookies and similar technologies to remember your preferences, keep you signed in, and
            understand how you use the platform. You can control cookies through your browser settings.
            Disabling certain cookies may affect your experience — for example, items in your cart may not persist.
          </p>
          <p>Types of cookies we use:</p>
          <ul>
            <li><strong>Strictly necessary</strong> — for core functionality like authentication and checkout</li>
            <li><strong>Analytics</strong> — to understand site usage patterns (anonymised)</li>
            <li><strong>Preference</strong> — to remember your settings and language</li>
          </ul>
        </PolicySection>

        <PolicySection number="5" title="Data Retention">
          <p>
            We retain your personal information for as long as your account is active or as needed to provide
            you with services. We also retain data as required by law (e.g. transaction records for tax compliance).
            You may request deletion of your account and associated data at any time by contacting us.
          </p>
        </PolicySection>

        <PolicySection number="6" title="Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your data ("right to be forgotten")</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability — receive your data in a machine-readable format</li>
            <li>Withdraw consent for marketing communications at any time</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@vendorly.com" className="text-[#c8a951] hover:underline">privacy@vendorly.com</a>.
          </p>
        </PolicySection>

        <PolicySection number="7" title="Security">
          <p>
            We implement industry-standard security measures to protect your personal information, including
            HTTPS encryption, secure password hashing, and access controls. However, no system is completely
            secure. If you suspect unauthorised access to your account, contact us immediately and change
            your password.
          </p>
        </PolicySection>

        <PolicySection number="8" title="Children's Privacy">
          <p>
            Vendorly is not intended for children under 13 years of age. We do not knowingly collect personal
            information from children under 13. If you believe we have inadvertently collected such information,
            please contact us and we will delete it promptly.
          </p>
        </PolicySection>

        <PolicySection number="9" title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by
            posting the new policy on this page with an updated date. Your continued use of the platform after
            changes are posted constitutes your acceptance of the revised policy.
          </p>
        </PolicySection>

        <PolicySection number="10" title="Contact Us">
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <div className="bg-[#fafaf9] border border-[#e5e5e5] rounded-2xl p-5 mt-3 not-prose">
            <p className="text-sm text-[#6b6b6b]"><strong className="text-[#111111]">Vendorly Ltd.</strong></p>
            <p className="text-sm text-[#6b6b6b]">1 Innovation Drive, Victoria Island, Lagos, Nigeria</p>
            <p className="text-sm text-[#6b6b6b] mt-1">
              Email: <a href="mailto:privacy@vendorly.com" className="text-[#c8a951] hover:underline">privacy@vendorly.com</a>
            </p>
            <p className="text-sm text-[#6b6b6b]">
              Or use our <Link href="/contact" className="text-[#c8a951] hover:underline">contact form</Link>.
            </p>
          </div>
        </PolicySection>

        {/* Footer links */}
        <div className="border-t border-[#e5e5e5] pt-6 mt-8 flex flex-wrap gap-4 text-sm text-[#9ca3af]">
          <Link href="/terms" className="hover:text-[#c8a951] transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-[#c8a951] transition-colors">Contact Us</Link>
          <span>·</span>
          <Link href="/" className="hover:text-[#c8a951] transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="mb-8 text-[#6b6b6b] leading-relaxed">{children}</div>
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
