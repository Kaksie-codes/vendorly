// -----------------------------------------------------------------------------
// File: authStore.ts
// Path: store/authStore.ts
// -----------------------------------------------------------------------------

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id:        string
  firstName: string
  lastName:  string
  email:     string
  role:      string
}

interface AuthState {
  user:      AuthUser | null
  token:     string | null
  isAuthed:  boolean

  setAuth:   (user: AuthUser, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:     null,
      token:    null,
      isAuthed: false,

      setAuth:   (user, token) => set({ user, token, isAuthed: true }),
      clearAuth: ()            => set({ user: null, token: null, isAuthed: false }),
    }),
    {
      name: 'vendorly-auth',
      // Persist both token and user so the navbar/pages have the data on reload
      partialize: (state) => ({ token: state.token, user: state.user, isAuthed: state.isAuthed }),
    },
  ),
)
