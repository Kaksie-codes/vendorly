// -----------------------------------------------------------------------------
// File: vendors.ts
// Path: lib/api/admin/vendors.ts
// -----------------------------------------------------------------------------

import { apiClient } from '@/lib/api/client'
import { ENDPOINTS }  from '@/lib/api/endpoints'
import type { Vendor, VendorStatus, PaginationMeta } from '@/types'

export interface AdminVendorListParams {
  page?:     number
  pageSize?: number
  search?:   string
  status?:   VendorStatus
}

export interface AdminVendorListResponse {
  vendors:    Vendor[]
  pagination: PaginationMeta
}

export const adminVendorsApi = {
  list: (params?: AdminVendorListParams) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return apiClient.get<AdminVendorListResponse>(`${ENDPOINTS.admin.vendors.list}?${qs}`)
  },

  detail: (id: string) =>
    apiClient.get<Vendor>(ENDPOINTS.admin.vendors.detail(id)),

  approve: (id: string) =>
    apiClient.post<Vendor>(ENDPOINTS.admin.vendors.approve(id), {}),

  suspend: (id: string, reason: string) =>
    apiClient.post<Vendor>(ENDPOINTS.admin.vendors.suspend(id), { reason }),
}
