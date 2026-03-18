// -----------------------------------------------------------------------------
// File: useOrders.ts
// Path: lib/hooks/vendor/useOrders.ts
//
// TanStack Query hooks for vendor order management.
// Uncomment after: npm install @tanstack/react-query
// -----------------------------------------------------------------------------

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { vendorOrdersApi, OrderListParams } from '@/lib/api/vendor/orders'
// import type { OrderStatus } from '@/types'

export const vendorOrderKeys = {
  all:    ['vendor', 'orders'] as const,
  list:   (params?: object) => [...vendorOrderKeys.all, 'list', params] as const,
  detail: (id: string)      => [...vendorOrderKeys.all, 'detail', id] as const,
}

/*
export function useVendorOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: vendorOrderKeys.list(params),
    queryFn:  () => vendorOrdersApi.list(params),
  })
}

export function useVendorOrder(id: string) {
  return useQuery({
    queryKey: vendorOrderKeys.detail(id),
    queryFn:  () => vendorOrdersApi.detail(id),
    enabled:  !!id,
  })
}

export function useUpdateOrderStatus(orderId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status: OrderStatus) => vendorOrdersApi.updateStatus(orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorOrderKeys.detail(orderId) })
      qc.invalidateQueries({ queryKey: vendorOrderKeys.all })
    },
  })
}
*/

export {}
