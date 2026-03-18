// -----------------------------------------------------------------------------
// File: QueryProvider.tsx
// Path: providers/QueryProvider.tsx
//
// TanStack Query client provider.
// Install: npm install @tanstack/react-query @tanstack/react-query-devtools
//
// After installing, uncomment this file and add <QueryProvider> to app/layout.tsx:
//
//   import { QueryProvider } from '@/providers/QueryProvider'
//   <QueryProvider>{children}</QueryProvider>
// -----------------------------------------------------------------------------

'use client'

// import React, { useState } from 'react'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// export function QueryProvider({ children }: { children: React.ReactNode }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime:            60 * 1000,   // 1 minute default stale time
//             retry:                1,
//             refetchOnWindowFocus: false,
//           },
//         },
//       }),
//   )

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       {process.env.NODE_ENV === 'development' && (
//         <ReactQueryDevtools initialIsOpen={false} />
//       )}
//     </QueryClientProvider>
//   )
// }

export {}
