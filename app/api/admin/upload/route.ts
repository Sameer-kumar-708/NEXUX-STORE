import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin'

export const runtime = 'nodejs'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: Request) {
  // 1. Admin guard
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  // 2. Cloudinary credentials check
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey    = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local' },
      { status: 500 }
    )
  }

  // 3. Parse form data
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be 5 MB or smaller' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Use JPEG, PNG, WebP, or GIF' }, { status: 400 })
  }

  // 4. Build signed upload parameters
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder    = 'nexux-store/products'
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`

  // 5. Generate SHA-1 signature (Node built-in crypto)
  const { createHash } = await import('crypto')
  const signature = createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  // 6. Upload to Cloudinary via their REST API
  const uploadForm = new FormData()
  uploadForm.append('file', file)
  uploadForm.append('api_key', apiKey)
  uploadForm.append('timestamp', timestamp)
  uploadForm.append('signature', signature)
  uploadForm.append('folder', folder)

  const cloudRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: uploadForm }
  )

  if (!cloudRes.ok) {
    const err = await cloudRes.json().catch(() => ({}))
    console.error('[Cloudinary upload error]', err)
    return NextResponse.json(
      { error: (err as { error?: { message?: string } }).error?.message ?? 'Cloudinary upload failed' },
      { status: 502 }
    )
  }

  const cloudData = await cloudRes.json() as { secure_url: string; public_id: string }

  // 7. Return the permanent CDN URL
  return NextResponse.json({ url: cloudData.secure_url })
}
