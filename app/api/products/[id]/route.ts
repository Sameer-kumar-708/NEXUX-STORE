import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Product } from '@/lib/models/Product'
import mongoose from 'mongoose'

export const runtime = 'nodejs'

/**
 * GET /api/products/[id]
 * Public endpoint – returns a single product by its MongoDB ObjectId.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Validate ObjectId format early to avoid a DB round-trip on garbage input
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
  }

  try {
    await connectDB()

    const p = await Product.findById(id).lean()
    if (!p) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      product: {
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
        updatedAt:     p.updatedAt,
      },
    })
  } catch (err) {
    console.error('[GET /api/products/[id]]', err)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
