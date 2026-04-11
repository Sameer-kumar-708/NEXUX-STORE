import type { NextResponse } from 'next/server'
import { AUTH_COOKIE, JWT_EXPIRES_DAYS } from './constants'

const maxAge = 60 * 60 * 24 * JWT_EXPIRES_DAYS

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  })
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
