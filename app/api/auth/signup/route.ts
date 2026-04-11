import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User, DEFAULT_USER_ROLE } from '@/lib/models/User'
import { signupSchema } from '@/lib/validations/auth'
import { signAuthToken } from '@/lib/auth/jwt'
import { setAuthCookie } from '@/lib/auth/cookies'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Invalid input'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const { name, email, password } = parsed.data
    await connectDB()

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: DEFAULT_USER_ROLE,
    })

    await User.collection.updateOne(
      { _id: user._id },
      { $set: { role: DEFAULT_USER_ROLE } }
    )

    const role: 'user' | 'admin' =
      user.role === 'admin' ? 'admin' : DEFAULT_USER_ROLE

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
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }
    console.error('[signup]', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
