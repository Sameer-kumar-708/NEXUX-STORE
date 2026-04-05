'use client'

import { motion } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { categories } from '@/lib/products'
import { FilterOptions } from '@/lib/types'
import { X } from 'lucide-react'

interface FilterSidebarProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  isOpen: boolean
  onClose: () => void
}

export function FilterSidebar({
  filters,
  onFilterChange,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId]
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
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-30 md:hidden bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative left-0 top-16 md:top-0 h-screen md:h-auto z-40 w-64 glass p-6 rounded-r-3xl md:rounded-none overflow-y-auto smooth-transition`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-8">
          {/* Sort */}
          <div>
            <h3 className="font-semibold mb-4">Sort By</h3>
            <div className="space-y-3">
              {[
                { value: 'newest', label: 'Newest' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Best Rating' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={() =>
                      handleSortChange(option.value as FilterOptions['sortBy'])
                    }
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-foreground smooth-transition">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={filters.categories.includes(category.slug)}
                    onCheckedChange={() => handleCategoryChange(category.slug)}
                  />
                  <Label
                    htmlFor={`cat-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-4">Price Range</h3>
            <div className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                min={0}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-semibold mb-4">Rating</h3>
            <div className="space-y-3">
              {[5, 4, 3].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-foreground smooth-transition">
                    {'⭐'.repeat(rating)} & up ({rating})
                  </span>
                </label>
              ))}
              {filters.rating > 0 && (
                <button
                  onClick={() => handleRatingChange(0)}
                  className="text-xs text-primary hover:text-accent smooth-transition"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
