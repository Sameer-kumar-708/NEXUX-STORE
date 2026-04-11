'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Navbar } from '@/components/ecommerce/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export default function SignupPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <motion.div
        className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp} className="glass rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Create account</h1>
            <p className="text-sm text-muted-foreground">
              Join Nexus and start shopping
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
              <label htmlFor="signup-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                required
                disabled={pending}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="signup-email"
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
              <label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                required
                minLength={8}
                disabled={pending}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={pending}
            >
              {pending ? 'Creating account…' : 'Sign up'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </main>
  )
}
