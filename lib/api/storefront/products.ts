// -----------------------------------------------------------------------------
// File: products.ts
// Path: lib/api/storefront/products.ts
// -----------------------------------------------------------------------------

import { apiClient } from '@/lib/api/client'
import { ENDPOINTS }  from '@/lib/api/endpoints'
import type { Product, PaginationMeta } from '@/types'

export interface StorefrontProductListParams {
  page?:       number
  pageSize?:   number
  search?:     string
  categoryId?: string
  vendorId?:   string
  minPrice?:   number
  maxPrice?:   number
  sort?:       'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating'
}

export interface StorefrontProductListResponse {
  products:   Product[]
  pagination: PaginationMeta
}

export const storefrontProductsApi = {
  list: (params?: StorefrontProductListParams) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return apiClient.get<StorefrontProductListResponse>(`${ENDPOINTS.storefront.products.list}?${qs}`)
  },

  detail: (slug: string) =>
    apiClient.get<Product>(ENDPOINTS.storefront.products.detail(slug)),

  search: (query: string) =>
    apiClient.get<StorefrontProductListResponse>(`${ENDPOINTS.storefront.products.search}?q=${encodeURIComponent(query)}`),
}
