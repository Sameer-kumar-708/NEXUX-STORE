import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/jwt'
import { AUTH_COOKIE } from '@/lib/auth/constants'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value
  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.searchParams.set('next', '/admin')

  if (!token) {
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { role } = await verifyAuthToken(token)
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch {
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
