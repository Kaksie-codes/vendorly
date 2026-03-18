// -----------------------------------------------------------------------------
// File: useProducts.ts
// Path: lib/hooks/vendor/useProducts.ts
//
// TanStack Query hooks for vendor product management.
//
// Install: npm install @tanstack/react-query
// Setup:   Wrap your app with <QueryProvider> from providers/QueryProvider.tsx
// -----------------------------------------------------------------------------

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { vendorProductsApi, ProductListParams } from '@/lib/api/vendor/products'
// import type { Product } from '@/types'

// ── Query keys ───────────────────────────────────────────────────────────────
// Structured keys make cache invalidation surgical and predictable.

export const vendorProductKeys = {
  all:    ['vendor', 'products'] as const,
  list:   (params?: object) => [...vendorProductKeys.all, 'list', params] as const,
  detail: (id: string)      => [...vendorProductKeys.all, 'detail', id] as const,
}

// ── Hooks ────────────────────────────────────────────────────────────────────
// Uncomment after installing @tanstack/react-query and setting up QueryProvider.

/*
export function useVendorProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: vendorProductKeys.list(params),
    queryFn:  () => vendorProductsApi.list(params),
  })
}

export function useVendorProduct(id: string) {
  return useQuery({
    queryKey: vendorProductKeys.detail(id),
    queryFn:  () => vendorProductsApi.detail(id),
    enabled:  !!id,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Product>) => vendorProductsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: vendorProductKeys.all }),
  })
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Product>) => vendorProductsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorProductKeys.detail(id) })
      qc.invalidateQueries({ queryKey: vendorProductKeys.all })
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vendorProductsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: vendorProductKeys.all }),
  })
}
*/

export {}
