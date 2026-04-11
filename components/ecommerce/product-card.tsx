'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/lib/types'
import { getProductBadgeLabel } from '@/lib/product-badge'
import { useCart } from '@/lib/store'
import { useState } from 'react'
import { hoverScale } from '@/lib/animations'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const handleAddToCart = () => {
    addItem(product, 1)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const badgeLabel = getProductBadgeLabel(product)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/product/${product.id}`}>
        <div className="glass p-4 rounded-2xl overflow-hidden h-full hover:border-primary/50 smooth-transition">
          {/* Image Container */}
          <div className="relative h-64 sm:h-72 overflow-hidden rounded-xl mb-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 smooth-transition"
            />

            {/* Badge */}
            {badgeLabel && (
              <motion.div
                className="absolute top-3 right-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="glass px-3 py-1 rounded-full text-xs font-semibold bg-primary/20">
                  {badgeLabel}
                </div>
              </motion.div>
            )}

            {/* Rating */}
            <div className="absolute bottom-3 left-3 glass px-2 py-1 rounded-lg text-xs flex items-center gap-1">
              <span>⭐ {product.rating}</span>
              <span className="text-muted-foreground">({product.reviews})</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {product.category.replace(/-/g, ' ')}
              </p>
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary smooth-transition">
                {product.name}
              </h3>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-primary">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="text-xs text-muted-foreground">
              {product.stock > 10 ? '✓ In Stock' : `Only ${product.stock} left`}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  handleAddToCart()
                }}
                className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg hover:opacity-90 smooth-transition flex items-center justify-center gap-2"
                {...hoverScale}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  setIsWishlisted(!isWishlisted)
                }}
                className="glass px-3 py-2 rounded-lg hover:border-accent/50 smooth-transition"
                {...hoverScale}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  color={isWishlisted ? '#ff0000' : 'currentColor'}
                />
              </motion.button>
            </div>

            {/* Notification */}
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-green-400 text-center"
              >
                Added to cart ✓
              </motion.div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
