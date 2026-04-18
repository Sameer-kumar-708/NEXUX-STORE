'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/ecommerce/navbar'
import { FilterSidebar } from '@/components/ecommerce/filter-sidebar'
import { ProductCard } from '@/components/ecommerce/product-card'
import { FilterOptions, Product } from '@/lib/types'
import { Filter, X, RefreshCw } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations'

function ProductsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')?.trim() ?? ''

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 5000],
    rating: 0,
    sortBy: 'newest',
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch products from MongoDB via the public API
  useEffect(() => {
    setLoading(true)
    fetch('/api/products?limit=200')
      .then((r) => r.json())
      .then((data) => setAllProducts(data.products ?? []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    let result: Product[] = [...allProducts]

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category))
    }

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        break
    }

    return result
  }, [allProducts, filters, searchQuery])

  // Build dynamic categories from what's actually in the DB
  const dynamicCategories = useMemo(
    () =>
      [...new Set(allProducts.map((p) => p.category))].sort().map((slug, i) => ({
        id: String(i + 1),
        slug,
        name: slug
          .split(/[\s_-]+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        image: '',
      })),
    [allProducts]
  )

  const clearSearch = () => router.push('/products')

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)]">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={dynamicCategories}
        />

        <div className="flex-1 overflow-auto">
          <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">All Products</h1>
                  <p className="text-muted-foreground">
                    {loading ? 'Loading…' : `Showing ${filteredProducts.length} products`}
                    {searchQuery && !loading && (
                      <span> for &ldquo;{searchQuery}&rdquo;</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden flex items-center gap-2 glass px-4 py-2 rounded-lg hover:border-primary/50 smooth-transition w-fit"
                >
                  <Filter className="w-4 h-4" />
                  {isFilterOpen ? 'Hide' : 'Show'} Filters
                </button>
              </motion.div>

              {/* Active Filters Tags */}
              {(searchQuery || filters.categories.length > 0 || filters.rating > 0) && (
                <motion.div
                  className="flex flex-wrap gap-2 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {searchQuery && (
                    <div className="glass px-3 py-1 rounded-full text-xs flex items-center gap-2">
                      Search: {searchQuery}
                      <button type="button" onClick={clearSearch} className="hover:text-primary smooth-transition" aria-label="Clear search">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {filters.categories.map((cat) => (
                    <div key={cat} className="glass px-3 py-1 rounded-full text-xs flex items-center gap-2">
                      {cat}
                      <button
                        onClick={() => setFilters({ ...filters, categories: filters.categories.filter((c) => c !== cat) })}
                        className="hover:text-primary smooth-transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {filters.rating > 0 && (
                    <div className="glass px-3 py-1 rounded-full text-xs flex items-center gap-2">
                      {filters.rating}+ stars
                      <button onClick={() => setFilters({ ...filters, rating: 0 })} className="hover:text-primary smooth-transition">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Loading spinner */}
              {loading && (
                <div className="flex items-center justify-center py-24 text-muted-foreground">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Loading products…
                </div>
              )}

              {/* Products Grid */}
              {!loading && filteredProducts.length > 0 && (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </motion.div>
              )}

              {/* Empty state */}
              {!loading && filteredProducts.length === 0 && (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-lg font-semibold mb-2">No products found</p>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? 'Try a different search or clear filters.'
                      : allProducts.length === 0
                      ? 'No products have been added yet.'
                      : 'Try adjusting your filters.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setFilters({ categories: [], priceRange: [0, 5000], rating: 0, sortBy: 'newest' }); if (searchQuery) clearSearch() }}
                    className="glass px-6 py-2 rounded-lg hover:border-primary/50 smooth-transition text-sm font-semibold"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-background text-foreground min-h-screen">
          <Navbar />
          <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
            Loading…
          </div>
        </main>
      }
    >
      <ProductsPageContent />
    </Suspense>
  )
}
