// -----------------------------------------------------------------------------
// File: useAnalytics.ts
// Path: lib/hooks/vendor/useAnalytics.ts
//
// TanStack Query hook for vendor analytics data.
// Uncomment after: npm install @tanstack/react-query
// -----------------------------------------------------------------------------

// import { useQuery } from '@tanstack/react-query'
// import { vendorAnalyticsApi, AnalyticsPeriod } from '@/lib/api/vendor/analytics'

export const vendorAnalyticsKeys = {
  all:    ['vendor', 'analytics'] as const,
  period: (p: string) => [...vendorAnalyticsKeys.all, p] as const,
}

/*
export function useVendorAnalytics(period: AnalyticsPeriod = '30d') {
  return useQuery({
    queryKey: vendorAnalyticsKeys.period(period),
    queryFn:  () => vendorAnalyticsApi.get(period),
    staleTime: 5 * 60 * 1000,  // analytics are stale after 5 min
  })
}
*/

export {}
