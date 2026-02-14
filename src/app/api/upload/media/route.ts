import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getCurrentUser } from '@/lib/auth'
import { uploadMedia, deleteFromCloudinary } from '@/lib/cloudinary'
import { parseFormData, validateImageFile } from '@/lib/parseFormData'

const ALLOWED_FOLDERS = ['general', 'notifications', 'banners', 'misc'] as const
const ADMIN_ONLY_FOLDERS = ['banners', 'notifications']
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    const isAdmin = adminEmails.includes(user.email as string) || user.roles?.includes('admin')

    const { fields, file } = await parseFormData(request)
    const { folder, filename } = fields

    if (!folder || !ALLOWED_FOLDERS.includes(folder as (typeof ALLOWED_FOLDERS)[number])) {
      return NextResponse.json(
        { error: `Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(', ')}` },
        { status: 400 },
      )
    }

    if (ADMIN_ONLY_FOLDERS.includes(folder as (typeof ADMIN_ONLY_FOLDERS)[number]) && !isAdmin) {
      return NextResponse.json({ error: `Folder '${folder}' is admin-only` }, { status: 403 })
    }

    const maxSizeMB = isAdmin ? 10 : 5
    const validation = validateImageFile(file, maxSizeMB)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    if (file && !ALLOWED_TYPES.includes(file.mimetype)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG' },
        { status: 400 },
      )
    }

    const safeFilename = filename || `file_${Date.now()}`

    const result = await uploadMedia(file!.buffer, folder, safeFilename)

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    })
  } catch (error: unknown) {
    console.error('Media upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    const isAdmin = adminEmails.includes(user.email as string) || user.roles?.includes('admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'jobboard/',
      max_results: 30,
    })

    const media = result.resources.map((r: any) => ({
      publicId: r.public_id,
      url: r.secure_url,
      format: r.format,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      createdAt: r.created_at,
    }))

    return NextResponse.json({
      success: true,
      media,
    })
  } catch (error: unknown) {
    console.error('List media error:', error)
    const message = error instanceof Error ? error.message : 'Failed to list media'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    const isAdmin = adminEmails.includes(user.email as string) || user.roles?.includes('admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const { publicId } = await request.json()
    if (!publicId) {
      return NextResponse.json({ error: 'publicId required' }, { status: 400 })
    }

    await deleteFromCloudinary(publicId)

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    })
  } catch (error: unknown) {
    console.error('Delete media error:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete media'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
