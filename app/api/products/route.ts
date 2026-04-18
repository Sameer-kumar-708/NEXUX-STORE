import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Product } from '@/lib/models/Product'

export const runtime = 'nodejs'

/**
 * GET /api/products
 * Public endpoint – returns all products.
 *
 * Query params (all optional):
 *  - category : filter by category slug  (e.g. ?category=electronics)
 *  - q        : free-text search on name/description
 *  - sort     : "newest" | "price-low" | "price-high" | "rating"  (default: newest)
 *  - limit    : max items to return (default: 100)
 *  - page     : 1-based page number  (default: 1)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category') ?? ''
    const q        = searchParams.get('q')        ?? ''
    const sort     = searchParams.get('sort')     ?? 'newest'
    const limit    = Math.min(Number(searchParams.get('limit') ?? 100), 200)
    const page     = Math.max(Number(searchParams.get('page')  ?? 1), 1)

    await connectDB()

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {}
    if (category) filter.category = category.trim().toLowerCase()
    if (q)        filter.$or = [
      { name:        { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ]

    // Build sort
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      'newest':     { createdAt: -1 },
      'price-low':  { price:     1  },
      'price-high': { price:     -1 },
      'rating':     { rating:    -1 },
    }
    const sortObj = sortMap[sort] ?? sortMap['newest']

    const [total, rows] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ])

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

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error('[GET /api/products]', err)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
