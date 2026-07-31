'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/ecommerce/navbar'
import { FilterSidebar } from '@/components/ecommerce/filter-sidebar'
import { ProductCard } from '@/components/ecommerce/product-card'
import { ProductSkeletonGrid } from '@/components/ecommerce/product-skeleton'
import { FilterOptions, Product } from '@/lib/types'
import { X, Sparkles } from 'lucide-react'
import { fadeInUp, staggerContainer, sectionHeaderReveal } from '@/lib/animations'

function ProductsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')?.trim() ?? ''

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [semanticProducts, setSemanticProducts] = useState<Product[] | null>(null)
  const [aiInterpretation, setAiInterpretation] = useState<{
    interpretedQuery?: string
    explanation?: string
    filtersExtracted?: Record<string, unknown>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 5000],
    rating: 0,
    sortBy: 'newest',
  })

  // Fetch products or perform AI semantic search
  useEffect(() => {
    setLoading(true)

    if (searchQuery) {
      // Use Multilingual Semantic Search API (Gemini + Pinecone)
      fetch(`/api/search/semantic?q=${encodeURIComponent(searchQuery)}`)
        .then((r) => r.json())
        .then((data) => {
          setSemanticProducts(data.products ?? [])
          setAiInterpretation({
            interpretedQuery: data.interpretedQuery,
            explanation: data.explanation,
            filtersExtracted: data.filtersExtracted,
          })
        })
        .catch(() => {
          setSemanticProducts([])
          setAiInterpretation(null)
        })
        .finally(() => setLoading(false))
    } else {
      setSemanticProducts(null)
      setAiInterpretation(null)
      fetch('/api/products?limit=200')
        .then((r) => r.json())
        .then((data) => setAllProducts(data.products ?? []))
        .catch(() => setAllProducts([]))
        .finally(() => setLoading(false))
    }
  }, [searchQuery])

  const filteredProducts = useMemo(() => {
    let result: Product[] = semanticProducts !== null ? [...semanticProducts] : [...allProducts]

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category))
    }

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating)
    }

    // Standard filter for static catalog when no AI semantic search was performed
    if (searchQuery && semanticProducts === null) {
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
  }, [allProducts, semanticProducts, filters, searchQuery])

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
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              {searchQuery ? 'Search Results' : 'All Products'}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Vector Search
                </span>
              )}
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

          {/* AI Search Intent Interpretation Banner */}
          {searchQuery && !loading && aiInterpretation?.interpretedQuery && (
            <motion.div
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-black border border-blue-500/20 backdrop-blur-md flex items-start gap-3.5 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Gemini AI Multilingual Interpretation
                  </span>
                  {aiInterpretation.interpretedQuery !== searchQuery && (
                    <span className="text-xs text-gray-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                      English keywords: &ldquo;<strong className="text-white">{aiInterpretation.interpretedQuery}</strong>&rdquo;
                    </span>
                  )}
                </div>
                {aiInterpretation.explanation && (
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {aiInterpretation.explanation}
                  </p>
                )}
              </div>
            </motion.div>
          )}

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
