// ─────────────────────────────────────────────────────────────────────────────
// File: products.ts
// Path: lib/mock-data/products.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { Product } from "@/types"

export const mockProducts: Product[] = [
  // ── Crafted & Co. products ────────────────────────────────────────────────
  {
    id: 'prod-1',
    vendorId: 'vendor-1',
    categoryId: 'cat-6',
    name: 'Handwoven Leather Journal',
    slug: 'handwoven-leather-journal',
    description:
      'A beautifully handcrafted leather journal with 200 pages of acid-free paper. Each journal is unique — the natural grain variations make every piece one of a kind. Perfect for writing, sketching, or keeping as a keepsake.',
    shortDescription: 'Handcrafted leather journal with 200 acid-free pages.',
    images: [
      { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80', alt: 'Handwoven Leather Journal front cover' },
      { url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80', alt: 'Journal open pages' },
      { url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', alt: 'Journal texture close-up' },
    ],
    price: 64.99,
    compareAtPrice: 89.99,
    currency: 'USD',
    sku: 'CC-LJ-001',
    stock: 24,
    status: 'active',
    condition: 'new',
    tags: ['journal', 'leather', 'handmade', 'stationery'],
    rating: 4.9,
    reviewCount: 87,
    soldCount: 312,
    featured: true,
    isBestseller: true,
    isNew: false,
    weight: 420,
    createdAt: '2023-02-10T10:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'prod-2',
    vendorId: 'vendor-1',
    categoryId: 'cat-6',
    name: 'Macramé Wall Hanging — Large',
    slug: 'macrame-wall-hanging-large',
    description:
      'Hand-knotted macramé wall hanging made from 100% natural cotton rope. A statement piece for any living space. Each one is made to order and may have slight variations.',
    shortDescription: 'Hand-knotted natural cotton macramé wall art.',
    images: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', alt: 'Macramé wall hanging' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Macramé detail' },
    ],
    price: 129.00,
    currency: 'USD',
    sku: 'CC-MW-001',
    stock: 8,
    status: 'active',
    condition: 'new',
    tags: ['macrame', 'wall art', 'handmade', 'boho'],
    rating: 4.7,
    reviewCount: 43,
    soldCount: 98,
    featured: false,
    isBestseller: false,
    isNew: false,
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'prod-3',
    vendorId: 'vendor-1',
    categoryId: 'cat-3',
    name: 'Ceramic Pour-Over Coffee Set',
    slug: 'ceramic-pour-over-coffee-set',
    description:
      'A handthrown ceramic pour-over set including a dripper, carafe, and two mugs. Food-safe glaze, dishwasher safe. Available in three earthy colorways.',
    shortDescription: 'Handthrown ceramic pour-over dripper, carafe, and mugs.',
    images: [
      { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', alt: 'Ceramic pour-over set' },
      { url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=800&q=80', alt: 'Coffee set detail' },
    ],
    price: 94.00,
    compareAtPrice: 110.00,
    currency: 'USD',
    variantOptions: [{ name: 'Color', values: ['Ash Grey', 'Terracotta', 'Cream White'] }],
    variants: [
      { id: 'var-3-1', sku: 'CC-CP-001-ASH', options: { Color: 'Ash Grey' },    price: 94.00, stock: 6,  image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
      { id: 'var-3-2', sku: 'CC-CP-001-TER', options: { Color: 'Terracotta' },  price: 94.00, stock: 4,  image: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400&q=80' },
      { id: 'var-3-3', sku: 'CC-CP-001-CRM', options: { Color: 'Cream White' }, price: 94.00, stock: 10, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
    ],
    sku: 'CC-CP-001',
    stock: 20,
    status: 'active',
    condition: 'new',
    tags: ['ceramic', 'coffee', 'pour-over', 'handmade', 'kitchen'],
    rating: 4.8,
    reviewCount: 61,
    soldCount: 210,
    featured: true,
    isBestseller: true,
    isNew: false,
    createdAt: '2023-03-15T10:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z',
  },

  // ── Lumière Beauty products ───────────────────────────────────────────────
  {
    id: 'prod-4',
    vendorId: 'vendor-2',
    categoryId: 'cat-4',
    name: 'Radiance Serum — Vitamin C & Niacinamide',
    slug: 'radiance-serum-vitamin-c-niacinamide',
    description:
      'A brightening serum combining 15% L-ascorbic acid with 5% niacinamide. Reduces dark spots, improves skin texture, and gives a luminous glow. Suitable for all skin types. Fragrance-free and vegan.',
    shortDescription: 'Brightening vitamin C + niacinamide serum for all skin types.',
    images: [
      { url: 'https://images.unsplash.com/photo-1656147961590-c454747afb06?q=80&w=385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Radiance Serum bottle' },
      { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', alt: 'Serum texture' },
    ],
    price: 48.00,
    compareAtPrice: 58.00,
    currency: 'USD',
    variantOptions: [{ name: 'Size', values: ['30ml', '50ml'] }],
    variants: [
      { id: 'var-4-1', sku: 'LB-RS-001-30', options: { Size: '30ml' }, price: 48.00, stock: 40 },
      { id: 'var-4-2', sku: 'LB-RS-001-50', options: { Size: '50ml' }, price: 68.00, stock: 28 },
    ],
    sku: 'LB-RS-001',
    stock: 68,
    status: 'active',
    condition: 'new',
    tags: ['serum', 'vitamin c', 'niacinamide', 'brightening', 'skincare'],
    rating: 4.9,
    reviewCount: 214,
    soldCount: 1840,
    featured: true,
    isBestseller: true,
    isNew: false,
    weight: 85,
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
  },
  {
    id: 'prod-5',
    vendorId: 'vendor-2',
    categoryId: 'cat-4',
    name: 'Hydra Barrier Moisturiser',
    slug: 'hydra-barrier-moisturiser',
    description:
      'A rich yet lightweight moisturiser with ceramides, hyaluronic acid, and shea butter. Repairs skin barrier and locks in hydration for 72 hours. Fragrance-free, dermatologist tested.',
    shortDescription: 'Ceramide-rich moisturiser for 72-hour hydration.',
    images: [
      { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80', alt: 'Hydra Barrier Moisturiser' },
    ],
    price: 38.00,
    currency: 'USD',
    sku: 'LB-HM-001',
    stock: 54,
    status: 'active',
    condition: 'new',
    tags: ['moisturiser', 'ceramide', 'hydration', 'skincare'],
    rating: 4.7,
    reviewCount: 128,
    soldCount: 940,
    featured: false,
    isBestseller: false,
    isNew: true,
    weight: 120,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
  },
  {
    id: 'prod-6',
    vendorId: 'vendor-2',
    categoryId: 'cat-4',
    name: 'Velvet Lip Tint — 6-Shade Collection',
    slug: 'velvet-lip-tint-collection',
    description:
      'Long-lasting lip tints with a comfortable velvet finish. Infused with vitamin E and jojoba oil. Buildable colour, transfer-proof formula. Cruelty-free.',
    shortDescription: 'Vitamin E-infused velvet lip tints, 6 shades.',
    images: [
      { url: 'https://images.unsplash.com/photo-1654374504608-67c4cfe65fca?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Velvet Lip Tint shades' },
    ],
    price: 22.00,
    currency: 'USD',
    variantOptions: [{ name: 'Shade', values: ['Rosé', 'Berry', 'Nude', 'Coral', 'Plum', 'Red'] }],
    variants: [
      { id: 'var-6-1', sku: 'LB-LT-001-RS', options: { Shade: 'Rosé' },  price: 22.00, stock: 30 },
      { id: 'var-6-2', sku: 'LB-LT-001-BR', options: { Shade: 'Berry' }, price: 22.00, stock: 25 },
      { id: 'var-6-3', sku: 'LB-LT-001-NU', options: { Shade: 'Nude' },  price: 22.00, stock: 40 },
      { id: 'var-6-4', sku: 'LB-LT-001-CO', options: { Shade: 'Coral' }, price: 22.00, stock: 20 },
      { id: 'var-6-5', sku: 'LB-LT-001-PL', options: { Shade: 'Plum' },  price: 22.00, stock: 15 },
      { id: 'var-6-6', sku: 'LB-LT-001-RD', options: { Shade: 'Red' },   price: 22.00, stock: 35 },
    ],
    sku: 'LB-LT-001',
    stock: 165,
    status: 'active',
    condition: 'new',
    tags: ['lip', 'lipstick', 'velvet', 'beauty', 'makeup'],
    rating: 4.6,
    reviewCount: 76,
    soldCount: 620,
    featured: false,
    isBestseller: false,
    isNew: true,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
  },

  // ── TechNest products ────────────────────────────────────────────────────
  {
    id: 'prod-7',
    vendorId: 'vendor-3',
    categoryId: 'cat-1',
    name: 'ProSound ANC Headphones',
    slug: 'prosound-anc-headphones',
    description:
      'Over-ear wireless headphones with industry-leading active noise cancellation. 40-hour battery life, multipoint Bluetooth 5.3, and premium 40mm drivers for studio-quality sound. Foldable design for travel.',
    shortDescription: 'Wireless ANC headphones with 40-hour battery life.',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'ProSound ANC Headphones' },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', alt: 'Headphones side view' },
    ],
    price: 299.00,
    compareAtPrice: 379.00,
    currency: 'USD',
    variantOptions: [{ name: 'Color', values: ['Midnight Black', 'Pearl White', 'Navy Blue'] }],
    variants: [
      { id: 'var-7-1', sku: 'TN-HP-001-BLK', options: { Color: 'Midnight Black' }, price: 299.00, stock: 18 },
      { id: 'var-7-2', sku: 'TN-HP-001-WHT', options: { Color: 'Pearl White' },    price: 299.00, stock: 12 },
      { id: 'var-7-3', sku: 'TN-HP-001-NVY', options: { Color: 'Navy Blue' },      price: 299.00, stock: 9  },
    ],
    sku: 'TN-HP-001',
    stock: 39,
    status: 'active',
    condition: 'new',
    tags: ['headphones', 'wireless', 'ANC', 'audio', 'bluetooth'],
    rating: 4.8,
    reviewCount: 342,
    soldCount: 2100,
    featured: true,
    isBestseller: true,
    isNew: false,
    weight: 310,
    createdAt: '2023-05-10T10:00:00Z',
    updatedAt: '2024-02-20T08:00:00Z',
  },
  {
    id: 'prod-8',
    vendorId: 'vendor-3',
    categoryId: 'cat-1',
    name: 'MagCharge 3-in-1 Wireless Charging Pad',
    slug: 'magcharge-3-in-1-wireless-charging-pad',
    description:
      'Charge your phone, earbuds, and smartwatch simultaneously. MagSafe compatible, 15W fast charging. Slim profile with LED status ring. Compatible with all Qi-enabled devices.',
    shortDescription: '3-in-1 wireless charging pad, MagSafe compatible.',
    images: [
      { url: 'https://images.unsplash.com/photo-1674901583166-fc8efef37a7b?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'MagCharge wireless pad' },
    ],
    price: 79.00,
    compareAtPrice: 99.00,
    currency: 'USD',
    sku: 'TN-WC-001',
    stock: 65,
    status: 'active',
    condition: 'new',
    tags: ['charging', 'wireless', 'MagSafe', 'accessories', 'tech'],
    rating: 4.5,
    reviewCount: 189,
    soldCount: 1240,
    featured: false,
    isBestseller: false,
    isNew: false,
    weight: 180,
    createdAt: '2023-06-20T10:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'prod-9',
    vendorId: 'vendor-3',
    categoryId: 'cat-1',
    name: 'UltraSlim Laptop Stand — Aluminium',
    slug: 'ultraslim-laptop-stand-aluminium',
    description:
      'Adjustable aluminium laptop stand with ergonomic tilt angles (15°–45°). Compatible with laptops 11"–17". Folds flat for portability. Non-slip silicone pads protect your desk and laptop.',
    shortDescription: 'Adjustable aluminium laptop stand for 11"–17" laptops.',
    images: [
      { url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80', alt: 'UltraSlim laptop stand' },
    ],
    price: 49.00,
    currency: 'USD',
    sku: 'TN-LS-001',
    stock: 90,
    status: 'active',
    condition: 'new',
    tags: ['laptop stand', 'ergonomic', 'aluminium', 'accessories'],
    rating: 4.6,
    reviewCount: 267,
    soldCount: 3400,
    featured: false,
    isBestseller: true,
    isNew: false,
    weight: 560,
    createdAt: '2023-01-05T10:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
  },

  // ── Verde Home products ───────────────────────────────────────────────────
  {
    id: 'prod-10',
    vendorId: 'vendor-5',
    categoryId: 'cat-3',
    name: 'Wabi-Sabi Linen Throw Pillow',
    slug: 'wabi-sabi-linen-throw-pillow',
    description:
      'Textured linen throw pillow inspired by the Japanese wabi-sabi aesthetic. Made from 100% stonewashed European flax. Removable cover with hidden zipper. Insert included.',
    shortDescription: '100% stonewashed linen throw pillow, insert included.',
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', alt: 'Linen throw pillow' },
    ],
    price: 44.00,
    currency: 'USD',
    variantOptions: [
      { name: 'Size', values: ['45x45cm', '50x50cm', '60x60cm'] },
      { name: 'Color', values: ['Natural', 'Sage', 'Slate', 'Blush'] },
    ],
    sku: 'VH-TP-001',
    stock: 120,
    status: 'active',
    condition: 'new',
    tags: ['pillow', 'linen', 'home', 'decor', 'wabi-sabi'],
    rating: 4.5,
    reviewCount: 58,
    soldCount: 380,
    featured: false,
    isBestseller: false,
    isNew: false,
    weight: 650,
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'prod-11',
    vendorId: 'vendor-5',
    categoryId: 'cat-3',
    name: 'Solid Oak Floating Shelf — 80cm',
    slug: 'solid-oak-floating-shelf-80cm',
    description:
      'Handcrafted floating shelf from sustainably sourced solid white oak. Invisible wall mounting system included. Oiled finish for natural protection. Maximum load: 25kg.',
    shortDescription: 'Sustainably sourced solid oak floating shelf, 80cm.',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Oak floating shelf' },
    ],
    price: 118.00,
    compareAtPrice: 145.00,
    currency: 'USD',
    sku: 'VH-FS-001',
    stock: 22,
    status: 'active',
    condition: 'new',
    tags: ['shelf', 'oak', 'sustainable', 'furniture', 'home'],
    rating: 4.8,
    reviewCount: 34,
    soldCount: 145,
    featured: true,
    isBestseller: false,
    isNew: false,
    weight: 4200,
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'prod-12',
    vendorId: 'vendor-1',
    categoryId: 'cat-6',
    name: 'Beeswax Candle Set — Botanical',
    slug: 'beeswax-candle-set-botanical',
    description:
      'Set of 4 hand-poured 100% pure beeswax candles with dried botanical inclusions. Naturally honey-scented, cotton wick, 30-hour burn time each. Presented in a kraft gift box.',
    shortDescription: 'Set of 4 hand-poured beeswax candles with botanicals.',
    images: [
      { url: 'https://images.unsplash.com/photo-1668086682339-f14262879c18?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Beeswax candle set' },
      { url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80', alt: 'Candles lit' },
    ],
    price: 52.00,
    currency: 'USD',
    sku: 'CC-BC-001',
    stock: 35,
    status: 'active',
    condition: 'new',
    tags: ['candles', 'beeswax', 'botanical', 'gift', 'handmade'],
    rating: 4.9,
    reviewCount: 112,
    soldCount: 680,
    featured: true,
    isBestseller: true,
    isNew: false,
    weight: 800,
    createdAt: '2023-04-01T10:00:00Z',
    updatedAt: '2024-02-10T08:00:00Z',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getProductBySlug = (slug: string) =>
  mockProducts.find((p) => p.slug === slug)

export const getProductById = (id: string) =>
  mockProducts.find((p) => p.id === id)

export const getProductsByVendor = (vendorId: string) =>
  mockProducts.filter((p) => p.vendorId === vendorId)

export const getProductsByCategory = (categoryId: string) =>
  mockProducts.filter((p) => p.categoryId === categoryId)

export const getFeaturedProducts = () =>
  mockProducts.filter((p) => p.featured && p.status === 'active')

export const getBestsellerProducts = () =>
  mockProducts.filter((p) => p.isBestseller && p.status === 'active')

export const getNewProducts = () =>
  mockProducts.filter((p) => p.isNew && p.status === 'active')

export const getTrendingProducts = () =>
  [...mockProducts]
    .filter((p) => p.status === 'active')
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8)

export const searchProducts = (query: string) => {
  const q = query.toLowerCase()
  return mockProducts.filter(
    (p) =>
      p.status === 'active' &&
      (p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))),
  )
}