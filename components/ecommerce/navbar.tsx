'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  UserRound,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'
import { useCart } from '@/lib/store'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { products } from '@/lib/products'
import { filterProductsBySearch } from '@/lib/search'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  const [user, setUser] = useState<AuthUser | null>(null)
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
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
      setUser(null)
      router.refresh()
      toast.success('Signed out')
    } catch {
      toast.error('Could not sign out')
    }
  }

  const searchResults = useMemo(
    () => filterProductsBySearch(products, searchQuery).slice(0, 6),
    [searchQuery]
  )

  const goToFullSearch = () => {
    const q = searchQuery.trim()
    setSearchOpen(false)
    setSearchQuery('')
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`)
    } else {
      router.push('/products')
    }
  }

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
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground smooth-transition"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            <Dialog
              open={searchOpen}
              onOpenChange={(open) => {
                setSearchOpen(open)
                if (!open) setSearchQuery('')
              }}
            >
              <DialogContent className="sm:max-w-lg gap-0 p-0 overflow-hidden border-white/10 bg-card">
                <DialogHeader className="p-6 pb-2 space-y-1">
                  <DialogTitle>Search products</DialogTitle>
                  <DialogDescription>
                    Find items by name, category, or feature
                  </DialogDescription>
                </DialogHeader>
                <div className="px-6 pb-2">
                  <Input
                    autoFocus
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        goToFullSearch()
                      }
                    }}
                    className="h-11 bg-background/50"
                  />
                </div>
                <div className="max-h-72 overflow-y-auto px-2 pb-2">
                  {searchQuery.trim() && searchResults.length === 0 && (
                    <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                      No matches. Try another term or browse all products.
                    </p>
                  )}
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.id}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/5 smooth-transition"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {p.category}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary shrink-0">
                        ${p.price}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-white/5 p-4 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setSearchOpen(false)}
                  >
                    Close
                  </Button>
                  <Button type="button" className="flex-1" onClick={goToFullSearch}>
                    {searchQuery.trim() ? 'View all results' : 'All products'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Cart Button */}
            <motion.button
              type="button"
              onClick={toggleCart}
              className="relative p-2 text-muted-foreground hover:text-foreground smooth-transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open cart"
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

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex p-2 text-muted-foreground hover:text-foreground smooth-transition rounded-lg hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Account menu"
                >
                  <UserRound className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <span className="text-xs text-muted-foreground block">
                        Signed in
                      </span>
                      <span className="truncate block text-foreground">
                        {user.name}
                      </span>
                      <span className="truncate text-xs font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="cursor-pointer flex items-center"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onSelect={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Log in
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="cursor-pointer flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground smooth-transition"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
            <Link
              href="/"
              className="block text-sm text-muted-foreground hover:text-foreground smooth-transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block text-sm text-muted-foreground hover:text-foreground smooth-transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/products"
              className="block text-sm text-muted-foreground hover:text-foreground smooth-transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/"
              className="block text-sm text-muted-foreground hover:text-foreground smooth-transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="border-t border-white/5 pt-3 mt-2 space-y-2">
              {user ? (
                <>
                  <p className="text-xs text-muted-foreground px-0 py-1 truncate">
                    {user.name}
                  </p>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground smooth-transition py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin panel
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      void handleLogout()
                    }}
                    className="flex w-full items-center gap-2 text-sm text-destructive hover:text-destructive/90 smooth-transition py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground smooth-transition py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground smooth-transition py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}
