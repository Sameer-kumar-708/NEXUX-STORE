import { Product, Category } from './types'
import productsJson from '../public/data/products.json'
import { categoryImages, imageDefaults } from './images'

export interface CatalogProductJson {
  id: number
  category: string
  title: string
  badge: string
  feature: string
  rating: number
  reviews: number
  price: number
  stock: number
  image: string
}

function categorySlug(raw: string): string {
  return raw.trim().toLowerCase()
}

function categoryDisplayName(slug: string): string {
  return slug
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function mapJsonToProduct(raw: CatalogProductJson): Product {
  const slug = categorySlug(raw.category)
  return {
    id: String(raw.id),
    name: raw.title,
    description: raw.feature,
    price: raw.price,
    image: raw.image || imageDefaults.productFallback,
    category: slug,
    rating: raw.rating,
    reviews: raw.reviews,
    stock: raw.stock,
    badge: raw.badge,
    specs: { Feature: raw.feature },
  }
}

const rawList = productsJson as CatalogProductJson[]

export const products: Product[] = rawList.map(mapJsonToProduct)

const slugSet = [...new Set(products.map((p) => p.category))].sort()

export const categories: Category[] = slugSet.map((slug, index) => ({
  id: String(index + 1),
  name: categoryDisplayName(slug),
  slug,
  image:
    categoryImages[slug as keyof typeof categoryImages] ??
    imageDefaults.productFallback,
}))

export const trendingProducts = products.filter((p) => {
  const b = p.badge?.toLowerCase() ?? ''
  return (
    b === 'trending' ||
    b === 'new' ||
    b === 'bestseller' ||
    b.includes('trend')
  )
})

export const saleProducts = products.filter((p) => {
  if (p.originalPrice != null) return true
  const b = p.badge?.toLowerCase() ?? ''
  return b === 'sale' || b === 'limited'
})
