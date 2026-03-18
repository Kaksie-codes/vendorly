// -----------------------------------------------------------------------------
// File: users.ts
// Path: lib/api/admin/users.ts
// -----------------------------------------------------------------------------

import { apiClient } from '@/lib/api/client'
import { ENDPOINTS }  from '@/lib/api/endpoints'
import type { User, UserStatus, PaginationMeta } from '@/types'

export interface AdminUserListParams {
  page?:     number
  pageSize?: number
  search?:   string
  role?:     User['role']
  status?:   UserStatus
}

export interface AdminUserListResponse {
  users:      User[]
  pagination: PaginationMeta
}

export const adminUsersApi = {
  list: (params?: AdminUserListParams) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return apiClient.get<AdminUserListResponse>(`${ENDPOINTS.admin.users.list}?${qs}`)
  },

  detail: (id: string) =>
    apiClient.get<User>(ENDPOINTS.admin.users.detail(id)),

  suspend: (id: string, reason: string) =>
    apiClient.post<User>(ENDPOINTS.admin.users.suspend(id), { reason }),
}
