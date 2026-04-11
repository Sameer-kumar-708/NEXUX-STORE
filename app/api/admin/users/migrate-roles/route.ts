import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User, DEFAULT_USER_ROLE } from '@/lib/models/User'
import { requireAdminApi } from '@/lib/auth/require-admin'

export const runtime = 'nodejs'

/** Sets role to "user" on documents missing role or with an invalid value. */
export async function POST() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  await connectDB()
  const result = await User.updateMany(
    {
      $or: [
        { role: { $exists: false } },
        { role: null },
        { role: { $nin: ['user', 'admin'] } },
      ],
    },
    { $set: { role: DEFAULT_USER_ROLE } }
  )

  return NextResponse.json({
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  })
}
