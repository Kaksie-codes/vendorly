// -----------------------------------------------------------------------------
// File: useProducts.ts
// Path: lib/hooks/storefront/useProducts.ts
//
// TanStack Query hooks for storefront product browsing.
// Uncomment after: npm install @tanstack/react-query
// -----------------------------------------------------------------------------

// import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
// import { storefrontProductsApi, StorefrontProductListParams } from '@/lib/api/storefront/products'

export const storefrontProductKeys = {
  all:    ['storefront', 'products'] as const,
  list:   (params?: object) => [...storefrontProductKeys.all, 'list', params] as const,
  detail: (slug: string)    => [...storefrontProductKeys.all, 'detail', slug] as const,
  search: (query: string)   => [...storefrontProductKeys.all, 'search', query] as const,
}

/*
export function useProducts(params?: StorefrontProductListParams) {
  return useQuery({
    queryKey: storefrontProductKeys.list(params),
    queryFn:  () => storefrontProductsApi.list(params),
    staleTime: 60 * 1000,  // products are stale after 1 min
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: storefrontProductKeys.detail(slug),
    queryFn:  () => storefrontProductsApi.detail(slug),
    enabled:  !!slug,
  })
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: storefrontProductKeys.search(query),
    queryFn:  () => storefrontProductsApi.search(query),
    enabled:  query.length >= 2,
  })
}
*/

export {}
