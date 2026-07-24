'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/ecommerce/navbar'
import { useCart } from '@/lib/store'
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, Shield, Truck, RotateCcw } from 'lucide-react'
import { fadeInUp, staggerContainer, slideInLeft } from '@/lib/animations'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()
  const total = getTotalPrice()
  const shipping = total > 100 ? 0 : 10

  if (items.length === 0) {
    return (
      <main className="bg-[#09090B] text-foreground min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-28 px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products yet. Start browsing to find something you love!
            </p>
            <Link href="/products">
              <motion.button
                className="btn-solid inline-flex items-center gap-2 text-base"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(59,130,246,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#09090B] text-foreground">
      <Navbar />

      <motion.div
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div className="mb-10" variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-500 text-sm">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
            <div className="accent-line mt-4 !mx-0" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
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
                  className="flex gap-5 p-5 rounded-2xl items-center group"
                  style={{
                    background: 'rgba(24,24,27,0.4)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  variants={fadeInUp}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                >
                  {/* Image */}
                  <Link href={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white/[0.03] group-hover:scale-105 smooth-transition">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-base text-gray-200 hover:text-white smooth-transition mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mb-3 capitalize">
                      {item.category}
                    </p>
                    <p className="text-lg font-bold text-[#3B82F6]">
                      ${item.price}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Quantity Controls */}
                    <div
                      className="flex items-center gap-1 p-1 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-2 hover:bg-white/5 rounded-lg smooth-transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-white/5 rounded-lg smooth-transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Subtotal</p>
                      <p className="font-bold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove */}
                    <motion.button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg smooth-transition text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div className="lg:col-span-1" variants={fadeInUp}>
              <div
                className="p-7 rounded-2xl space-y-6 sticky top-24"
                style={{
                  background: 'rgba(24,24,27,0.5)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h2 className="text-lg font-bold text-white">Order Summary</h2>

                {/* Coupon */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3B82F6] smooth-transition"
                  />
                  <button
                    className="px-4 py-2.5 rounded-xl text-sm font-medium smooth-transition"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA' }}
                  >
                    Apply
                  </button>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 border-t border-white/5 pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-300 font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-[#10B981] font-medium">Free</span>
                    ) : (
                      <span className="text-gray-300 font-medium">${shipping.toFixed(2)}</span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Free shipping on orders over $100
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-white/5 pt-5 flex justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-[#3B82F6]">
                    ${(total + shipping).toFixed(2)}
                  </span>
                </div>

                {/* Checkout */}
                <motion.button
                  className="w-full btn-solid flex items-center justify-center gap-2 text-base !py-4"
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(59,130,246,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                {/* Continue Shopping */}
                <Link href="/products" className="block">
                  <motion.button
                    className="w-full py-3 rounded-xl text-sm font-medium text-gray-400 smooth-transition"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>
                </Link>

                {/* Clear Cart */}
                <motion.button
                  onClick={clearCart}
                  className="w-full text-xs text-gray-600 hover:text-red-400 py-2 rounded-lg smooth-transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Cart
                </motion.button>

                {/* Trust Badges */}
                <div className="border-t border-white/5 pt-5 space-y-3">
                  {[
                    { icon: Shield, label: 'Secure checkout' },
                    { icon: RotateCcw, label: 'Free returns' },
                    { icon: Truck, label: '24/7 support' },
                  ].map((badge) => (
                    <div key={badge.label} className="flex items-center gap-2 text-xs text-gray-500">
                      <badge.icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {badge.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
