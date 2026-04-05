'use client'

import { ReactNode } from 'react'
import { CartSidebar } from './ecommerce/cart-sidebar'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CartSidebar />
    </>
  )
}
