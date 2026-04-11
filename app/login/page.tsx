'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Navbar } from '@/components/ecommerce/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { safePostLoginPath } from '@/lib/auth/redirect-path'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, setPending] = useState(false)

  return (
    <motion.div
      className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp} className="glass rounded-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Log in</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to Nexus
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
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              disabled={pending}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              disabled={pending}
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 font-semibold"
            disabled={pending}
          >
            {pending ? 'Signing in…' : 'Log in'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          No account?{' '}
          <Link
            href="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <Suspense
        fallback={
          <div className="max-w-md mx-auto px-4 py-24 text-center text-muted-foreground text-sm">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
