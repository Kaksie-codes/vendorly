// -----------------------------------------------------------------------------
// File: CartProvider.tsx
// Path: components/storefront/CartProvider.tsx
// -----------------------------------------------------------------------------

'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import type { Product, ProductVariant } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartLineItem = {
  id:              string
  productId:       string
  variantId?:      string
  quantity:        number
  price:           number
  selectedOptions?: Record<string, string>
  product?:        Product
  variant?:        ProductVariant
}

type CartState = {
  items: CartLineItem[]
}

type CartAction =
  | { type: 'ADD';    payload: CartLineItem }
  | { type: 'REMOVE'; payload: string }
  | { type: 'UPDATE'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR' }

type CartContextValue = {
  items:       CartLineItem[]
  itemCount:   number
  subtotal:    number
  addItem:     (product: Product, quantity?: number, variant?: ProductVariant, options?: Record<string, string>) => void
  removeItem:  (id: string) => void
  updateQty:   (id: string, quantity: number) => void
  clearCart:   () => void
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.findIndex(
        (i) => i.productId === action.payload.productId &&
               i.variantId === action.payload.variantId
      )
      if (existing >= 0) {
        const items = [...state.items]
        items[existing] = { ...items[existing], quantity: items[existing].quantity + action.payload.quantity }
        return { items }
      }
      return { items: [...state.items, action.payload] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.payload) }
    case 'UPDATE': {
      if (action.payload.quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== action.payload.id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = useCallback((
    product: Product,
    quantity = 1,
    variant?: ProductVariant,
    options?: Record<string, string>
  ) => {
    const id    = variant ? `${product.id}-${variant.id}` : product.id
    const price = variant?.price ?? product.price
    dispatch({
      type: 'ADD',
      payload: { id, productId: product.id, variantId: variant?.id, quantity, price, selectedOptions: options, product, variant },
    })
  }, [])

  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE', payload: id }), [])
  const updateQty  = useCallback((id: string, quantity: number) => dispatch({ type: 'UPDATE', payload: { id, quantity } }), [])
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const itemCount = state.items.reduce((acc, i) => acc + i.quantity, 0)
  const subtotal  = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, itemCount, subtotal, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}