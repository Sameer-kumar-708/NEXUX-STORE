import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Product } from '@/lib/models/Product'
import { requireAdminApi } from '@/lib/auth/require-admin'
import { z } from 'zod'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// Zod schema for partial update (all fields optional)
// ---------------------------------------------------------------------------
const updateProductSchema = z.object({
  name:          z.string().min(1).max(200).optional(),
  description:   z.string().min(1).optional(),
  price:         z.number().min(0).optional(),
  originalPrice: z.number().min(0).nullable().optional(),
  image:         z.string().url().optional(),
  images:        z.array(z.string().url()).optional(),
  category:      z.string().min(1).optional(),
  stock:         z.number().int().min(0).optional(),
  badge:         z.string().max(50).nullable().optional(),
  specs:         z.record(z.string(), z.string()).optional(),
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function mapProduct(p: Record<string, unknown>) {
  return {
    id:            String(p._id),
    name:          p.name,
    description:   p.description,
    price:         p.price,
    originalPrice: (p.originalPrice as number | null) ?? undefined,
    image:         p.image,
    images:        p.images ?? [],
    category:      p.category,
    rating:        p.rating,
    reviews:       p.reviews,
    stock:         p.stock,
    badge:         (p.badge as string | null) ?? undefined,
    specs:         p.specs
      ? (p.specs as Record<string, string>)
      : {},
    createdAt:     p.createdAt,
    updatedAt:     p.updatedAt,
  }
}

// ---------------------------------------------------------------------------
// PUT /api/admin/products/[id]  – update a product (admin-only)
// ---------------------------------------------------------------------------
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = updateProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed', details: parsed.error.issues },
      { status: 422 }
    )
  }

  const data = parsed.data
  // Normalise category to lowercase if provided
  if (data.category) data.category = data.category.trim().toLowerCase()

  try {
    await connectDB()
    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean()

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Product updated',
      product: mapProduct(updated as Record<string, unknown>),
    })
  } catch (err) {
    console.error('[PUT /api/admin/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/admin/products/[id]  – remove a product (admin-only)
// ---------------------------------------------------------------------------
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
  }

  try {
    await connectDB()
    const deleted = await Product.findByIdAndDelete(id).lean()
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Product deleted', id })
  } catch (err) {
    console.error('[DELETE /api/admin/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
