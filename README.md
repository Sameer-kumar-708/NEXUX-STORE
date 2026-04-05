# Nexus - Premium E-Commerce Frontend

A modern, premium e-commerce platform built with Next.js 16, React 19, Framer Motion, and Zustand.

## Features

### Core Features
- **Homepage** - Stunning hero section with featured products
- **Product Catalog** - Browse all products with advanced filtering
- **Product Details** - Detailed product pages with specifications
- **Shopping Cart** - Global state management with Zustand
- **Admin Panel** - Manage products (add, edit, delete)
- **Responsive Design** - Mobile-first design that works on all devices
- **Premium Design** - Glassmorphism effects and smooth animations

### Technical Features
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - State management for cart operations
- **Next.js 16** - Latest React server components
- **Tailwind CSS** - Utility-first styling with custom theme
- **TypeScript** - Type-safe development

## Project Structure

```
app/
├── page.tsx                 # Homepage
├── products/
│   └── page.tsx            # Product listing with filters
├── product/
│   └── [id]/
│       └── page.tsx        # Product detail page
├── cart/
│   └── page.tsx            # Shopping cart page
├── admin/
│   └── page.tsx            # Admin dashboard
├── layout.tsx              # Root layout
└── globals.css             # Global styles

components/
├── ecommerce/
│   ├── navbar.tsx          # Navigation bar
│   ├── hero.tsx            # Hero section
│   ├── featured-products.tsx # Featured products grid
│   ├── product-card.tsx    # Product card component
│   ├── filter-sidebar.tsx  # Filter sidebar
│   ├── cart-sidebar.tsx    # Cart sidebar
│   └── provider.tsx        # Client providers
└── ui/                     # shadcn/ui components

lib/
├── types.ts                # TypeScript types
├── products.ts             # Mock product data
├── store.ts                # Zustand cart store
├── admin-store.ts          # Zustand admin store
└── animations.ts           # Framer Motion animation variants
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## Pages

### Homepage (`/`)
- Hero section with CTA buttons
- Featured products grid
- Statistics section
- Footer with links

### Products (`/products`)
- Full product catalog
- Advanced filtering by:
  - Category
  - Price range
  - Rating
  - Sort options (newest, price, rating)
- Responsive grid layout
- Product cards with quick actions

### Product Detail (`/product/[id]`)
- Large product image
- Full specifications
- Quantity selector
- Add to cart & wishlist buttons
- Related products
- Customer reviews section

### Cart (`/cart`)
- Full cart management
- Quantity adjustments
- Item removal
- Order summary
- Checkout CTA
- Free shipping for orders over $100

### Admin Dashboard (`/admin`)
- Product management
- Add new products
- Edit existing products
- Delete products
- Product statistics
- Inventory tracking

## Customization

### Theming

The app uses custom design tokens in `app/globals.css`. Update the color values to match your brand:

```css
:root {
  --primary: oklch(0.68 0.15 310);      /* Main brand color */
  --accent: oklch(0.68 0.15 310);       /* Accent color */
  --background: oklch(0.12 0 0);        /* Dark background */
  --foreground: oklch(0.92 0 0);        /* Light text */
}
```

### Adding Products

Edit `lib/products.ts` to add your own products:

```typescript
{
  id: '9',
  name: 'Your Product',
  description: 'Product description',
  price: 99.99,
  image: '/your-image.jpg',
  category: 'electronics',
  rating: 4.8,
  reviews: 100,
  stock: 50,
}
```

### Animations

Customize animations in `lib/animations.ts` or use Framer Motion's motion components directly:

```typescript
// Update animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
}
```

## Key Dependencies

- `next@16.2.0` - React framework
- `react@19` - UI library
- `framer-motion@11.0.0` - Animations
- `zustand@4.4.0` - State management
- `tailwindcss@4.2.0` - Styling
- `lucide-react` - Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Image optimization with Next.js Image component
- Lazy loading for images
- Code splitting with dynamic imports
- CSS minification with Tailwind
- Zustand for lightweight state management

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push

# Vercel will auto-deploy on push
# Or manually deploy:
vercel deploy
```

### Environment Variables

No environment variables needed for the current setup. Add them in Vercel dashboard if needed for:
- API endpoints
- Payment processing
- Analytics

## Future Enhancements

- [ ] User authentication with Auth.js
- [ ] Database integration (Supabase/Neon)
- [ ] Payment processing (Stripe)
- [ ] Order tracking
- [ ] User reviews and ratings
- [ ] Wishlist persistence
- [ ] Search functionality
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Email notifications

## License

MIT License - feel free to use this for personal or commercial projects.

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Include screenshots or error messages

---

Built with ❤️ using Next.js and modern web technologies.
