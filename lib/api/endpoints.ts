// -----------------------------------------------------------------------------
// File: endpoints.ts
// Path: lib/api/endpoints.ts
//
// Single source of truth for all API endpoint paths.
// Update these when the backend routes are finalised.
// -----------------------------------------------------------------------------

export const ENDPOINTS = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  auth: {
    login:          '/auth/login',
    register:       '/auth/register',
    logout:         '/auth/logout',
    refresh:        '/auth/refresh',
    me:             '/auth/me',
  },

  // ── Vendor portal ───────────────────────────────────────────────────────────
  vendor: {
    profile:        '/vendor/profile',
    settings:       '/vendor/settings',
    products: {
      list:         '/vendor/products',
      create:       '/vendor/products',
      detail:       (id: string) => `/vendor/products/${id}`,
      update:       (id: string) => `/vendor/products/${id}`,
      delete:       (id: string) => `/vendor/products/${id}`,
    },
    orders: {
      list:         '/vendor/orders',
      detail:       (id: string) => `/vendor/orders/${id}`,
      updateStatus: (id: string) => `/vendor/orders/${id}/status`,
    },
    analytics:      '/vendor/analytics',
    payouts:        '/vendor/payouts',
    reviews:        '/vendor/reviews',
    coupons: {
      list:         '/vendor/coupons',
      create:       '/vendor/coupons',
      delete:       (id: string) => `/vendor/coupons/${id}`,
    },
    customers:      '/vendor/customers',
    billing: {
      plan:         '/vendor/billing/plan',
      checkout:     '/vendor/billing/checkout',   // Stripe Checkout session
      portal:       '/vendor/billing/portal',     // Stripe Customer Portal
    },
  },

  // ── Admin portal ────────────────────────────────────────────────────────────
  admin: {
    analytics:     '/admin/analytics',
    vendors: {
      list:        '/admin/vendors',
      detail:      (id: string) => `/admin/vendors/${id}`,
      approve:     (id: string) => `/admin/vendors/${id}/approve`,
      suspend:     (id: string) => `/admin/vendors/${id}/suspend`,
    },
    users: {
      list:        '/admin/users',
      detail:      (id: string) => `/admin/users/${id}`,
      suspend:     (id: string) => `/admin/users/${id}/suspend`,
    },
    orders: {
      list:        '/admin/orders',
      detail:      (id: string) => `/admin/orders/${id}`,
    },
    products: {
      list:        '/admin/products',
      detail:      (id: string) => `/admin/products/${id}`,
    },
    reviews:       '/admin/reviews',
    payouts:       '/admin/payouts',
    coupons:       '/admin/coupons',
    settings:      '/admin/settings',
  },

  // ── Storefront (public) ──────────────────────────────────────────────────────
  storefront: {
    products: {
      list:        '/products',
      detail:      (slug: string) => `/products/${slug}`,
      search:      '/products/search',
    },
    categories:    '/categories',
    vendors: {
      list:        '/vendors',
      detail:      (slug: string) => `/vendors/${slug}`,
    },
    cart:          '/cart',
    orders:        '/orders',
    checkout:      '/checkout',
  },
} as const
