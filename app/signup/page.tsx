'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Navbar } from '@/components/ecommerce/navbar'
import { Input } from '@/components/ui/input'
import { slideInLeft, slideInRight } from '@/lib/animations'
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <main className="bg-[#09090B] text-foreground min-h-screen">
      <Navbar />

      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 relative">
        {/* Background accents */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Brand Visual */}
          <motion.div
            className="hidden lg:flex flex-col justify-center"
            variants={slideInLeft}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                <span className="text-base font-bold text-white">NX</span>
              </div>
              <span className="text-2xl font-bold gradient-accent">NEXUS</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Join the<br />
              <span className="gradient-accent">next generation</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
              Create your account to unlock exclusive deals, save your favorites, and enjoy a personalized shopping experience.
            </p>
            <div className="space-y-3">
              {[
                'Early access to new products',
                'Exclusive member-only deals',
                'Personalized recommendations',
                'Order tracking & history',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-5 h-5 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-[#3B82F6]" />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            variants={slideInRight}
            initial="initial"
            animate="animate"
          >
            <div
              className="rounded-2xl p-8 sm:p-10 space-y-6"
              style={{
                background: 'rgba(24,24,27,0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="text-center lg:text-left space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Create account</h1>
                <p className="text-sm text-gray-500">
                  Get started with NEXUS in seconds
                </p>
              </div>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const name = (formData.get('name') as string).trim()
                  const email = (formData.get('email') as string).trim()
                  const password = formData.get('password') as string

                  setPending(true)
                  try {
                    const res = await fetch('/api/auth/signup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, email, password }),
                    })
                    const data = await res.json().catch(() => ({}))
                    if (!res.ok) {
                      toast.error(
                        typeof data.error === 'string'
                          ? data.error
                          : 'Could not create account'
                      )
                      return
                    }
                    toast.success('Account created!')
                    router.push('/')
                    router.refresh()
                  } catch {
                    toast.error('Network error. Try again.')
                  } finally {
                    setPending(false)
                  }
                }}
              >
                <div className="space-y-2">
                  <label htmlFor="signup-name" className="text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                      disabled={pending}
                      className="h-12 pl-10 bg-white/[0.04] border-white/10 rounded-xl focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      disabled={pending}
                      className="h-12 pl-10 bg-white/[0.04] border-white/10 rounded-xl focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      minLength={8}
                      disabled={pending}
                      className="h-12 pl-10 bg-white/[0.04] border-white/10 rounded-xl focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20"
                    />
                  </div>
                  <p className="text-[11px] text-gray-600">Minimum 8 characters</p>
                </div>
                <motion.button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-xl font-semibold px-8 py-3.5 text-sm text-white disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.25)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(139,92,246,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {pending ? 'Creating account...' : 'Create account'}
                  {!pending && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </form>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-[#8B5CF6] font-semibold hover:text-[#A78BFA] smooth-transition"
                >
                  Log in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
