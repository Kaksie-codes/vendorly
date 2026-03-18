// -----------------------------------------------------------------------------
// File: products.ts
// Path: lib/api/vendor/products.ts
//
// Vendor product API functions. Each function maps 1-to-1 with an endpoint
// and will replace the equivalent mock-data calls once the backend is live.
// -----------------------------------------------------------------------------

import { apiClient } from '@/lib/api/client'
import { ENDPOINTS }  from '@/lib/api/endpoints'
import type { Product, PaginationMeta } from '@/types'

export interface ProductListParams {
  page?:     number
  pageSize?: number
  search?:   string
  status?:   Product['status']
  sort?:     'newest' | 'oldest' | 'price_asc' | 'price_desc'
}

export interface ProductListResponse {
  products:   Product[]
  pagination: PaginationMeta
}

export const vendorProductsApi = {
  list: (params?: ProductListParams) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return apiClient.get<ProductListResponse>(`${ENDPOINTS.vendor.products.list}?${qs}`)
  },

  detail: (id: string) =>
    apiClient.get<Product>(ENDPOINTS.vendor.products.detail(id)),

  create: (payload: Partial<Product>) =>
    apiClient.post<Product>(ENDPOINTS.vendor.products.create, payload),

  update: (id: string, payload: Partial<Product>) =>
    apiClient.patch<Product>(ENDPOINTS.vendor.products.update(id), payload),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean }>(ENDPOINTS.vendor.products.delete(id)),
}
