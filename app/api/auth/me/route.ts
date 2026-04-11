import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import { User, persistUserRoleIfMissing } from '@/lib/models/User'
import { verifyAuthToken } from '@/lib/auth/jwt'
import { AUTH_COOKIE } from '@/lib/auth/constants'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE)?.value
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const { sub } = await verifyAuthToken(token)
    await connectDB()
    const user = await User.findById(sub)
    if (!user) {
      return NextResponse.json({ user: null })
    }

    const role = await persistUserRoleIfMissing(user)

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role,
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
