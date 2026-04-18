'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/ecommerce/navbar'
import { ProductCard } from '@/components/ecommerce/product-card'
import { useCart } from '@/lib/store'
import { ShoppingCart, Heart, Share2, ChevronRight, Star, RefreshCw } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { getProductBadgeLabel } from '@/lib/product-badge'
import { Product } from '@/lib/types'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = typeof params.id === 'string' ? params.id : String(params.id ?? '')

  const [product, setProduct]           = useState<Product | null>(null)
  const [relatedProducts, setRelated]   = useState<Product[]>([])
  const [loading, setLoading]           = useState(true)
  const [notFound, setNotFound]         = useState(false)
  const [quantity, setQuantity]         = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    setNotFound(false)

    fetch(`/api/products/${productId}`)
      .then(async (res) => {
        if (res.status === 404) { setNotFound(true); return }
        const data = await res.json()
        setProduct(data.product ?? null)
        if (!data.product) { setNotFound(true); return }

        // Fetch related products (same category)
        const cat = data.product.category
        fetch(`/api/products?category=${cat}&limit=8`)
          .then((r) => r.json())
          .then((d) => {
            const related = (d.products ?? []).filter((p: Product) => p.id !== productId).slice(0, 4)
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
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          Loading product…
        </div>
      </main>
    )
  }

  /* ─── Not found ─── */
  if (notFound || !product) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">No product matches this link.</p>
          <Link href="/products" className="text-primary font-semibold hover:underline">
            Browse all products
          </Link>
        </div>
      </main>
    )
  }

  const badgeLabel = getProductBadgeLabel(product)

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground smooth-transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-foreground smooth-transition">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <motion.div
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-24">
            {/* Image */}
            <motion.div
              className="glass p-8 rounded-2xl flex items-center justify-center min-h-96"
              variants={fadeInUp}
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div className="flex flex-col justify-start space-y-6" variants={fadeInUp}>
              {badgeLabel && (
                <div className="w-fit glass px-3 py-1 rounded-full text-xs font-semibold">
                  {badgeLabel}
                </div>
              )}

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="glass p-6 rounded-xl space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-primary">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>
                <p className="text-sm text-green-400">
                  {product.stock > 10 ? '✓ In Stock' : `Only ${product.stock} left - Order soon!`}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Quantity</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="glass px-4 py-2 rounded-lg hover:border-primary/50 smooth-transition font-semibold">−</button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="glass px-4 py-2 rounded-lg hover:border-primary/50 smooth-transition font-semibold">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 smooth-transition flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                <motion.button type="button" onClick={() => setIsWishlisted(!isWishlisted)}
                  className="glass px-4 sm:px-6 py-3 sm:py-4 rounded-lg hover:border-primary/50 smooth-transition font-semibold"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} color={isWishlisted ? '#ff0000' : 'currentColor'} />
                </motion.button>
                <motion.button type="button"
                  className="glass px-4 sm:px-6 py-3 sm:py-4 rounded-lg hover:border-primary/50 smooth-transition font-semibold"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {showNotification && (
                <motion.p className="text-green-400 font-semibold" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  ✓ Added to cart!
                </motion.p>
              )}

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="glass p-6 rounded-xl space-y-4 border-t border-white/5">
                  <h3 className="font-semibold">Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              className="mt-16 sm:mt-24"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="mb-12" variants={fadeInUp}>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Related Products</h2>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  )
}
