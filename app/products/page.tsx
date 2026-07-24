'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/ecommerce/navbar'
import { FilterSidebar } from '@/components/ecommerce/filter-sidebar'
import { ProductCard } from '@/components/ecommerce/product-card'
import { ProductSkeletonGrid } from '@/components/ecommerce/product-skeleton'
import { FilterOptions, Product } from '@/lib/types'
import { X } from 'lucide-react'
import { fadeInUp, staggerContainer, sectionHeaderReveal } from '@/lib/animations'

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

  // Build dynamic categories from DB
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
    <main className="bg-[#09090B] text-foreground min-h-screen">
      <Navbar />

      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="mb-6"
            variants={sectionHeaderReveal}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {searchQuery ? 'Search Results' : 'All Products'}
            </h1>
            <p className="text-gray-500 text-sm">
              {loading
                ? 'Loading...'
                : `Showing ${filteredProducts.length} products`}
              {searchQuery && !loading && (
                <span>
                  {' '}
                  for &ldquo;<span className="text-gray-300">{searchQuery}</span>&rdquo;
                </span>
              )}
            </p>
          </motion.div>

          {/* Horizontal Filter Bar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            categories={dynamicCategories}
          />

          {/* Active Filter Chips */}
          <AnimatePresence>
            {(searchQuery || filters.categories.length > 0 || filters.rating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) && (
              <motion.div
                className="flex flex-wrap items-center gap-2 mb-6"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {searchQuery && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                    <span>Search: {searchQuery}</span>
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="hover:text-gray-300 smooth-transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {filters.categories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10 capitalize"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          categories: filters.categories.filter((c) => c !== cat),
                        })
                      }
                      className="hover:text-gray-300 smooth-transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                    <span>${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
                    <button
                      type="button"
                      onClick={() => setFilters({ ...filters, priceRange: [0, 5000] })}
                      className="hover:text-gray-300 smooth-transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {filters.rating > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                    <span>{filters.rating}+ Stars</span>
                    <button
                      type="button"
                      onClick={() => setFilters({ ...filters, rating: 0 })}
                      className="hover:text-gray-300 smooth-transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Skeleton */}
          {loading && <ProductSkeletonGrid count={8} />}

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
              className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-7xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-3">No products found</h2>
              <p className="text-gray-400 mb-8 max-w-md">
                {searchQuery
                  ? 'Try a different search term or adjust your filters.'
                  : allProducts.length === 0
                  ? 'No products have been added yet. Check back soon!'
                  : 'Try adjusting your filters to see more results.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    categories: [],
                    priceRange: [0, 5000],
                    rating: 0,
                    sortBy: 'newest',
                  })
                  if (searchQuery) clearSearch()
                }}
                className="btn-solid inline-flex items-center gap-2 text-sm"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-[#09090B] text-foreground min-h-screen">
          <Navbar />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-10 w-48 rounded-full shimmer bg-white/[0.03] mb-8" />
              <ProductSkeletonGrid count={8} />
            </div>
          </div>
        </main>
      }
    >
      <ProductsPageContent />
    </Suspense>
  )
}
