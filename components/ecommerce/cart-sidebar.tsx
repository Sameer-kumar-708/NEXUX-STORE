'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotalPrice } = useCart()
  const total = getTotalPrice()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-screen w-full sm:w-96 z-50 glass border-l flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">Your Cart</span>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-white/5 rounded-lg smooth-transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-2">Your cart is empty</p>
                  <p className="text-xs text-muted-foreground">Add items to get started!</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="glass p-4 rounded-xl flex gap-4"
                    layout
                    exit={{ opacity: 0, x: 100 }}
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-primary font-semibold mb-3">
                        ${item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="p-1 hover:bg-white/5 rounded smooth-transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white/5 rounded smooth-transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto p-1 hover:bg-red-500/10 hover:text-red-500 rounded smooth-transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 p-6 space-y-4">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/cart">
                  <motion.button
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 smooth-transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Checkout
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
