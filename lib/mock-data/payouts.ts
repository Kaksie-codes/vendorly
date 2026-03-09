// ─────────────────────────────────────────────────────────────────────────────
// File: payouts.ts
// Path: lib/mock-data/payouts.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { Payout, Coupon } from '@/types'

// ── Payouts ───────────────────────────────────────────────────────────────────

export const mockPayouts: Payout[] = [
  {
    id: 'payout-1',
    vendorId: 'vendor-1',
    amount: 7416.00,
    currency: 'USD',
    status: 'completed',
    method: 'Bank Transfer',
    reference: 'PAY-20240301-V1-001',
    period: { from: '2024-02-01', to: '2024-02-29' },
    ordersCount: 112,
    createdAt: '2024-03-01T00:00:00Z',
    processedAt: '2024-03-03T10:00:00Z',
  },
  {
    id: 'payout-2',
    vendorId: 'vendor-1',
    amount: 6834.00,
    currency: 'USD',
    status: 'completed',
    method: 'Bank Transfer',
    reference: 'PAY-20240201-V1-001',
    period: { from: '2024-01-01', to: '2024-01-31' },
    ordersCount: 103,
    createdAt: '2024-02-01T00:00:00Z',
    processedAt: '2024-02-03T10:00:00Z',
  },
  {
    id: 'payout-3',
    vendorId: 'vendor-2',
    amount: 13212.00,
    currency: 'USD',
    status: 'completed',
    method: 'Bank Transfer',
    reference: 'PAY-20240301-V2-001',
    period: { from: '2024-02-01', to: '2024-02-29' },
    ordersCount: 223,
    createdAt: '2024-03-01T00:00:00Z',
    processedAt: '2024-03-03T11:00:00Z',
  },
  {
    id: 'payout-4',
    vendorId: 'vendor-1',
    amount: 8240.00,
    currency: 'USD',
    status: 'pending',
    method: 'Bank Transfer',
    reference: 'PAY-20240401-V1-001',
    period: { from: '2024-03-01', to: '2024-03-31' },
    ordersCount: 124,
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'payout-5',
    vendorId: 'vendor-3',
    amount: 47160.00,
    currency: 'USD',
    status: 'completed',
    method: 'Bank Transfer',
    reference: 'PAY-20240301-V3-001',
    period: { from: '2024-02-01', to: '2024-02-29' },
    ordersCount: 448,
    createdAt: '2024-03-01T00:00:00Z',
    processedAt: '2024-03-03T12:00:00Z',
  },
]

// ── Coupons ───────────────────────────────────────────────────────────────────

export const mockCoupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 50,
    maxDiscountAmount: 25,
    usageLimit: 1000,
    usageCount: 342,
    startsAt: '2024-01-01T00:00:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'coupon-2',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minOrderAmount: 30,
    usageLimit: 500,
    usageCount: 128,
    startsAt: '2024-02-01T00:00:00Z',
    expiresAt: '2024-06-30T23:59:59Z',
    isActive: true,
  },
  {
    id: 'coupon-3',
    code: 'BEAUTY20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 60,
    maxDiscountAmount: 40,
    usageLimit: 200,
    usageCount: 88,
    vendorId: 'vendor-2',
    applicableCategories: ['cat-4'],
    startsAt: '2024-02-14T00:00:00Z',
    expiresAt: '2024-04-14T23:59:59Z',
    isActive: true,
  },
  {
    id: 'coupon-4',
    code: 'SAVE15',
    type: 'fixed_amount',
    value: 15,
    minOrderAmount: 75,
    usageLimit: 300,
    usageCount: 300,
    startsAt: '2024-01-15T00:00:00Z',
    expiresAt: '2024-02-15T23:59:59Z',
    isActive: false,
  },
]

export const getPayoutsByVendor = (vendorId: string) =>
  mockPayouts.filter((p) => p.vendorId === vendorId)

export const getActiveCoupons = () =>
  mockCoupons.filter((c) => c.isActive)

export const getCouponByCode = (code: string) =>
  mockCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive)