// -----------------------------------------------------------------------------
// File: uiStore.ts
// Path: store/uiStore.ts
//
// Global UI state: toasts, modals, sidebar open/close, etc.
// Install: npm install zustand
// -----------------------------------------------------------------------------

// import { create } from 'zustand'

// type ToastVariant = 'success' | 'error' | 'warning' | 'info'

// interface Toast {
//   id:      string
//   message: string
//   variant: ToastVariant
// }

// interface UIState {
//   toasts:      Toast[]
//   sidebarOpen: boolean

//   toast:          (message: string, variant?: ToastVariant) => void
//   dismissToast:   (id: string) => void
//   toggleSidebar:  () => void
//   setSidebarOpen: (open: boolean) => void
// }

// export const useUIStore = create<UIState>((set) => ({
//   toasts:      [],
//   sidebarOpen: true,

//   toast: (message, variant = 'success') => {
//     const id = crypto.randomUUID()
//     set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
//     // Auto-dismiss after 4 seconds
//     setTimeout(() => {
//       set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
//     }, 4000)
//   },

//   dismissToast:   (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
//   toggleSidebar:  ()   => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
//   setSidebarOpen: (open) => set({ sidebarOpen: open }),
// }))

// ── Usage ──────────────────────────────────────────────────────────────────────
// const { toast } = useUIStore()
// toast('Product saved!', 'success')
// toast('Something went wrong', 'error')

export {}
