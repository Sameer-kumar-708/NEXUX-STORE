import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { requireAdminApi } from '@/lib/auth/require-admin'

export const runtime = 'nodejs'

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  await connectDB()
  const rows = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .lean()

  const users = rows.map((u) => ({
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role === 'admin' ? 'admin' : 'user',
    createdAt: u.createdAt,
  }))

  return NextResponse.json({ users })
}
