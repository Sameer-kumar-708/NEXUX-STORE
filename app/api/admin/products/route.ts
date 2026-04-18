import { NextResponse } from 'next/server'
// NOTE: PUT /api/admin/products and DELETE /api/admin/products are in [id]/route.ts
import { connectDB } from '@/lib/mongodb'
import { Product } from '@/lib/models/Product'
import { requireAdminApi } from '@/lib/auth/require-admin'
import { z } from 'zod'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// Zod schema – validates the POST body coming from the admin
// ---------------------------------------------------------------------------
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  price: z.number({ required_error: 'Price is required' }).min(0, 'Price must be ≥ 0'),
  originalPrice: z.number().min(0).nullable().optional(),
  image: z.string().url('Image must be a valid URL'),
  images: z.array(z.string().url()).optional().default([]),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock must be ≥ 0').default(0),
  badge: z.string().max(50).nullable().optional(),
  specs: z.record(z.string(), z.string()).optional().default({}),
})

// ---------------------------------------------------------------------------
// GET /api/admin/products  (admin-only)
// Lists all products for the admin dashboard – no pagination cap.
// ---------------------------------------------------------------------------
export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    await connectDB()

    const rows = await Product.find().sort({ createdAt: -1 }).lean()

    const products = rows.map((p) => ({
      id:            String(p._id),
      name:          p.name,
      description:   p.description,
      price:         p.price,
      originalPrice: p.originalPrice ?? undefined,
      image:         p.image,
      images:        p.images ?? [],
      category:      p.category,
      rating:        p.rating,
      reviews:       p.reviews,
      stock:         p.stock,
      badge:         p.badge ?? undefined,
      specs:         p.specs ? (p.specs as Record<string, string>) : {},
      createdAt:     p.createdAt,
    }))

    return NextResponse.json({ products, total: products.length })
  } catch (err) {
    console.error('[GET /api/admin/products]', err)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/products  (admin-only)
// Creates a new product and saves it to the database.
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  // 1. Auth guard – only admins may create products
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  // 2. Parse & validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = createProductSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Validation failed'
    return NextResponse.json(
      { error: firstError, details: parsed.error.issues },
      { status: 422 }
    )
  }

  const data = parsed.data

  try {
    // 3. Connect to DB and persist
    await connectDB()

    const product = await Product.create({
      name:          data.name,
      description:   data.description,
      price:         data.price,
      originalPrice: data.originalPrice ?? null,
      image:         data.image,
      images:        data.images ?? [],
      category:      data.category.trim().toLowerCase(),
      stock:         data.stock,
      badge:         data.badge ?? null,
      specs:         data.specs ?? {},
      // rating and reviews start at 0 for a newly uploaded product
      rating:  0,
      reviews: 0,
    })

    // 4. Return the newly created product
    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: {
          id:            String(product._id),
          name:          product.name,
          description:   product.description,
          price:         product.price,
          originalPrice: product.originalPrice ?? undefined,
          image:         product.image,
          images:        product.images,
          category:      product.category,
          rating:        product.rating,
          reviews:       product.reviews,
          stock:         product.stock,
          badge:         product.badge ?? undefined,
          specs:         product.specs ? Object.fromEntries(product.specs as Map<string, string>) : {},
          createdAt:     product.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/admin/products]', err)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
