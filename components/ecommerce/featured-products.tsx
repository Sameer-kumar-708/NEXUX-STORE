'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from './product-card'
import { ProductSkeletonGrid } from './product-skeleton'
import { sectionHeaderReveal, staggerContainer, fadeInUp } from '@/lib/animations'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 sm:mb-16"
          variants={sectionHeaderReveal}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <span className="text-[#60A5FA]">Curated Selection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Featured Products
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Handpicked items that combine quality, innovation, and cutting-edge design
          </p>
          <div className="accent-line mt-6" />
        </motion.div>

        {/* Loading Skeleton */}
        {loading && <ProductSkeletonGrid count={4} />}

        {/* No products yet */}
        {!loading && products.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-400 mb-2">No products yet</p>
            <p className="text-sm text-gray-500">Check back soon for amazing deals!</p>
          </motion.div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14 sm:mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          className="text-center"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Link href="/products">
            <motion.button
              className="btn-premium inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="inline-flex items-center gap-2 text-white text-sm">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
