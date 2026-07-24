'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Category, FilterOptions } from '@/lib/types'
import { ChevronDown, X, RotateCcw, SlidersHorizontal, Check, Star } from 'lucide-react'

interface FilterSidebarProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  isOpen?: boolean
  onClose?: () => void
  categories?: Category[]
}

export function FilterSidebar({
  filters,
  onFilterChange,
  categories = [],
}: FilterSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCategoryToggle = (slug: string) => {
    const newCategories = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug]
    onFilterChange({ ...filters, categories: newCategories })
  }

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, rating: filters.rating === rating ? 0 : rating })
  }

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFilterChange({ ...filters, sortBy })
    setOpenDropdown(null)
  }

  const resetFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: [0, 5000],
      rating: 0,
      sortBy: 'newest',
    })
    setOpenDropdown(null)
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.rating > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name))
  }

  return (
    <div ref={containerRef} className="w-full space-y-4 mb-8">
      {/* Horizontal Filter Pill Bar */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 py-2 border-b border-white/5 pb-4">
        
        {/* Category Filter Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('category')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium smooth-transition select-none ${
              filters.categories.length > 0
                ? 'bg-white text-black font-semibold'
                : 'bg-white/[0.05] text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <span>Category {filters.categories.length > 0 ? `(${filters.categories.length})` : ''}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 smooth-transition ${
                openDropdown === 'category' ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === 'category' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-64 p-4 rounded-2xl bg-[#111827] border border-white/10 shadow-2xl z-50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Filter by Category</span>
                  {filters.categories.length > 0 && (
                    <button
                      onClick={() => onFilterChange({ ...filters, categories: [] })}
                      className="text-[11px] text-[#3B82F6] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {categories.map((cat) => {
                    const selected = filters.categories.includes(cat.slug)
                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.slug)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer smooth-transition ${
                          selected
                            ? 'bg-[#8B5CF6]/15 text-white font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="capitalize">{cat.name}</span>
                        <Checkbox
                          id={`cat-${cat.id}`}
                          checked={selected}
                          onCheckedChange={() => handleCategoryToggle(cat.slug)}
                          className="border-white/20 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                        />
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range Filter Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('price')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium smooth-transition select-none ${
              filters.priceRange[0] > 0 || filters.priceRange[1] < 5000
                ? 'bg-white text-black font-semibold'
                : 'bg-white/[0.05] text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <span>
              Price {filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? `($${filters.priceRange[0]} - $${filters.priceRange[1]})` : ''}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 smooth-transition ${
                openDropdown === 'price' ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === 'price' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-72 p-5 rounded-2xl bg-[#111827] border border-white/10 shadow-2xl z-50 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Price Range</span>
                  <button
                    onClick={() => onFilterChange({ ...filters, priceRange: [0, 5000] })}
                    className="text-[11px] text-[#3B82F6] hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-4 pt-1">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={handlePriceChange}
                    min={0}
                    max={5000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-3 py-1 rounded-lg bg-white/[0.06] text-gray-300 font-mono">
                      ${filters.priceRange[0]}
                    </span>
                    <span className="text-gray-500">to</span>
                    <span className="px-3 py-1 rounded-lg bg-white/[0.06] text-gray-300 font-mono">
                      ${filters.priceRange[1]}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Filter Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('rating')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium smooth-transition select-none ${
              filters.rating > 0
                ? 'bg-white text-black font-semibold'
                : 'bg-white/[0.05] text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <span>Rating {filters.rating > 0 ? `(${filters.rating}★ & up)` : ''}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 smooth-transition ${
                openDropdown === 'rating' ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === 'rating' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-60 p-4 rounded-2xl bg-[#111827] border border-white/10 shadow-2xl z-50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Minimum Rating</span>
                  {filters.rating > 0 && (
                    <button
                      onClick={() => onFilterChange({ ...filters, rating: 0 })}
                      className="text-[11px] text-[#3B82F6] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {[5, 4, 3].map((r) => {
                    const active = filters.rating === r
                    return (
                      <div
                        key={r}
                        onClick={() => handleRatingChange(r)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer smooth-transition ${
                          active
                            ? 'bg-[#F59E0B]/15 text-white font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {Array.from({ length: r }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                          ))}
                          <span className="ml-1 text-gray-400 text-xs">& up</span>
                        </div>
                        {active && <Check className="w-4 h-4 text-[#F59E0B]" />}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort By Filter Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('sort')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium smooth-transition select-none ${
              filters.sortBy !== 'newest'
                ? 'bg-white text-black font-semibold'
                : 'bg-white/[0.05] text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <span>
              Sort: {
                filters.sortBy === 'newest'
                  ? 'Newest'
                  : filters.sortBy === 'price-low'
                  ? 'Price: Low to High'
                  : filters.sortBy === 'price-high'
                  ? 'Price: High to Low'
                  : 'Best Rating'
              }
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 smooth-transition ${
                openDropdown === 'sort' ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === 'sort' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-56 p-3 rounded-2xl bg-[#111827] border border-white/10 shadow-2xl z-50 space-y-1"
              >
                {[
                  { value: 'newest', label: 'Newest' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Best Rating' },
                ].map((option) => {
                  const active = filters.sortBy === option.value
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSortChange(option.value as FilterOptions['sortBy'])}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer smooth-transition ${
                        active
                          ? 'bg-[#3B82F6]/15 text-white font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{option.label}</span>
                      {active && <Check className="w-4 h-4 text-[#3B82F6]" />}
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-gray-400 hover:text-white underline underline-offset-4 ml-auto smooth-transition flex items-center gap-1 py-1 px-2"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
