'use client'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { CartSidebar } from './ecommerce/cart-sidebar'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CartSidebar />
      <Toaster richColors position="top-center" theme="dark" closeButton />
    </>
  )
}
