// -----------------------------------------------------------------------------
// File: client.ts
// Path: lib/api/client.ts
//
// Base API client — a thin fetch wrapper with auth token injection,
// JSON serialisation, and typed error handling.
//
// Usage:
//   import { apiClient } from '@/lib/api/client'
//   const orders = await apiClient.get<Order[]>('/vendor/orders')
//   const product = await apiClient.post<Product>('/vendor/products', payload)
// -----------------------------------------------------------------------------

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  // TODO: pull token from your auth store (Zustand) once auth is wired up
  // import { useAuthStore } from '@/store/authStore'
  // const token = useAuthStore.getState().token

  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  // if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? res.statusText, data)
  }

  return data as T
}

export const apiClient = {
  get:    <T>(path: string)                   => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown)    => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown)    => request<T>('PUT',    path, body),
  patch:  <T>(path: string, body: unknown)    => request<T>('PATCH',  path, body),
  delete: <T>(path: string)                   => request<T>('DELETE', path),
}

export { ApiError }
