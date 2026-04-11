import { Product } from './types'

export function getProductBadgeLabel(product: Product): string | null {
  if (!product.badge) return null
  const raw = product.badge.trim()
  const b = raw.toLowerCase()
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0
  if (b === 'sale' && discount > 0) return `${discount}% OFF`
  if (b === 'new') return 'NEW'
  if (b === 'trending') return 'TRENDING'
  if (b === 'limited') return 'LIMITED'
  return raw.toUpperCase()
}
