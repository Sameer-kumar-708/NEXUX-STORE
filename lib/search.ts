import { Product } from './types'

export function matchesProductSearch(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    product.name.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q)
  )
}

export function filterProductsBySearch(
  list: Product[],
  query: string
): Product[] {
  const q = query.trim()
  if (!q) return list
  return list.filter((p) => matchesProductSearch(p, q))
}
