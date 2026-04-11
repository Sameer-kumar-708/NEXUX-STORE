import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/jwt'
import { AUTH_COOKIE } from '@/lib/auth/constants'

type RequireAdminResult =
  | { ok: true }
  | { ok: false; response: NextResponse }

export async function requireAdminApi(): Promise<RequireAdminResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  try {
    const { role } = await verifyAuthToken(token)
    if (role !== 'admin') {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      }
    }
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { ok: true }
}
