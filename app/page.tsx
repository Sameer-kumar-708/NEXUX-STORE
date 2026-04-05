import { Navbar } from '@/components/ecommerce/navbar'
import { Hero } from '@/components/ecommerce/hero'
import { FeaturedProducts } from '@/components/ecommerce/featured-products'

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      
      {/* Footer */}
      <footer className="glass border-t mt-16 sm:mt-24 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/products" className="hover:text-foreground smooth-transition">All Products</a></li>
                <li><a href="/products" className="hover:text-foreground smooth-transition">New Arrivals</a></li>
                <li><a href="/products" className="hover:text-foreground smooth-transition">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground smooth-transition">About Us</a></li>
                <li><a href="#" className="hover:text-foreground smooth-transition">Contact</a></li>
                <li><a href="#" className="hover:text-foreground smooth-transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground smooth-transition">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground smooth-transition">Shipping Info</a></li>
                <li><a href="#" className="hover:text-foreground smooth-transition">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground smooth-transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground smooth-transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground smooth-transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 sm:pt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Nexus. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground smooth-transition">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground smooth-transition">Instagram</a>
              <a href="#" className="text-muted-foreground hover:text-foreground smooth-transition">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
