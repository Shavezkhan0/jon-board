import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/mongodb'
import { getCurrentUser } from '@/lib/auth'
import type { SendNotificationRequest } from '@/types/notifications'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Auth check — must be admin
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin by email from env
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    const isAdmin = adminEmails.includes(user.email) || user.roles?.includes('admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 })
    }

    // Step 2: Parse and validate request body
    const body: SendNotificationRequest = await request.json()
    const { jobId, title, message, type, recipient, selectedEmails, sendEmail } = body

    if (!title || !message || !type || !recipient) {
      return NextResponse.json(
        { error: 'title, message, type and recipient are required' },
        { status: 400 },
      )
    }

    if (recipient === 'selected' && (!selectedEmails || selectedEmails.length === 0)) {
      return NextResponse.json(
        { error: 'selectedEmails required when recipient is selected' },
        { status: 400 },
      )
    }

    const payload = await getPayloadClient()

    // Step 3: Create Notification document
    const notificationDoc = await payload.create({
      collection: 'notifications',
      data: {
        title,
        message,
        type,
        recipient,
        job: jobId || null,
        selectedUsers: selectedEmails?.map((e) => ({ email: e })) || [],
        sentAt: new Date().toISOString(),
        emailAlsoSent: sendEmail || false,
        totalRecipients: 0,
      },
    })

    // Step 4: Find target users based on recipient type
    let targetUsers: any[] = []

    if (recipient === 'all') {
      const result = await payload.find({
        collection: 'users',
        limit: 10000,
        where: { _verified: { equals: true } },
      })
      targetUsers = result.docs
    } else if (recipient === 'subscribed') {
      const result = await payload.find({
        collection: 'users',
        limit: 10000,
        where: {
          and: [
            { subscriptionStatus: { equals: 'active' } },
            { subscriptionExpiry: { greater_than: new Date().toISOString() } },
            { _verified: { equals: true } },
          ],
        },
      })
      targetUsers = result.docs
    } else if (recipient === 'selected' && selectedEmails) {
      const result = await payload.find({
        collection: 'users',
        limit: 1000,
        where: {
          email: { in: selectedEmails },
        },
      })
      targetUsers = result.docs
    }

    // Step 5: Create UserNotification for each user
    const userNotifResults = await Promise.allSettled(
      targetUsers.map((targetUser) =>
        payload.create({
          collection: 'user-notifications',
          data: {
            user: targetUser.id,
            notification: notificationDoc.id,
            isRead: false,
          },
        }),
      ),
    )

    const successCount = userNotifResults.filter((r) => r.status === 'fulfilled').length

    // Step 6: Update notification with total recipients
    await payload.update({
      collection: 'notifications',
      id: notificationDoc.id,
      data: { totalRecipients: successCount },
    })

    // Step7: Update job if jobId provided
    if (jobId) {
      await payload.update({
        collection: 'jobs',
        id: jobId,
        data: {
          notificationSent: true,
          notificationSentAt: new Date().toISOString(),
          notificationSentTo: recipient,
        },
      })
    }

    // Step 8: Send emails if requested
    if (sendEmail && targetUsers.length > 0) {
      let jobDetails = null
      if (jobId) {
        try {
          jobDetails = await payload.findByID({
            collection: 'jobs',
            id: jobId,
          })
        } catch (e) {
          console.error('Failed to fetch job details:', e)
        }
      }

      // Import email functions
      const { sendJobNotificationEmail, sendGeneralNotificationEmail } = await import('@/lib/email')

      await Promise.allSettled(
        targetUsers.map(async (targetUser) => {
          try {
            if (type === 'new_job' && jobDetails) {
              await sendJobNotificationEmail(
                targetUser.email,
                targetUser.fullName || targetUser.email,
                {
                  title: jobDetails.title,
                  company: jobDetails.company,
                  location: jobDetails.location,
                  jobType: jobDetails.jobType,
                  slug: jobDetails.slug,
                  salaryMin: jobDetails.salaryMin,
                  salaryMax: jobDetails.salaryMax,
                },
              )
            } else {
              await sendGeneralNotificationEmail(
                targetUser.email,
                targetUser.fullName || targetUser.email,
                title,
                message,
              )
            }
          } catch (emailError) {
            console.error('Email failed for:', targetUser.email, emailError)
          }
        }),
      )
    }

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${successCount} users`,
      notificationId: notificationDoc.id,
      totalRecipients: successCount,
      emailSent: sendEmail || false,
    })
  } catch (error: any) {
    console.error('Send notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send notification' },
      { status: 500 },
    )
  }
}
