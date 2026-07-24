'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { Product } from '@/lib/types'
import { getProductBadgeLabel } from '@/lib/product-badge'
import { useCart } from '@/lib/store'
import { useState } from 'react'
import { cardReveal } from '@/lib/animations'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const badgeLabel = getProductBadgeLabel(product)

  return (
    <motion.div
      variants={cardReveal}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/product/${product.id}`}>
        <div className="glow-card overflow-hidden h-full">
          {/* Image Container */}
          <div className="relative h-56 sm:h-64 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badge */}
            {badgeLabel && (
              <motion.div
                className="absolute top-3 left-3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <div
                  className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"
                  style={{
                    background: discount > 0 ? 'rgba(239,68,68,0.9)' : 'rgba(59,130,246,0.9)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {badgeLabel}
                </div>
              </motion.div>
            )}

            {/* Discount badge */}
            {discount > 0 && !badgeLabel && (
              <div
                className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}
              >
                {discount}% OFF
              </div>
            )}

            {/* Hover action buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-14 group-hover:translate-x-0 transition-transform duration-300 ease-out">
              <motion.button
                onClick={handleWishlist}
                className="p-2.5 rounded-xl backdrop-blur-xl"
                style={{
                  background: 'rgba(24,24,27,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWishlisted ? '#EF4444' : 'none'}
                  color={isWishlisted ? '#EF4444' : 'white'}
                />
              </motion.button>
              <motion.button
                className="p-2.5 rounded-xl backdrop-blur-xl"
                style={{
                  background: 'rgba(24,24,27,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            {/* Rating */}
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs backdrop-blur-xl"
                style={{ background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span className="text-[#F59E0B]">★</span>
                <span className="font-medium text-white">{product.rating}</span>
                <span className="text-gray-400">({product.reviews})</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 space-y-3">
            {/* Category */}
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium">
              {product.category.replace(/-/g, ' ')}
            </p>

            {/* Name */}
            <h3 className="font-semibold text-sm sm:text-base text-gray-200 line-clamp-2 group-hover:text-white smooth-transition leading-snug">
              {product.name}
            </h3>

            {/* Price Row */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-[#3B82F6]">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: product.stock > 10 ? '#10B981' : product.stock > 0 ? '#F59E0B' : '#EF4444',
                }}
              />
              <span className="text-xs text-gray-500">
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold smooth-transition"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: '#60A5FA',
              }}
              whileHover={{
                background: 'rgba(59,130,246,1)',
                color: '#ffffff',
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
