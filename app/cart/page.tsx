'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/ecommerce/navbar'
import { useCart } from '@/lib/store'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()
  const total = getTotalPrice()
  const shipping = total > 100 ? 0 : 10

  if (items.length === 0) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-24 px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Add some items to get started!
            </p>
            <Link href="/products">
              <motion.button
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 smooth-transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </motion.button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      <motion.div
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div className="mb-12" variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Items */}
            <motion.div
              className="lg:col-span-2 space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  className="glass p-6 rounded-2xl flex gap-6 items-center group"
                  variants={fadeInUp}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                >
                  {/* Image */}
                  <Link href={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-card group-hover:scale-105 smooth-transition">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2 hover:text-primary smooth-transition">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.category}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      ${item.price}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 glass p-2 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-1 hover:bg-white/5 rounded smooth-transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white/5 rounded smooth-transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                      <p className="font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove */}
                    <motion.button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg smooth-transition"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              variants={fadeInUp}
            >
              <div className="glass p-8 rounded-2xl space-y-6 sticky top-24">
                <h2 className="text-xl font-bold">Order Summary</h2>

                {/* Breakdown */}
                <div className="space-y-3 border-t border-white/5 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-400 font-semibold">Free</span>
                    ) : (
                      <span className="font-semibold">${shipping.toFixed(2)}</span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders over $100
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-white/5 pt-6 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${(total + shipping).toFixed(2)}
                  </span>
                </div>

                {/* Checkout */}
                <motion.button
                  className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:opacity-90 smooth-transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>

                {/* Continue Shopping */}
                <Link href="/products">
                  <motion.button
                    className="w-full glass py-3 rounded-lg font-semibold hover:border-primary/50 smooth-transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>
                </Link>

                {/* Clear Cart */}
                <motion.button
                  onClick={clearCart}
                  className="w-full text-xs text-red-500 hover:bg-red-500/10 py-2 rounded-lg smooth-transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Cart
                </motion.button>

                {/* Trust Badges */}
                <div className="border-t border-white/5 pt-6 space-y-3 text-xs text-muted-foreground">
                  <div className="flex gap-2">
                    <span>✓</span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex gap-2">
                    <span>✓</span>
                    <span>Free returns</span>
                  </div>
                  <div className="flex gap-2">
                    <span>✓</span>
                    <span>24/7 support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
