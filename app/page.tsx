import { Navbar } from '@/components/ecommerce/navbar'
import { Hero } from '@/components/ecommerce/hero'
import { CategoriesSection } from '@/components/ecommerce/categories-section'
import { FeaturedProducts } from '@/components/ecommerce/featured-products'
import Link from 'next/link'
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  CreditCard,
  Shield,
  Truck,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'

export default function Home() {
  return (
    <main className="bg-[#09090B] text-foreground">
      <Navbar />
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />

      {/* ─── Newsletter Section ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]"
            style={{
              background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Stay in the Loop
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Get early access to new products, exclusive deals, and tech insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 smooth-transition"
            />
            <button className="btn-solid flex items-center justify-center gap-2 text-sm whitespace-nowrap !px-6">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ─── Trust Bar ─── */}
      <section className="border-y border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: Shield, title: 'Secure Payment', desc: 'SSL encryption' },
            { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: CreditCard, title: 'Flexible Payment', desc: 'Multiple options' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 group">
              <div
                className="p-2.5 rounded-xl shrink-0 smooth-transition"
                style={{
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.12)',
                }}
              >
                <item.icon className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Premium Footer ─── */}
      <footer className="pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 mb-12 sm:mb-16">
            {/* Brand Column */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">NX</span>
                </div>
                <div>
                  <span className="text-lg font-bold gradient-accent">NEXUS</span>
                  <span className="block text-[10px] text-gray-500 -mt-1 tracking-widest uppercase">Store</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Your premium destination for cutting-edge technology. Quality meets innovation.
              </p>
              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                {[
                  { icon: Twitter, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Github, href: '#' },
                  { icon: Linkedin, href: '#' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="p-2 rounded-lg hover:bg-white/5 smooth-transition text-gray-500 hover:text-white"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Shop</h4>
              <ul className="space-y-3">
                {['All Products', 'New Arrivals', 'Best Sellers', 'Deals'].map((item) => (
                  <li key={item}>
                    <Link href="/products" className="text-sm text-gray-500 hover:text-white smooth-transition">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-500 hover:text-white smooth-transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Shipping Info', 'Returns', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-500 hover:text-white smooth-transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Licenses'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-500 hover:text-white smooth-transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Nexus Store. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-xs">Accepted Payments:</span>
              <div className="flex gap-2">
                {['Visa', 'MC', 'AMEX', 'GPay'].map((card) => (
                  <div
                    key={card}
                    className="px-2 py-1 rounded text-[10px] font-semibold"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
