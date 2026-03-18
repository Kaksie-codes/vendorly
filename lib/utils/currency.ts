// -----------------------------------------------------------------------------
// File: currency.ts
// Path: lib/utils/currency.ts
// Centralised currency formatting — eliminates repeated ₦${val.toLocaleString()}
// throughout the codebase.
// -----------------------------------------------------------------------------

type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'GBP'

const SYMBOLS: Record<CurrencyCode, string> = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

/**
 * Format a raw number into a currency string.
 * Defaults to NGN for the Nigerian market; pass 'USD' for international pricing.
 *
 * @example formatCurrency(87600)          → "₦87,600"
 * @example formatCurrency(29, 'USD')      → "$29"
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'NGN'): string {
  return `${SYMBOLS[currency]}${amount.toLocaleString()}`
}

/**
 * Compact notation for large numbers — useful in dashboards / stat cards.
 *
 * @example formatCurrencyCompact(524000)         → "₦524k"
 * @example formatCurrencyCompact(1_200_000)      → "₦1.2M"
 * @example formatCurrencyCompact(29, 'USD')      → "$29"
 */
export function formatCurrencyCompact(amount: number, currency: CurrencyCode = 'NGN'): string {
  const sym = SYMBOLS[currency]
  if (amount >= 1_000_000) return `${sym}${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000)     return `${sym}${(amount / 1_000).toFixed(0)}k`
  return `${sym}${amount.toLocaleString()}`
}

/**
 * Detect the preferred currency from a browser locale string.
 * Falls back to NGN if locale is not recognised.
 *
 * @example detectCurrency('en-NG') → 'NGN'
 * @example detectCurrency('en-US') → 'USD'
 */
export function detectCurrency(locale?: string): CurrencyCode {
  const tag = (locale ?? (typeof navigator !== 'undefined' ? navigator.language : '')).toLowerCase()
  if (tag.endsWith('-ng') || tag === 'ng') return 'NGN'
  if (tag.endsWith('-gb'))                return 'GBP'
  if (tag.endsWith('-eu') || ['de', 'fr', 'it', 'es', 'nl', 'pt'].some((l) => tag.startsWith(l + '-e'))) return 'EUR'
  if (tag.endsWith('-us') || tag.startsWith('en-us'))  return 'USD'
  return 'NGN' // default for Vendorly's primary market
}
