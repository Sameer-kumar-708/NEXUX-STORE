import { create } from 'zustand'
import { CartItem, Product } from './types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product: Product, quantity: number) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id)
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        }
      }
      return {
        items: [...state.items, { ...product, quantity }],
      }
    }),

  removeItem: (productId: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  updateQuantity: (productId: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getTotalPrice: () => {
    const items = get().items
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  getTotalItems: () => {
    const items = get().items
    return items.reduce((total, item) => total + item.quantity, 0)
  },
}))
