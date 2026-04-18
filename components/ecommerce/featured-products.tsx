'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from './product-card'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Link from 'next/link'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { Product } from '@/lib/types'

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    // Fetch the 4 most recently added products from MongoDB
    fetch('/api/products?sort=newest&limit=4')
      .then((r) => r.json())
      .then((data) => setProducts((data.products ?? []).slice(0, 4)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.section
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div className="text-center mb-12 sm:mb-16" variants={fadeInUp}>
          <div className="inline-block glass px-4 py-2 rounded-full mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-semibold text-primary">CURATED SELECTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Handpicked items that combine quality, innovation, and style
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading products…
          </div>
        )}

        {/* No products yet */}
        {!loading && products.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No products yet. Check back soon!
          </p>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}

        {/* View All */}
        <motion.div className="text-center" variants={fadeInUp}>
          <Link href="/products">
            <motion.button
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 glass rounded-lg font-semibold hover:border-primary/50 smooth-transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
