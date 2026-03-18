// -----------------------------------------------------------------------------
// File: authStore.ts
// Path: store/authStore.ts
//
// Auth session store using Zustand.
// Install: npm install zustand
//
// This replaces the need for prop-drilling auth state through layouts.
// TanStack Query reads the token from here via apiClient.ts.
// -----------------------------------------------------------------------------

// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import type { User } from '@/types'

// interface AuthState {
//   user:     User | null
//   token:    string | null
//   isAuthed: boolean

//   setAuth:  (user: User, token: string) => void
//   clearAuth: () => void
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user:     null,
//       token:    null,
//       isAuthed: false,

//       setAuth: (user, token) => set({ user, token, isAuthed: true }),
//       clearAuth: ()          => set({ user: null, token: null, isAuthed: false }),
//     }),
//     {
//       name: 'vendorly-auth',   // localStorage key
//       partialize: (state) => ({ token: state.token }),  // only persist token
//     },
//   ),
// )

// ── Usage example ─────────────────────────────────────────────────────────────
// const { user, isAuthed, setAuth, clearAuth } = useAuthStore()
// After login: setAuth(user, token)
// In apiClient: const token = useAuthStore.getState().token

export {}
