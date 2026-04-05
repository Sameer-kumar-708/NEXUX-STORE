import { create } from 'zustand'
import { Product } from './types'

interface AdminStore {
  products: Product[]
  isLoading: boolean
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
}

export const useAdmin = create<AdminStore>((set, get) => ({
  products: [],
  isLoading: false,

  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        {
          ...product,
          id: Math.random().toString(36).substr(2, 9),
        } as Product,
      ],
    })),

  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updatedProduct } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  getProduct: (id) => {
    const products = get().products
    return products.find((p) => p.id === id)
  },
}))
