import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

// ─── Font Definitions ────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

// ─── Site Metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Vendorly — Multi-Vendor Marketplace',
    template: '%s | Vendorly',
  },
  description:
    'Discover unique products from trusted vendors. Shop handcrafted goods, premium brands, and exclusive collections on Vendorly.',
  keywords: ['marketplace', 'multi-vendor', 'ecommerce', 'shop', 'vendors'],
  authors: [{ name: 'Vendorly' }],
  creator: 'Vendorly',
  metadataBase: new URL('https://vendorly.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vendorly.com',
    siteName: 'Vendorly',
    title: 'Vendorly — Multi-Vendor Marketplace',
    description:
      'Discover unique products from trusted vendors. Shop handcrafted goods, premium brands, and exclusive collections.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vendorly — Multi-Vendor Marketplace',
    description: 'Discover unique products from trusted vendors.',
    creator: '@vendorly',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body text-text-primary bg-bg-primary antialiased">
        {children}
      </body>
    </html>
  )
}