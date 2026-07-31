import { generateEmbedding } from './gemini'
import { getPineconeIndex, ensurePineconeIndexExists } from './pinecone'
import { connectDB } from './mongodb'
import { Product } from './models/Product'

export interface ProductDocument {
  _id: string | { toString(): string }
  name: string
  description: string
  price: number
  category: string
  rating?: number
  stock?: number
  badge?: string
  specs?: Map<string, string> | Record<string, string>
}

/**
 * Creates a detailed text representation of a product for generating rich vector embeddings.
 */
export function buildProductText(product: ProductDocument): string {
  let specsText = ''
  if (product.specs) {
    const entries =
      product.specs instanceof Map
        ? Array.from(product.specs.entries())
        : Object.entries(product.specs)
    if (entries.length > 0) {
      specsText = ' Specifications: ' + entries.map(([k, v]) => `${k}: ${v}`).join(', ')
    }
  }

  const badgeText = product.badge ? ` Badge: ${product.badge}.` : ''

  return `Product Name: ${product.name}. Category: ${product.category}. Price: $${product.price}.${badgeText} Description: ${product.description}.${specsText}`
}

/**
 * Upserts a single product into Pinecone.
 */
export async function upsertProductVector(product: ProductDocument) {
  try {
    const productId = product._id.toString()
    const textToEmbed = buildProductText(product)

    // 1. Generate 768-dim vector embedding using Gemini
    const vector = await generateEmbedding(textToEmbed)

    // 2. Prepare Pinecone metadata
    const index = getPineconeIndex()
    await index.upsert({
      records: [
        {
          id: productId,
          values: vector,
          metadata: {
            name: product.name,
            category: product.category.toLowerCase(),
            price: product.price,
            rating: product.rating ?? 0,
            stock: product.stock ?? 0,
            description: product.description.substring(0, 300), // metadata preview
          },
        },
      ],
    })

    console.log(`[Pinecone Sync] Upserted product vector for ID: ${productId}`)
  } catch (error) {
    console.error(`[Pinecone Sync Error] Failed for product ${product._id}:`, error)
  }
}

/**
 * Deletes a product vector from Pinecone index.
 */
export async function deleteProductVector(productId: string) {
  try {
    const index = getPineconeIndex()
    await index.deleteOne({ id: productId })
    console.log(`[Pinecone Sync] Deleted product vector for ID: ${productId}`)
  } catch (error) {
    console.error(`[Pinecone Sync Error] Failed to delete product ${productId}:`, error)
  }
}

/**
 * Syncs all existing products from MongoDB into Pinecone.
 */
export async function syncAllProductsToPinecone() {
  await ensurePineconeIndexExists()
  await connectDB()

  const products = await Product.find().lean()
  console.log(`[Pinecone Bulk Sync] Syncing ${products.length} products to Pinecone...`)

  let successCount = 0
  for (const prod of products) {
    try {
      await upsertProductVector(prod as unknown as ProductDocument)
      successCount++
    } catch (err) {
      console.error(`Failed vector sync for ${prod._id}`, err)
    }
  }

  return { total: products.length, synced: successCount }
}
