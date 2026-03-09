/**
 * Vendorly Design Tokens
 *
 * Single source of truth for all design values.
 * These mirror what's defined in tailwind.config.ts and globals.css
 * so they can be used in JS/TS logic where CSS classes aren't available.
 */

// ─── Colors ──────────────────────────────────────────────────────────────────
export const COLORS = {
  bg: {
    primary: '#ffffff',
    card:    '#ffffff',
    muted:   '#fafaf9',
    subtle:  '#f5f5f4',
  },
  text: {
    primary:   '#111111',
    secondary: '#6b6b6b',
    muted:     '#9ca3af',
    inverse:   '#ffffff',
  },
  border: {
    subtle: '#e5e5e5',
    medium: '#d1d5db',
  },
  accent: {
    gold:      '#c8a951',
    goldLight: '#e8d5a3',
    goldDark:  '#a8892f',
    goldMuted: '#f7f1e3',
  },
  status: {
    success:       '#16a34a',
    successBg:     '#f0fdf4',
    successBorder: '#bbf7d0',
    warning:       '#d97706',
    warningBg:     '#fffbeb',
    warningBorder: '#fde68a',
    error:         '#dc2626',
    errorBg:       '#fef2f2',
    errorBorder:   '#fecaca',
    info:          '#2563eb',
    infoBg:        '#eff6ff',
    infoBorder:    '#bfdbfe',
  },
} as const

// ─── Typography ──────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  fontFamily: {
    heading: 'var(--font-heading), Playfair Display, Georgia, serif',
    body:    'var(--font-body), Inter, system-ui, sans-serif',
    mono:    'var(--font-mono), JetBrains Mono, Fira Code, monospace',
  },
  fontWeight: {
    light:    300,
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
    extrabold:800,
    black:    900,
  },
} as const

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const SPACING = {
  headerHeight:    64,   // px
  sidebarWidth:    260,  // px
  containerPadSm:  16,   // px
  containerPadMd:  24,   // px
  containerPadLg:  32,   // px
  containerPadXl:  48,   // px
  siteMaxWidth:    1440, // px
  contentMaxWidth: 1280, // px
} as const

// ─── Breakpoints ─────────────────────────────────────────────────────────────
export const BREAKPOINTS = {
  xs:  480,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1440,
  '3xl': 1920,
} as const

// ─── Z-index scale ────────────────────────────────────────────────────────────
export const Z_INDEX = {
  below:    -1,
  base:     0,
  raised:   1,
  dropdown: 100,
  sticky:   200,
  overlay:  300,
  modal:    400,
  toast:    500,
  tooltip:  600,
} as const

// ─── Border Radius ────────────────────────────────────────────────────────────
export const BORDER_RADIUS = {
  xs:   '0.125rem',
  sm:   '0.25rem',
  md:   '0.5rem',
  lg:   '0.75rem',
  xl:   '1rem',
  '2xl':'1.25rem',
  '3xl':'1.5rem',
  full: '9999px',
} as const

// ─── Transition durations ─────────────────────────────────────────────────────
export const TRANSITIONS = {
  fast:   '150ms',
  base:   '200ms',
  slow:   '300ms',
  slower: '400ms',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

// ─── Site config ─────────────────────────────────────────────────────────────
export const SITE_CONFIG = {
  name:        'Vendorly',
  tagline:     'Multi-Vendor Marketplace',
  description: 'Discover unique products from trusted vendors.',
  url:         'https://vendorly.com',
  email:       'hello@vendorly.com',
  social: {
    twitter:   'https://twitter.com/vendorly',
    instagram: 'https://instagram.com/vendorly',
    facebook:  'https://facebook.com/vendorly',
  },
  currency: {
    code:   'USD',
    symbol: '$',
    locale: 'en-US',
  },
  pagination: {
    defaultPageSize:  24,
    pageSizeOptions: [12, 24, 48, 96],
  },
} as const