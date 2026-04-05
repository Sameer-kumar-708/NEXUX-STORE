'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export function Hero() {
  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-0"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_1px,transparent_1px),linear-gradient(to_bottom,transparent_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02]" />
      </div>

      <div className="max-w-5xl w-full">
        <motion.div
          className="space-y-6 sm:space-y-8 text-center"
          variants={fadeInUp}
        >
          {/* Tagline */}
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="glass px-4 py-2 rounded-full inline-block mb-6">
              <span className="text-xs sm:text-sm font-semibold gradient-accent">
                ✨ Welcome to Nexus
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight"
            variants={fadeInUp}
          >
            <span className="block">Experience the</span>
            <span className="gradient-accent">Future of Shopping</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Discover curated premium products with seamless shopping experience. Quality meets innovation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4 sm:pt-8"
            variants={fadeInUp}
          >
            <Link href="/products">
              <motion.button
                className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 smooth-transition flex items-center justify-center gap-2 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button
                className="w-full sm:w-auto px-8 py-3 sm:py-4 glass rounded-lg hover:border-primary/50 font-semibold smooth-transition whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Collections
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 sm:mt-24"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { number: '10K+', label: 'Products' },
            { number: '50K+', label: 'Happy Customers' },
            { number: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass p-4 sm:p-6 rounded-2xl text-center"
              variants={fadeInUp}
            >
              <p className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                {stat.number}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
