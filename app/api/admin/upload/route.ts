import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { requireAdminApi } from '@/lib/auth/require-admin'

export const runtime = 'nodejs'

const MAX_BYTES = 5 * 1024 * 1024

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

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
    return NextResponse.json(
      { error: 'Image must be 5MB or smaller' },
      { status: 400 }
    )
  }

  const ext = MIME_TO_EXT[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: 'Use JPEG, PNG, WebP, or GIF' },
      { status: 400 }
    )
  }

  const filename = `${randomUUID()}${ext}`
  const dir = join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(dir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(join(dir, filename), buffer)

  return NextResponse.json({ url: `/uploads/products/${filename}` })
}
