import { SignJWT, jwtVerify } from 'jose'
import { JWT_EXPIRES_DAYS } from './constants'

export type UserRole = 'user' | 'admin'

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      'JWT_SECRET must be set in .env.local and be at least 16 characters'
    )
  }
  return new TextEncoder().encode(secret)
}

function parseRole(value: unknown): UserRole {
  if (value === 'admin' || value === 'user') return value
  return 'user'
}

export async function signAuthToken(payload: {
  sub: string
  email: string
  role: UserRole
}): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRES_DAYS}d`)
    .sign(getSecret())
}

export async function verifyAuthToken(token: string): Promise<{
  sub: string
  email: string
  role: UserRole
}> {
  const { payload } = await jwtVerify(token, getSecret())
  const sub = payload.sub
  const email = payload.email
  if (typeof sub !== 'string' || typeof email !== 'string') {
    throw new Error('Invalid token payload')
  }
  const role = parseRole(payload.role)
  return { sub, email, role }
}
