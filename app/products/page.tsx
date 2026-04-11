'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/ecommerce/navbar'
import { FilterSidebar } from '@/components/ecommerce/filter-sidebar'
import { ProductCard } from '@/components/ecommerce/product-card'
import { products } from '@/lib/products'
import { FilterOptions, Product } from '@/lib/types'
import { Filter, X } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 5000],
    rating: 0,
    sortBy: 'newest',
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    let result: Product[] = [...products]

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category))
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating)
    }

    // Sorting
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
  }, [filters])

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)]">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    All Products
                  </h1>
                  <p className="text-muted-foreground">
                    Showing {filteredProducts.length} products
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden flex items-center gap-2 glass px-4 py-2 rounded-lg hover:border-primary/50 smooth-transition w-fit"
                >
                  <Filter className="w-4 h-4" />
                  {isFilterOpen ? 'Hide' : 'Show'} Filters
                </button>
              </motion.div>

              {/* Active Filters Display */}
              {(filters.categories.length > 0 || filters.rating > 0) && (
                <motion.div
                  className="flex flex-wrap gap-2 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {filters.categories.map((cat) => (
                    <div
                      key={cat}
                      className="glass px-3 py-1 rounded-full text-xs flex items-center gap-2"
                    >
                      {cat}
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            categories: filters.categories.filter((c) => c !== cat),
                          })
                        }
                        className="hover:text-primary smooth-transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {filters.rating > 0 && (
                    <div className="glass px-3 py-1 rounded-full text-xs flex items-center gap-2">
                      {filters.rating}+ stars
                      <button
                        onClick={() => setFilters({ ...filters, rating: 0 })}
                        className="hover:text-primary smooth-transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
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
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-lg font-semibold mb-2">No products found</p>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        categories: [],
                        priceRange: [0, 5000],
                        rating: 0,
                        sortBy: 'newest',
                      })
                    }
                    className="glass px-6 py-2 rounded-lg hover:border-primary/50 smooth-transition text-sm font-semibold"
                  >
                    Clear Filters
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
