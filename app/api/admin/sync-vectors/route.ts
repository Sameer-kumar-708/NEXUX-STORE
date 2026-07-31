import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin'
import { syncAllProductsToPinecone } from '@/lib/vector-sync'

export const runtime = 'nodejs'

/**
 * POST /api/admin/sync-vectors
 * Triggers a full bulk sync of all products from MongoDB to Pinecone vector DB.
 */
export async function POST() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const result = await syncAllProductsToPinecone()
    return NextResponse.json({
      message: 'Vector synchronization completed successfully',
      stats: result,
    })
  } catch (err) {
    console.error('[POST /api/admin/sync-vectors]', err)
    return NextResponse.json(
      { error: 'Failed to sync vectors to Pinecone', details: String(err) },
      { status: 500 }
    )
  }
}
