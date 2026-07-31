import { Pinecone } from '@pinecone-database/pinecone'

export function getPineconeClient() {
  const apiKey = process.env.PINECONE_API_KEY
  if (!apiKey) {
    throw new Error('PINECONE_API_KEY is not defined in environment variables.')
  }
  return new Pinecone({ apiKey })
}

export function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX || 'nexus-store'
  const client = getPineconeClient()
  return client.index(indexName)
}

export interface PineconeProductMetadata {
  name: string
  category: string
  price: number
  rating: number
  stock: number
  description: string
  badge?: string
}

/**
 * Ensures that the Pinecone index exists with 768 dimensions (for Gemini text-embedding-004) and cosine metric.
 */
export async function ensurePineconeIndexExists() {
  const indexName = process.env.PINECONE_INDEX || 'nexus-store'
  const client = getPineconeClient()
  const existingIndexes = await client.listIndexes()
  const exists = existingIndexes.indexes?.some((idx) => idx.name === indexName)

  if (!exists) {
    console.log(`Creating Pinecone index: ${indexName}...`)
    await client.createIndex({
      name: indexName,
      dimension: 1024, // gemini-embedding-001 outputDimensionality 1024
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    })
    console.log(`Pinecone index ${indexName} created successfully!`)
  }
}
