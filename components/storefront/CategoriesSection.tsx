import { getFeaturedCategories } from '@/lib/mock-data'
import Link from 'next/link'

// ── Bespoke SVG icons, one per category slug ──────────────────────────────────
const CategoryIcon = ({ slug, className }: { slug: string; className?: string }) => {
  const props = {
    width: 28,
    height: 28,
    viewBox: '0 0 28 28',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  }

  switch (slug) {
    case 'electronics':
      return (
        <svg {...props}>
          {/* Laptop */}
          <rect x="4" y="6" width="20" height="13" rx="2" />
          <path d="M2 19h24" />
          <path d="M11 22h6" />
          <circle cx="14" cy="12.5" r="2" />
        </svg>
      )
    case 'fashion':
      return (
        <svg {...props}>
          {/* Dress / hanger */}
          <path d="M14 4a2 2 0 0 1 2 2" />
          <path d="M14 4a2 2 0 0 0-2 2" />
          <path d="M12 6C8 8 5 10 5 13h18c0-3-3-5-7-7" />
          <path d="M5 13v9h18v-9" />
        </svg>
      )
    case 'home-living':
      return (
        <svg {...props}>
          {/* House */}
          <path d="M3 12L14 3l11 9" />
          <path d="M5 10v13h6v-6h6v6h6V10" />
          <rect x="11" y="17" width="6" height="6" />
        </svg>
      )
    case 'beauty-care':
      return (
        <svg {...props}>
          {/* Perfume bottle */}
          <rect x="9" y="9" width="10" height="14" rx="2" />
          <path d="M12 9V6h4v3" />
          <path d="M14 4v2" />
          <path d="M12 14h4" />
          <path d="M12 17h4" />
        </svg>
      )
    case 'sports-outdoors':
      return (
        <svg {...props}>
          {/* Trophy */}
          <path d="M8 3h12v10a6 6 0 0 1-12 0V3z" />
          <path d="M8 7H4a2 2 0 0 0 0 4h4" />
          <path d="M20 7h4a2 2 0 0 1 0 4h-4" />
          <path d="M14 19v4" />
          <path d="M10 23h8" />
        </svg>
      )
    case 'art-crafts':
      return (
        <svg {...props}>
          {/* Paint palette */}
          <path d="M14 2C8.5 2 4 6.5 4 12c0 3.5 2 5 4 5h2c1 0 2 .5 2 2s1 3 3 3c5.5 0 9-4.5 9-10C24 6.5 19.5 2 14 2z" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14" cy="6" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="9" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="15" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'books-stationery':
      return (
        <svg {...props}>
          {/* Open book */}
          <path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4V4z" />
          <path d="M24 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7V4z" />
          <path d="M13 6v14" />
        </svg>
      )
    case 'food-gourmet':
      return (
        <svg {...props}>
          {/* Cloche / dome */}
          <path d="M4 16h20" />
          <path d="M6 16C6 10.5 9.6 6 14 6s8 4.5 8 10" />
          <path d="M11 6.5C11 5 12.3 4 14 4s3 1 3 2.5" />
          <path d="M4 19h20" />
        </svg>
      )
    case 'toys-kids':
      return (
        <svg {...props}>
          {/* Building blocks */}
          <rect x="3" y="14" width="8" height="8" rx="1" />
          <rect x="17" y="14" width="8" height="8" rx="1" />
          <rect x="10" y="6" width="8" height="8" rx="1" />
        </svg>
      )
    case 'jewelry':
      return (
        <svg {...props}>
          {/* Diamond */}
          <path d="M6 4h16l4 6-12 14L2 10l4-6z" />
          <path d="M2 10h24" />
          <path d="M6 4l4 6M22 4l-4 6M10 10L14 24M18 10L14 24" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="14" cy="14" r="10" />
          <path d="M14 8v6l4 2" />
        </svg>
      )
  }
}

// ── Accent color per category for the icon container ─────────────────────────
const categoryAccent: Record<string, { bg: string; text: string; border: string }> = {
  electronics:      { bg: 'bg-info-light',         text: 'text-info',     border: 'border-info-border' },
  fashion:          { bg: 'bg-purple-bg',           text: 'text-purple',   border: 'border-purple/20' },
  'home-living':    { bg: 'bg-success-light',       text: 'text-success',  border: 'border-success-border' },
  'beauty-care':    { bg: 'bg-danger-pink-light',   text: 'text-error',    border: 'border-danger-pink' },
  'sports-outdoors':{ bg: 'bg-warning-light',       text: 'text-warning',  border: 'border-warning-border' },
  'art-crafts':     { bg: 'bg-accent-gold-muted',   text: 'text-accent-gold-dark', border: 'border-accent-gold-light' },
  'books-stationery':{ bg: 'bg-info-light',         text: 'text-info',     border: 'border-info-border' },
  'food-gourmet':   { bg: 'bg-success-light',       text: 'text-success',  border: 'border-success-border' },
  'toys-kids':      { bg: 'bg-warning-light',       text: 'text-warning',  border: 'border-warning-border' },
  jewelry:          { bg: 'bg-accent-gold-muted',   text: 'text-accent-gold-dark', border: 'border-accent-gold-light' },
}

const CategoriesSection = () => {
  const categories = getFeaturedCategories().slice(0, 6)

  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-gold mb-2">
            Browse by Category
          </p>
          <h2 className="font-serif text-3xl font-bold text-text-primary">Shop Every Category</h2>
        </div>
        <Link
          href="/products"
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          View all{' '}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const accent = categoryAccent[cat.slug] ?? {
            bg: 'bg-bg-subtle',
            text: 'text-text-secondary',
            border: 'border-border-subtle',
          }

          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative flex flex-col items-center gap-3.5 px-3 py-5 rounded-2xl bg-bg-primary border border-border-subtle hover:border-accent-gold hover:shadow-gold-sm transition-all duration-300 overflow-hidden"
            >
              {/* Subtle background wash on hover */}
              <div className="absolute inset-0 bg-accent-gold-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              {/* Icon container */}
              <div
                className={`
                  relative z-10 w-14 h-14 flex items-center justify-center rounded-xl
                  border ${accent.bg} ${accent.text} ${accent.border}
                  group-hover:scale-110 group-hover:shadow-sm
                  transition-all duration-300
                `}
              >
                <CategoryIcon slug={cat.slug} />
              </div>

              {/* Label */}
              <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                <span className="text-sm font-semibold text-text-primary leading-tight group-hover:text-accent-gold-dark transition-colors duration-200">
                  {cat.name}
                </span>
                <span className="text-xs text-text-muted tabular-nums">
                  {cat.productCount?.toLocaleString() ?? 0} items
                </span>
              </div>

              {/* Bottom gold line reveal */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-10 bg-accent-gold rounded-full transition-all duration-300" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategoriesSection