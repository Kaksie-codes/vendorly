// -----------------------------------------------------------------------------
// File: cartStore.ts
// Path: store/cartStore.ts
//
// Cart store using Zustand — future migration target for CartProvider.tsx.
// Install: npm install zustand
//
// When you're ready to migrate from CartProvider (useReducer + Context)
// to Zustand, copy the logic here and delete providers/CartProvider.tsx.
// The API surface stays the same so all call sites update with a find-replace.
// -----------------------------------------------------------------------------

// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import type { CartItem, Product } from '@/types'

// interface CartState {
//   items: CartItem[]
//   addItem:    (product: Product, qty?: number) => void
//   removeItem: (productId: string) => void
//   updateQty:  (productId: string, qty: number) => void
//   clearCart:  () => void
//   total:      () => number
//   itemCount:  () => number
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       items: [],

//       addItem: (product, qty = 1) =>
//         set((state) => {
//           const existing = state.items.find((i) => i.productId === product.id)
//           if (existing) {
//             return {
//               items: state.items.map((i) =>
//                 i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i,
//               ),
//             }
//           }
//           return {
//             items: [...state.items, {
//               id: crypto.randomUUID(),
//               productId: product.id,
//               product,
//               quantity: qty,
//               price: product.price,
//             }],
//           }
//         }),

//       removeItem: (productId) =>
//         set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

//       updateQty: (productId, qty) =>
//         set((state) => ({
//           items: qty <= 0
//             ? state.items.filter((i) => i.productId !== productId)
//             : state.items.map((i) => i.productId === productId ? { ...i, quantity: qty } : i),
//         })),

//       clearCart: () => set({ items: [] }),

//       total:     () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
//       itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
//     }),
//     { name: 'vendorly-cart' },
//   ),
// )

export {}
