import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Product } from '@/lib/models/Product'
import { parseSearchQuery, generateEmbedding } from '@/lib/gemini'
import { getPineconeIndex } from '@/lib/pinecone'

export const runtime = 'nodejs'

/**
 * GET /api/search/semantic?q=Mujhe+laptop+chaiye+under+500
 * Multilingual & natural language semantic search endpoint using Gemini + Pinecone.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q')?.trim() ?? ''

    if (!rawQuery) {
      return NextResponse.json({
        query: '',
        interpretedQuery: '',
        filtersExtracted: {},
        products: [],
        total: 0,
      })
    }

    await connectDB()

    // 1. Check if Gemini and Pinecone keys are available. If not, use intelligent fallback search.
    const hasKeys = Boolean(process.env.GEMINI_API_KEY && process.env.PINECONE_API_KEY)

    if (!hasKeys) {
      console.warn('[Semantic Search] API keys missing for Gemini/Pinecone. Using MongoDB regex fallback.')
      const regexFilter = {
        $or: [
          { name: { $regex: rawQuery, $options: 'i' } },
          { description: { $regex: rawQuery, $options: 'i' } },
          { category: { $regex: rawQuery, $options: 'i' } },
        ],
      }
      const rows = await Product.find(regexFilter).limit(20).lean()
      const products = rows.map(formatProduct)
      return NextResponse.json({
        query: rawQuery,
        interpretedQuery: rawQuery,
        filtersExtracted: {},
        products,
        total: products.length,
        isFallback: true,
      })
    }

    // 2. Parse natural language intent & extract metadata filters via Gemini
    const { cleanedQuery, filters, explanation } = await parseSearchQuery(rawQuery)
    const searchIntent = cleanedQuery || rawQuery

    // 3. Generate embedding vector using Gemini text-embedding-004
    const queryVector = await generateEmbedding(searchIntent)

    // 4. Construct Pinecone metadata filters (e.g. price limits, category)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pineconeFilter: Record<string, any> = {}
    if (filters?.maxPrice && filters.maxPrice > 0) {
      pineconeFilter.price = { $lte: filters.maxPrice }
    }
    if (filters?.minPrice && filters.minPrice > 0) {
      if (pineconeFilter.price) {
        pineconeFilter.price.$gte = filters.minPrice
      } else {
        pineconeFilter.price = { $gte: filters.minPrice }
      }
    }
    if (filters?.category && typeof filters.category === 'string') {
      pineconeFilter.category = { $eq: filters.category.toLowerCase() }
    }

    // 5. Query Pinecone vector DB
    const index = getPineconeIndex()
    const pineconeResponse = await index.query({
      vector: queryVector,
      topK: 20,
      includeMetadata: true,
      filter: Object.keys(pineconeFilter).length > 0 ? pineconeFilter : undefined,
    })

    const matches = pineconeResponse.matches || []
    const matchMap = new Map<string, number>()
    matches.forEach((m) => {
      if (m.id) matchMap.set(m.id, m.score ?? 0)
    })

    const productIds = Array.from(matchMap.keys())

    let products: ReturnType<typeof formatProduct>[] = []

    if (productIds.length > 0) {
      // 6. Fetch matched product documents from MongoDB
      const dbProducts = await Product.find({ _id: { $in: productIds } }).lean()

      // Sort MongoDB products based on Pinecone vector similarity scores
      const sortedDbProducts = dbProducts.sort((a, b) => {
        const scoreA = matchMap.get(String(a._id)) ?? 0
        const scoreB = matchMap.get(String(b._id)) ?? 0
        return scoreB - scoreA
      })

      products = sortedDbProducts.map((p) => ({
        ...formatProduct(p),
        similarityScore: matchMap.get(String(p._id)),
      }))
    } else {
      // If Pinecone filter returned zero items, attempt fallback query without strict category filter
      const fallbackRows = await Product.find({
        $or: [
          { name: { $regex: searchIntent, $options: 'i' } },
          { description: { $regex: searchIntent, $options: 'i' } },
        ],
      })
        .limit(10)
        .lean()

      products = fallbackRows.map(formatProduct)
    }

    return NextResponse.json({
      query: rawQuery,
      interpretedQuery: searchIntent,
      filtersExtracted: filters || {},
      explanation,
      products,
      total: products.length,
    })
  } catch (err) {
    console.error('[GET /api/search/semantic]', err)
    return NextResponse.json(
      { error: 'Failed to perform semantic search', details: String(err) },
      { status: 500 }
    )
  }
}

// Helper to format Mongoose document to frontend Product interface
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatProduct(p: any) {
  return {
    id: String(p._id),
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    image: p.image,
    images: p.images ?? [],
    category: p.category,
    rating: p.rating,
    reviews: p.reviews,
    stock: p.stock,
    badge: p.badge ?? undefined,
    specs: p.specs ? (p.specs as Record<string, string>) : {},
    createdAt: p.createdAt,
  }
}
