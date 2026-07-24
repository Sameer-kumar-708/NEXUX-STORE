'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cartItemEnter } from '@/lib/animations'

export function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotalPrice } = useCart()
  const total = getTotalPrice()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-screen w-full sm:w-[420px] z-50 flex flex-col"
            style={{
              background: 'rgba(17,24,39,0.98)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
                >
                  <ShoppingBag className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-white block">Your Cart</span>
                  <span className="text-xs text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                </div>
              </div>
              <motion.button
                onClick={toggleCart}
                className="p-2.5 hover:bg-white/5 rounded-xl smooth-transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-white font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Discover amazing products and add them here!
                  </p>
                  <motion.button
                    onClick={toggleCart}
                    className="btn-solid text-sm inline-flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-2xl"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                      variants={cartItemEnter}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                    >
                      <Link
                        href={`/product/${item.id}`}
                        onClick={toggleCart}
                        className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/[0.03] group"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.id}`} onClick={toggleCart}>
                          <h4 className="font-medium text-sm text-gray-200 hover:text-white smooth-transition mb-1 line-clamp-2">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="text-sm text-[#3B82F6] font-bold mb-3">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div
                            className="flex items-center gap-1 p-1 rounded-lg"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            <button
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, item.quantity - 1))
                              }
                              className="p-1.5 hover:bg-white/5 rounded smooth-transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-white/5 rounded smooth-transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <motion.button
                            onClick={() => removeItem(item.id)}
                            className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg smooth-transition text-gray-500"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 p-6 space-y-4">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-300 font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-[#10B981] font-medium">Free</span>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-[#3B82F6]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/cart" onClick={toggleCart}>
                  <motion.button
                    className="w-full btn-solid flex items-center justify-center gap-2 text-base !py-4"
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(59,130,246,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
