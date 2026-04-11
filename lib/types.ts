export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  rating: number
  reviews: number
  stock: number
  badge?: string
  specs?: Record<string, string>
}

export interface CartItem extends Product {
  quantity: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
}

export interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  rating: number
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating'
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: Date
}
