import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/mongodb'
import { uploadCompanyLogo } from '@/lib/cloudinary'
import { parseFormData, validateImageFile } from '@/lib/parseFormData'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    const isAdmin = adminEmails.includes(user.email as string) || user.roles?.includes('admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admins can upload company logos' }, { status: 403 })
    }

    const { fields, file } = await parseFormData(request)
    const { jobId, company } = fields

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    if (!company) {
      return NextResponse.json({ error: 'company name is required' }, { status: 400 })
    }

    const validation = validateImageFile(file, 3)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const existingJob = await payload.findByID({
      collection: 'jobs',
      id: jobId,
    })

    const result = await uploadCompanyLogo(
      file!.buffer,
      company,
      (existingJob as unknown as { companyLogoPublicId?: string })?.companyLogoPublicId ||
        undefined,
    )

    await payload.update({
      collection: 'jobs',
      id: jobId,
      data: {
        companyLogoUrl: result.url,
        companyLogoPublicId: result.publicId,
      } as any,
    })

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      message: 'Company logo uploaded successfully!',
    })
  } catch (error: unknown) {
    console.error('Logo upload error:', error)
    const message = error instanceof Error ? error.message : 'Logo upload failed'
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

    const { jobId } = await request.json()
    if (!jobId) {
      return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const job = await payload.findByID({
      collection: 'jobs',
      id: jobId,
    })

    const jobWithLogo = job as unknown as { companyLogoPublicId?: string | null }

    if (jobWithLogo?.companyLogoPublicId) {
      const { deleteFromCloudinary } = await import('@/lib/cloudinary')
      await deleteFromCloudinary(jobWithLogo.companyLogoPublicId)
    }

    await payload.update({
      collection: 'jobs',
      id: jobId,
      data: {
        companyLogoUrl: null,
        companyLogoPublicId: null,
      } as any,
    })

    return NextResponse.json({
      success: true,
      message: 'Logo removed successfully',
    })
  } catch (error: unknown) {
    console.error('Delete logo error:', error)
    const message = error instanceof Error ? error.message : 'Failed to remove logo'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
