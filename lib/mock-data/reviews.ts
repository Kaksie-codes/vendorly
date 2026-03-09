// ─────────────────────────────────────────────────────────────────────────────
// File: reviews.ts
// Path: lib/mock-data/reviews.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { Review } from '@/types'

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    productId: 'prod-1',
    vendorId: 'vendor-1',
    userId: 'user-1',
    orderId: 'order-1',
    rating: 5,
    title: 'Absolutely stunning quality',
    body: "I've bought a lot of leather journals and this is by far the best. The leather is thick and supple, the stitching is immaculate, and the paper quality is exceptional. It arrived beautifully wrapped too. Will definitely buy again.",
    status: 'published',
    helpfulCount: 24,
    verifiedPurchase: true,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    user: { id: 'user-1', firstName: 'Amara', lastName: 'Okonkwo', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
    product: { id: 'prod-1', name: 'Handwoven Leather Journal', slug: 'handwoven-leather-journal', images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80', alt: 'Journal' }] },
  },
  {
    id: 'review-2',
    productId: 'prod-1',
    vendorId: 'vendor-1',
    userId: 'user-2',
    orderId: 'order-4',
    rating: 5,
    title: 'Perfect gift',
    body: 'Bought this as a gift for my partner and they absolutely loved it. The packaging was beautiful and the journal itself is even better in person. Very happy with this purchase.',
    status: 'published',
    helpfulCount: 12,
    verifiedPurchase: true,
    createdAt: '2024-02-05T14:00:00Z',
    updatedAt: '2024-02-05T14:00:00Z',
    user: { id: 'user-2', firstName: 'James', lastName: 'Whitfield', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
    product: { id: 'prod-1', name: 'Handwoven Leather Journal', slug: 'handwoven-leather-journal', images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80', alt: 'Journal' }] },
  },
  {
    id: 'review-3',
    productId: 'prod-4',
    vendorId: 'vendor-2',
    userId: 'user-1',
    orderId: 'order-2',
    rating: 5,
    title: 'Best serum I have ever used',
    body: 'I was sceptical about the price but after two weeks my skin looks noticeably brighter and my dark spots have faded significantly. The texture is lightweight and absorbs quickly. No irritation at all on my sensitive skin.',
    images: [
      { url: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80', alt: 'Skin result' },
    ],
    status: 'published',
    helpfulCount: 67,
    verifiedPurchase: true,
    createdAt: '2024-02-14T09:00:00Z',
    updatedAt: '2024-02-14T09:00:00Z',
    user: { id: 'user-1', firstName: 'Amara', lastName: 'Okonkwo', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
    product: { id: 'prod-4', name: 'Radiance Serum', slug: 'radiance-serum-vitamin-c-niacinamide', images: [{ url: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80', alt: 'Serum' }] },
  },
  {
    id: 'review-4',
    productId: 'prod-4',
    vendorId: 'vendor-2',
    userId: 'user-3',
    orderId: 'order-5',
    rating: 4,
    title: 'Great results, slight tingle at first',
    body: 'Really happy with the results after a month of use. My skin tone looks more even and I get compliments now! Slight tingle the first few uses but that went away. Would recommend starting with every other day if you have sensitive skin.',
    status: 'published',
    helpfulCount: 31,
    verifiedPurchase: true,
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-01T11:00:00Z',
    user: { id: 'user-3', firstName: 'Sophia', lastName: 'Laurent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
    product: { id: 'prod-4', name: 'Radiance Serum', slug: 'radiance-serum-vitamin-c-niacinamide', images: [{ url: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80', alt: 'Serum' }] },
  },
  {
    id: 'review-5',
    productId: 'prod-7',
    vendorId: 'vendor-3',
    userId: 'user-2',
    orderId: 'order-3',
    rating: 5,
    title: 'Incredible noise cancellation',
    body: 'These headphones are phenomenal. I work in a busy open-plan office and these completely block out the noise. Sound quality is exceptional — deep bass, crisp highs. Battery life is as advertised. Best purchase I made this year.',
    status: 'published',
    helpfulCount: 88,
    verifiedPurchase: true,
    createdAt: '2024-01-30T16:00:00Z',
    updatedAt: '2024-01-30T16:00:00Z',
    user: { id: 'user-2', firstName: 'James', lastName: 'Whitfield', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
    product: { id: 'prod-7', name: 'ProSound ANC Headphones', slug: 'prosound-anc-headphones', images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', alt: 'Headphones' }] },
  },
  {
    id: 'review-6',
    productId: 'prod-3',
    vendorId: 'vendor-1',
    userId: 'user-3',
    orderId: 'order-6',
    rating: 5,
    title: 'Makes coffee feel like a ritual',
    body: 'The set is absolutely beautiful. The terracotta colour is even more gorgeous in person. Pour-over coffee has never tasted better — the ceramic really does make a difference. Highly recommend.',
    status: 'published',
    helpfulCount: 19,
    verifiedPurchase: true,
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-02-20T08:00:00Z',
    user: { id: 'user-3', firstName: 'Sophia', lastName: 'Laurent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
    product: { id: 'prod-3', name: 'Ceramic Pour-Over Coffee Set', slug: 'ceramic-pour-over-coffee-set', images: [{ url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', alt: 'Coffee set' }] },
  },
  {
    id: 'review-7',
    productId: 'prod-12',
    vendorId: 'vendor-1',
    userId: 'user-1',
    orderId: 'order-7',
    rating: 5,
    title: 'Perfect gift set',
    body: "Bought these candles as a housewarming gift and everyone wanted to know where they were from. The scent is subtle and natural — not overpowering like some candles. The botanical inclusions make them look stunning even unlit.",
    status: 'published',
    helpfulCount: 14,
    verifiedPurchase: true,
    createdAt: '2024-03-05T12:00:00Z',
    updatedAt: '2024-03-05T12:00:00Z',
    user: { id: 'user-1', firstName: 'Amara', lastName: 'Okonkwo', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
    product: { id: 'prod-12', name: 'Beeswax Candle Set', slug: 'beeswax-candle-set-botanical', images: [{ url: 'https://images.unsplash.com/photo-1602523961358-f9f03dd8048d?w=400&q=80', alt: 'Candles' }] },
  },
]

export const getReviewsByProduct = (productId: string) =>
  mockReviews.filter((r) => r.productId === productId && r.status === 'published')

export const getReviewsByVendor = (vendorId: string) =>
  mockReviews.filter((r) => r.vendorId === vendorId && r.status === 'published')

export const getReviewsByUser = (userId: string) =>
  mockReviews.filter((r) => r.userId === userId)

export const getAverageRating = (productId: string): number => {
  const reviews = getReviewsByProduct(productId)
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}