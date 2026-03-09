// ─────────────────────────────────────────────────────────────────────────────
// File: categories.ts
// Path: lib/mock-data/categories.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { Category } from '@/types'

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets, devices, and accessories for modern living.',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80',
    icon: '💻',
    productCount: 248,
    featured: true,
  },
  {
    id: 'cat-2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, and accessories for every style.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    icon: '👗',
    productCount: 512,
    featured: true,
    children: [
      {
        id: 'cat-2-1',
        name: "Women's Clothing",
        slug: 'womens-clothing',
        parentId: 'cat-2',
        productCount: 210,
        featured: false,
      },
      {
        id: 'cat-2-2',
        name: "Men's Clothing",
        slug: 'mens-clothing',
        parentId: 'cat-2',
        productCount: 185,
        featured: false,
      },
      {
        id: 'cat-2-3',
        name: 'Footwear',
        slug: 'footwear',
        parentId: 'cat-2',
        productCount: 117,
        featured: false,
      },
    ],
  },
  {
    id: 'cat-3',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture, décor, and essentials for your home.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    icon: '🏠',
    productCount: 334,
    featured: true,
  },
  {
    id: 'cat-4',
    name: 'Beauty & Care',
    slug: 'beauty-care',
    description: 'Skincare, haircare, and wellness products.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    icon: '✨',
    productCount: 189,
    featured: true,
  },
  {
    id: 'cat-5',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Equipment and gear for every sport and adventure.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    icon: '⚽',
    productCount: 156,
    featured: false,
  },
  {
    id: 'cat-6',
    name: 'Art & Crafts',
    slug: 'art-crafts',
    description: 'Handmade goods, art supplies, and creative tools.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
    icon: '🎨',
    productCount: 98,
    featured: true,
  },
  {
    id: 'cat-7',
    name: 'Books & Stationery',
    slug: 'books-stationery',
    description: 'Books, journals, planners, and office supplies.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    icon: '📚',
    productCount: 143,
    featured: false,
  },
  {
    id: 'cat-8',
    name: 'Food & Gourmet',
    slug: 'food-gourmet',
    description: 'Artisan foods, snacks, and gourmet ingredients.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    icon: '🍽️',
    productCount: 76,
    featured: false,
  },
  {
    id: 'cat-9',
    name: 'Toys & Kids',
    slug: 'toys-kids',
    description: 'Toys, games, and accessories for children.',
    image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=600&q=80',
    icon: '🧸',
    productCount: 112,
    featured: false,
  },
  {
    id: 'cat-10',
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Fine jewelry, watches, and accessories.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    icon: '💎',
    productCount: 87,
    featured: true,
  },
]

export const getFeaturedCategories = () =>
  mockCategories.filter((c) => c.featured)

export const getCategoryBySlug = (slug: string) =>
  mockCategories.find((c) => c.slug === slug)

export const getTopLevelCategories = () =>
  mockCategories.filter((c) => !c.parentId)