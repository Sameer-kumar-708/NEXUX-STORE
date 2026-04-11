import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User, persistUserRoleIfMissing } from '@/lib/models/User'
import { loginSchema } from '@/lib/validations/auth'
import { signAuthToken } from '@/lib/auth/jwt'
import { setAuthCookie } from '@/lib/auth/cookies'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Invalid input'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const { email, password } = parsed.data
    await connectDB()

    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const role = await persistUserRoleIfMissing(user)

    const token = await signAuthToken({
      sub: user._id.toString(),
      email: user.email,
      role,
    })

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role,
      },
    })
    setAuthCookie(response, token)
    return response
  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
