'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Navbar } from '@/components/ecommerce/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations'
import { safePostLoginPath } from '@/lib/auth/redirect-path'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, setPending] = useState(false)

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 relative">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
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
            Welcome back to<br />
            <span className="gradient-accent">the future of tech</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
            Sign in to access your account, track orders, and discover personalized recommendations.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {['10K+ Products', '50K+ Customers', '24/7 Support'].map((stat) => (
              <div key={stat} className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                {stat}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Log in</h1>
              <p className="text-sm text-gray-500">
                Enter your credentials to continue
              </p>
            </div>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const email = (formData.get('email') as string).trim()
                const password = formData.get('password') as string

                setPending(true)
                try {
                  const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                  })
                  const data = await res.json().catch(() => ({}))
                  if (!res.ok) {
                    toast.error(
                      typeof data.error === 'string'
                        ? data.error
                        : 'Could not log in'
                    )
                    return
                  }
                  toast.success('Welcome back!')
                  const dest = safePostLoginPath(searchParams.get('next'))
                  router.push(dest)
                  router.refresh()
                } catch {
                  toast.error('Network error. Try again.')
                } finally {
                  setPending(false)
                }
              }}
            >
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    disabled={pending}
                    className="h-12 pl-10 bg-white/[0.04] border-white/10 rounded-xl focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    disabled={pending}
                    className="h-12 pl-10 bg-white/[0.04] border-white/10 rounded-xl focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={pending}
                className="w-full btn-solid flex items-center justify-center gap-2 !py-3.5 text-sm disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {pending ? 'Signing in...' : 'Log in'}
                {!pending && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>
            <p className="text-center text-sm text-gray-500">
              No account?{' '}
              <Link
                href="/signup"
                className="text-[#3B82F6] font-semibold hover:text-[#60A5FA] smooth-transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="bg-[#09090B] text-foreground min-h-screen">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="text-gray-500 text-sm">Loading...</div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
