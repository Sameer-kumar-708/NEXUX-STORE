'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Camera,
  Watch,
  Monitor,
  Speaker,
} from 'lucide-react'
import { staggerContainer, cardReveal, sectionHeaderReveal } from '@/lib/animations'

const categories = [
  { name: 'Phones', slug: 'phones', icon: Smartphone, color: '#3B82F6', gradient: 'from-blue-500/20 to-blue-600/5' },
  { name: 'Laptops', slug: 'laptops', icon: Laptop, color: '#8B5CF6', gradient: 'from-violet-500/20 to-violet-600/5' },
  { name: 'Gaming', slug: 'gaming', icon: Gamepad2, color: '#06B6D4', gradient: 'from-cyan-500/20 to-cyan-600/5' },
  { name: 'Audio', slug: 'audio', icon: Headphones, color: '#10B981', gradient: 'from-emerald-500/20 to-emerald-600/5' },
  { name: 'Cameras', slug: 'cameras', icon: Camera, color: '#F59E0B', gradient: 'from-amber-500/20 to-amber-600/5' },
  { name: 'Watches', slug: 'watches', icon: Watch, color: '#EC4899', gradient: 'from-pink-500/20 to-pink-600/5' },
  { name: 'Monitors', slug: 'monitors', icon: Monitor, color: '#6366F1', gradient: 'from-indigo-500/20 to-indigo-600/5' },
  { name: 'Speakers', slug: 'speakers', icon: Speaker, color: '#EF4444', gradient: 'from-red-500/20 to-red-600/5' },
]

export function CategoriesSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle bg accent */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 sm:mb-16"
          variants={sectionHeaderReveal}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <span className="text-[#A78BFA]">Shop by Category</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Find What You Love
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Browse our carefully organized categories to find exactly what you need
          </p>
          <div className="accent-line mt-6" />
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div key={category.slug} variants={cardReveal}>
                <Link href={`/products?category=${category.slug}`}>
                  <motion.div
                    className="glow-card p-6 sm:p-8 text-center group cursor-pointer relative overflow-hidden"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Hover gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 smooth-transition`}
                    />

                    {/* Icon */}
                    <motion.div
                      className="relative z-10 mx-auto mb-4 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `${category.color}15`,
                        border: `1px solid ${category.color}20`,
                      }}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: category.color }} />
                    </motion.div>

                    {/* Label */}
                    <h3 className="relative z-10 text-sm sm:text-base font-semibold text-gray-300 group-hover:text-white smooth-transition">
                      {category.name}
                    </h3>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
