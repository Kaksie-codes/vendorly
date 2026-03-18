// -----------------------------------------------------------------------------
// File: analytics.ts
// Path: lib/api/vendor/analytics.ts
// -----------------------------------------------------------------------------

import { apiClient } from '@/lib/api/client'
import { ENDPOINTS }  from '@/lib/api/endpoints'
import type { VendorAnalytics } from '@/types'

export type AnalyticsPeriod = '7d' | '30d' | '90d' | 'all'

export const vendorAnalyticsApi = {
  get: (period: AnalyticsPeriod = '30d') =>
    apiClient.get<VendorAnalytics>(`${ENDPOINTS.vendor.analytics}?period=${period}`),
}
