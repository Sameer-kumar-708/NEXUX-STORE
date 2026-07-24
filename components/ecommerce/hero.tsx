'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Truck } from 'lucide-react'
import {
  heroTextReveal,
  heroSubtextReveal,
  heroBadgeReveal,
  heroButtonReveal,
  heroStatsReveal,
  staggerContainer,
} from '@/lib/animations'
import { AnimatedCounter } from './animated-counter'
import { useEffect, useState } from 'react'

function FloatingParticles() {
  const [particles, setParticles] = useState<
    { id: number; left: number; size: number; delay: number; duration: number; opacity: number }[]
  >([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 10,
        duration: Math.random() * 15 + 10,
        opacity: Math.random() * 0.3 + 0.1,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 3 === 0 ? '#3B82F6' : p.id % 3 === 1 ? '#8B5CF6' : '#06B6D4',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

function MeshGradientBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#09090B]" />

      {/* Animated mesh blobs */}
      <div
        className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full animate-mesh"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] rounded-full animate-mesh"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animationDelay: '5s',
        }}
      />
      <div
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full animate-mesh"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDelay: '10s',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #09090B 80%)',
        }}
      />
    </div>
  )
}

export function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [0, 800], [5, -5])
  const rotateY = useTransform(mouseX, [0, 1400], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <MeshGradientBackground />
      <FloatingParticles />

      <div className="relative z-10 max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-0">
        <motion.div
          className="space-y-8 text-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Badge */}
          <motion.div className="inline-block" variants={heroBadgeReveal}>
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-[#60A5FA]">Redefining Premium Tech Shopping</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={heroTextReveal}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
              <span className="block text-white">Experience the</span>
              <span className="block mt-2 gradient-accent">Future of Tech</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            variants={heroSubtextReveal}
          >
            Discover a curated collection of premium electronics.
            Every product handpicked for quality, innovation, and design excellence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            variants={heroButtonReveal}
          >
            <Link href="/products">
              <motion.button
                className="btn-solid w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Products
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button
                className="btn-premium w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="inline-flex items-center justify-center gap-2 text-base text-white">
                  Browse Collections
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-6 text-gray-500"
            variants={heroSubtextReveal}
          >
            {[
              { icon: Truck, label: 'Free Shipping' },
              { icon: Shield, label: 'Secure Checkout' },
              { icon: Zap, label: '24/7 Support' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-xs sm:text-sm">
                <badge.icon className="w-4 h-4 text-[#3B82F6]" />
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 sm:mt-28"
          variants={heroStatsReveal}
          initial="initial"
          animate="animate"
        >
          {[
            { target: 10, suffix: 'K+', label: 'Products', icon: '📦' },
            { target: 50, suffix: 'K+', label: 'Happy Customers', icon: '💜' },
            { target: 99, suffix: '%', label: 'Satisfaction', icon: '⭐' },
            { target: 24, suffix: '/7', label: 'Support', icon: '🛡️' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="glow-card p-5 sm:p-6 text-center group"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-400 smooth-transition">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090B] to-transparent pointer-events-none" />
    </section>
  )
}
