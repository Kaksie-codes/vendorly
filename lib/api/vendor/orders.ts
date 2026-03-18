// -----------------------------------------------------------------------------
// File: orders.ts
// Path: lib/api/vendor/orders.ts
// -----------------------------------------------------------------------------

import { apiClient } from '@/lib/api/client'
import { ENDPOINTS }  from '@/lib/api/endpoints'
import type { Order, OrderStatus, PaginationMeta } from '@/types'

export interface OrderListParams {
  page?:     number
  pageSize?: number
  search?:   string
  status?:   OrderStatus
}

export interface OrderListResponse {
  orders:     Order[]
  pagination: PaginationMeta
}

export const vendorOrdersApi = {
  list: (params?: OrderListParams) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return apiClient.get<OrderListResponse>(`${ENDPOINTS.vendor.orders.list}?${qs}`)
  },

  detail: (id: string) =>
    apiClient.get<Order>(ENDPOINTS.vendor.orders.detail(id)),

  updateStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<Order>(ENDPOINTS.vendor.orders.updateStatus(id), { status }),
}
