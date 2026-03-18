// -----------------------------------------------------------------------------
// File: useVendors.ts
// Path: lib/hooks/admin/useVendors.ts
//
// TanStack Query hooks for admin vendor management.
// Uncomment after: npm install @tanstack/react-query
// -----------------------------------------------------------------------------

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { adminVendorsApi, AdminVendorListParams } from '@/lib/api/admin/vendors'

export const adminVendorKeys = {
  all:    ['admin', 'vendors'] as const,
  list:   (params?: object) => [...adminVendorKeys.all, 'list', params] as const,
  detail: (id: string)      => [...adminVendorKeys.all, 'detail', id] as const,
}

/*
export function useAdminVendors(params?: AdminVendorListParams) {
  return useQuery({
    queryKey: adminVendorKeys.list(params),
    queryFn:  () => adminVendorsApi.list(params),
  })
}

export function useAdminVendor(id: string) {
  return useQuery({
    queryKey: adminVendorKeys.detail(id),
    queryFn:  () => adminVendorsApi.detail(id),
    enabled:  !!id,
  })
}

export function useApproveVendor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminVendorsApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminVendorKeys.all }),
  })
}

export function useSuspendVendor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminVendorsApi.suspend(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminVendorKeys.all }),
  })
}
*/

export {}
