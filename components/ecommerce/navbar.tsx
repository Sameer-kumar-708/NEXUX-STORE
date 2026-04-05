'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/store'
import { useState } from 'react'

export function Navbar() {
  const { getTotalItems, toggleCart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartCount = getTotalItems()

  return (
    <nav className="sticky top-0 z-40 glass border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg group-hover:scale-110 smooth-transition flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-primary-foreground">NX</span>
            </div>
            <span className="hidden sm:block text-lg font-bold gradient-accent">Nexus</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">
              Home
            </Link>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">
              Products
            </Link>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">
              Collections
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">
              About
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground smooth-transition hidden sm:block">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <motion.button
              onClick={toggleCart}
              className="relative p-2 text-muted-foreground hover:text-foreground smooth-transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground smooth-transition"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 space-y-3 border-t border-white/5">
            <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground smooth-transition py-2">
              Home
            </Link>
            <Link href="/products" className="block text-sm text-muted-foreground hover:text-foreground smooth-transition py-2">
              Products
            </Link>
            <Link href="/products" className="block text-sm text-muted-foreground hover:text-foreground smooth-transition py-2">
              Collections
            </Link>
            <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground smooth-transition py-2">
              About
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}
