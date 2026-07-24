'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Command,
  ChevronUp,
  User,
  SlidersHorizontal,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Tag,
  MapPin,
  Flame,
} from 'lucide-react'
import { useCart } from '@/lib/store'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Product } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

type AuthUser = {
  id: string
  name: string
  email: string
  role?: 'user' | 'admin'
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { getTotalItems, toggleCart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const cartCount = getTotalItems()

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' })
      const data = await res.json()
      setUser(data.user ?? null)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshAuth()
  }, [pathname, refreshAuth])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      setUser(null)
      setDropdownOpen(false)
      router.refresh()
      toast.success('Signed out')
    } catch {
      toast.error('Could not sign out')
    }
  }

  const [searchResults, setSearchResults] = useState<Product[]>([])

  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) { setSearchResults([]); setSelectedIndex(0); return }
    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(q)}&limit=6`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.products ?? [])
          setSelectedIndex(0)
        })
        .catch(() => setSearchResults([]))
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Keyboard shortcut for search & navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Keyboard navigation inside search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (searchResults[selectedIndex]) {
        const item = searchResults[selectedIndex]
        setSearchOpen(false)
        setSearchQuery('')
        router.push(`/product/${item.id}`)
      } else {
        goToFullSearch()
      }
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-user-menu]')) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const goToFullSearch = (queryOverride?: string) => {
    const q = (queryOverride ?? searchQuery).trim()
    setSearchOpen(false)
    setSearchQuery('')
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
  ]

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? ''

  return (
    <>
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-40" style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0">
              <span
                className="text-xl font-bold tracking-widest text-white select-none"
                style={{ letterSpacing: '0.12em' }}
              >
                NEXUS
              </span>
            </Link>

            {/* ── Desktop Nav — pill container ── */}
            <div
              className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.span
                      className={`relative inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer select-none smooth-transition ${
                        active
                          ? 'text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      style={active ? { background: 'white' } : {}}
                      whileTap={{ scale: 0.97 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                )
              })}
            </div>

            {/* ── Right Side Actions ── */}
            <div className="flex items-center gap-2">

              {/* Search — pill button */}
              <motion.button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm text-gray-400 hover:text-white smooth-transition"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs">Search</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] bg-white/5 border border-white/10 font-mono text-gray-400">
                  <Command className="w-2 h-2" />K
                </kbd>
              </motion.button>

              {/* Mobile search icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 text-gray-400 hover:text-white smooth-transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart — pill with count */}
              <motion.button
                type="button"
                onClick={toggleCart}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-400 hover:text-white smooth-transition"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      className="text-xs font-bold text-white"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User Avatar + Dropdown */}
              <div className="relative" data-user-menu>
                <motion.button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full smooth-transition"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Account menu"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{
                      background: user
                        ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
                        : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {user ? userInitial : <User className="w-3.5 h-3.5" />}
                  </div>

                  <motion.div
                    animate={{ rotate: dropdownOpen ? 0 : 180 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                  </motion.div>
                </motion.button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50 shadow-2xl"
                      style={{
                        background: '#111827',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      }}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {user ? (
                        <>
                          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                            >
                              {userInitial}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-0.5">
                                {user.role === 'admin' ? 'ADMIN' : 'MEMBER'}
                              </p>
                            </div>
                          </div>

                          <div className="p-2">
                            {user.role === 'admin' && (
                              <Link
                                href="/admin"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] smooth-transition"
                              >
                                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                                Admin Panel
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 smooth-transition"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-4 border-b border-white/5">
                            <p className="text-sm font-semibold text-white">Account</p>
                            <p className="text-xs text-gray-500 mt-0.5">Sign in to access your account</p>
                          </div>

                          <div className="p-2">
                            <Link
                              href="/login"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] smooth-transition"
                            >
                              <LogIn className="w-4 h-4 text-gray-400" />
                              Log in
                            </Link>
                            <Link
                              href="/signup"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] smooth-transition"
                            >
                              <UserPlus className="w-4 h-4 text-gray-400" />
                              Sign up
                            </Link>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <motion.button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white smooth-transition"
                whileTap={{ scale: 0.95 }}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* ── Mobile Menu ── */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="md:hidden overflow-hidden border-t border-white/5"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="py-3 px-2 space-y-1">
                  {navLinks.map((link, i) => {
                    const active = isActive(link.href)
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-4 py-2.5 rounded-xl text-sm font-medium smooth-transition ${
                            active
                              ? 'bg-white text-black'
                              : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    )
                  })}

                  <div className="border-t border-white/5 pt-3 mt-2 px-2 space-y-1">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 px-2 py-2 mb-1">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                          >
                            {userInitial}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500">{user.role === 'admin' ? 'ADMIN' : 'MEMBER'}</p>
                          </div>
                        </div>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 smooth-transition"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => { setIsMenuOpen(false); void handleLogout() }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 smooth-transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 smooth-transition"
                        >
                          <LogIn className="w-4 h-4" />
                          Log in
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 smooth-transition"
                        >
                          <UserPlus className="w-4 h-4" />
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ─── Search Modal UI (Matching Image Design) ─── */}
      <Dialog
        open={searchOpen}
        onOpenChange={(open) => {
          setSearchOpen(open)
          if (!open) {
            setSearchQuery('')
            setShowFilters(false)
          }
        }}
      >
        <DialogContent
          className="sm:max-w-xl gap-0 p-4 sm:p-5 overflow-hidden border border-white/10 rounded-[28px] shadow-2xl backdrop-blur-2xl bg-[#0e1017]/95"
          style={{
            boxShadow: '0 30px 90px rgba(0,0,0,0.85), 0 0 50px rgba(59,130,246,0.12)',
          }}
        >
          <DialogTitle className="sr-only">Search products</DialogTitle>
          {/* Top Pill Search Bar (Matching image top input style) */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 focus-within:border-[#3B82F6] focus-within:ring-2 focus-within:ring-[#3B82F6]/20 smooth-transition mb-4">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              autoFocus
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none text-white placeholder-gray-400 text-sm focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-white p-1 rounded-lg smooth-transition"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg smooth-transition ${
                showFilters ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Collapsible Category Filter Bar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                  {['All', 'Phones', 'Laptops', 'Audio', 'Gaming', 'Cameras'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => goToFullSearch(cat === 'All' ? '' : cat)}
                      className="px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-[#3B82F6] text-gray-300 hover:text-white border border-white/5 smooth-transition shrink-0"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results List Section */}
          <div className="max-h-[340px] overflow-y-auto space-y-4 pr-1">
            {/* Section 1: Search Suggestions */}
            <div>
              <p className="text-[11px] font-medium text-gray-400 px-2 mb-2">
                Search Suggestions
              </p>

              {/* If no query typed, show popular suggested items */}
              {!searchQuery.trim() && (
                <div className="space-y-1">
                  {[
                    { title: 'iPhone 13', cat: 'Phones', detail: 'A15 Bionic chip • Flagship', tag: 'Phones' },
                    { title: 'Smart LED Bulb', cat: 'Electronics', detail: 'RGB Smart WiFi Light', tag: 'Smart Home' },
                    { title: 'Bluetooth Speaker', cat: 'Audio', detail: '360° Surround Sound', tag: 'Best Seller' },
                  ].map((item, idx) => (
                    <div
                      key={item.title}
                      onClick={() => goToFullSearch(item.title)}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer smooth-transition ${
                        selectedIndex === idx
                          ? 'bg-[#3B82F6]/15 text-white border border-[#3B82F6]/30'
                          : 'hover:bg-white/[0.04] text-gray-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-gray-400 shrink-0">
                          <Flame className="w-4 h-4 text-[#3B82F6]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                          <p className="text-xs text-gray-400 truncate">{item.detail}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/[0.06] text-gray-300 font-medium shrink-0">
                        <Tag className="w-3 h-3 text-[#3B82F6]" />
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* If query typed, render matching live items */}
              {searchQuery.trim() && searchResults.length > 0 && (
                <div className="space-y-1">
                  {searchResults.slice(0, 3).map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                        router.push(`/product/${p.id}`)
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer smooth-transition ${
                        selectedIndex === idx
                          ? 'bg-[#3B82F6]/15 text-white border border-[#3B82F6]/30'
                          : 'hover:bg-white/[0.04] text-gray-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/[0.04] shrink-0 border border-white/5">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate capitalize">{p.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#3B82F6] shrink-0">
                        ${p.price}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery.trim() && searchResults.length === 0 && (
                <p className="px-3 py-4 text-xs text-gray-400 text-center">
                  No matching suggestions found.
                </p>
              )}
            </div>

            {/* Section 2: All Products / Results */}
            <div className="border-t border-white/5 pt-3">
              <p className="text-[11px] font-medium text-gray-400 px-2 mb-2">
                All Products ({searchResults.length > 0 ? searchResults.length : 'Explore'})
              </p>
              {searchResults.slice(3).map((p, idx) => {
                const actualIdx = idx + 3
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                      router.push(`/product/${p.id}`)
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer smooth-transition ${
                      selectedIndex === actualIdx
                        ? 'bg-[#3B82F6]/15 text-white border border-[#3B82F6]/30'
                        : 'hover:bg-white/[0.04] text-gray-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/[0.04] shrink-0 border border-white/5">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                        <p className="text-xs text-gray-400 truncate capitalize">{p.category}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3B82F6] shrink-0">
                      ${p.price}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer Bar with Keyboard Command Badges (Matching image footer) */}
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/5">
                <ArrowDown className="w-3 h-3" />
                <ArrowUp className="w-3 h-3" />
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/5">
                <span className="font-mono text-[10px]">esc</span>
                <span>Close</span>
              </span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/5">
                <CornerDownLeft className="w-3 h-3" />
                <span>Open</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => goToFullSearch()}
              className="text-[#3B82F6] hover:underline font-medium"
            >
              View all results
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
