import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { syncAllProductsToPinecone } from '../lib/vector-sync'

async function main() {
  console.log('--- Starting Pinecone Vector Sync ---')
  try {
    const result = await syncAllProductsToPinecone()
    console.log(`[Success] Synced ${result.synced}/${result.total} products to Pinecone!`)
    process.exit(0)
  } catch (error) {
    console.error('[Error] Pinecone vector sync failed:', error)
    process.exit(1)
  }
}

main()
