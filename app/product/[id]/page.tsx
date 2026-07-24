'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/ecommerce/navbar'
import { ProductCard } from '@/components/ecommerce/product-card'
import { useCart } from '@/lib/store'
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Star,
  Minus,
  Plus,
  Package,
  Shield,
  Truck,
  RotateCcw,
} from 'lucide-react'
import {
  fadeInUp,
  staggerContainer,
  slideInLeft,
  slideInRight,
  sectionHeaderReveal,
} from '@/lib/animations'
import { getProductBadgeLabel } from '@/lib/product-badge'
import { Product } from '@/lib/types'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const params = useParams()
  const productId =
    typeof params.id === 'string' ? params.id : String(params.id ?? '')

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const { addItem } = useCart()

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    setNotFound(false)

    fetch(`/api/products/${productId}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        setProduct(data.product ?? null)
        if (!data.product) {
          setNotFound(true)
          return
        }

        // Fetch related products (same category)
        const cat = data.product.category
        fetch(`/api/products?category=${cat}&limit=8`)
          .then((r) => r.json())
          .then((d) => {
            const related = (d.products ?? [])
              .filter((p: Product) => p.id !== productId)
              .slice(0, 4)
            setRelated(related)
          })
          .catch(() => {})
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    toast.success(`${product.name} added to cart`)
  }

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <main className="bg-[#09090B] text-foreground min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl shimmer bg-white/[0.03]" />
            <div className="space-y-6">
              <div className="h-4 w-24 rounded-full shimmer bg-white/[0.03]" />
              <div className="h-10 w-3/4 rounded-full shimmer bg-white/[0.03]" />
              <div className="h-4 w-full rounded-full shimmer bg-white/[0.03]" />
              <div className="h-4 w-2/3 rounded-full shimmer bg-white/[0.03]" />
              <div className="h-12 w-40 rounded-xl shimmer bg-white/[0.03] mt-8" />
              <div className="h-14 w-full rounded-xl shimmer bg-white/[0.03] mt-4" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ─── Not found ─── */
  if (notFound || !product) {
    return (
      <main className="bg-[#09090B] text-foreground min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-3 text-white">Product not found</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <motion.button
              className="btn-solid inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Products
            </motion.button>
          </Link>
        </div>
      </main>
    )
  }

  const badgeLabel = getProductBadgeLabel(product)
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0

  return (
    <main className="bg-[#09090B] text-foreground">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-white smooth-transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-white smooth-transition">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 mb-20 sm:mb-28">
            {/* Image */}
            <motion.div
              className="glow-card p-6 sm:p-10 flex items-center justify-center"
              variants={slideInLeft}
              initial="initial"
              animate="animate"
            >
              <div className="relative w-full aspect-square group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              className="flex flex-col justify-start space-y-6"
              variants={slideInRight}
              initial="initial"
              animate="animate"
            >
              {/* Badge */}
              {badgeLabel && (
                <div
                  className="w-fit px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    background:
                      discount > 0
                        ? 'rgba(239,68,68,0.15)'
                        : 'rgba(59,130,246,0.15)',
                    color: discount > 0 ? '#EF4444' : '#3B82F6',
                    border: `1px solid ${
                      discount > 0
                        ? 'rgba(239,68,68,0.25)'
                        : 'rgba(59,130,246,0.25)'
                    }`,
                  }}
                >
                  {badgeLabel}
                </div>
              )}

              {/* Title & Category */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                  {product.category.replace(/-/g, ' ')}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < Math.floor(product.rating) ? '#F59E0B' : 'none'}
                      color={i < Math.floor(product.rating) ? '#F59E0B' : '#374151'}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white">{product.rating}</span>
                <span className="text-sm text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed">{product.description}</p>

              {/* Price Card */}
              <div
                className="p-6 rounded-2xl space-y-3"
                style={{
                  background: 'rgba(24,24,27,0.5)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-[#3B82F6]">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                      <span className="text-sm font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                        Save ${(product.originalPrice - product.price).toFixed(0)}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background:
                        product.stock > 10 ? '#10B981' : product.stock > 0 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                  <span className="text-sm text-gray-400">
                    {product.stock > 10
                      ? 'In Stock — Ready to ship'
                      : product.stock > 0
                      ? `Only ${product.stock} left — Order soon!`
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Quantity</label>
                <div
                  className="inline-flex items-center gap-1 p-1 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 rounded-lg hover:bg-white/5 smooth-transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2.5 rounded-lg hover:bg-white/5 smooth-transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 btn-solid flex items-center justify-center gap-2 text-base !py-4"
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(59,130,246,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsWishlisted(!isWishlisted)
                    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
                  }}
                  className="p-4 rounded-xl smooth-transition"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isWishlisted ? '#EF4444' : 'none'}
                    color={isWishlisted ? '#EF4444' : 'currentColor'}
                  />
                </motion.button>
                <motion.button
                  type="button"
                  className="p-4 rounded-xl smooth-transition"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied to clipboard')
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Features mini bar */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                {[
                  { icon: Truck, label: 'Free Shipping' },
                  { icon: Shield, label: 'Warranty' },
                  { icon: RotateCcw, label: '30-Day Returns' },
                  { icon: Package, label: 'Secure Package' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2 text-xs text-gray-500 py-2"
                  >
                    <f.icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                    {f.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ─── Tabbed Content ─── */}
          <motion.div
            className="mb-20 sm:mb-28"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Tab Headers */}
            <div className="flex gap-1 p-1 rounded-xl w-fit mb-8" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {(['description', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium smooth-transition capitalize ${
                    activeTab === tab
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div
              className="p-6 sm:p-8 rounded-2xl"
              style={{ background: 'rgba(24,24,27,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-0">
                  {product.specs && Object.keys(product.specs).length > 0 ? (
                    Object.entries(product.specs).map(([key, value], i) => (
                      <div
                        key={key}
                        className={`flex justify-between items-center py-4 text-sm ${
                          i > 0 ? 'border-t border-white/5' : ''
                        }`}
                      >
                        <span className="text-gray-500">{key}</span>
                        <span className="font-medium text-white">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-4">
                      No specifications available for this product.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-gray-400 mb-2">Reviews coming soon</p>
                  <p className="text-sm text-gray-500">
                    Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div
                className="mb-10"
                variants={sectionHeaderReveal}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  You May Also Like
                </h2>
                <p className="text-gray-500 text-sm">Similar products you might be interested in</p>
                <div className="accent-line mt-4 !mx-0" />
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}
