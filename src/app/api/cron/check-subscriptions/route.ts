import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { 
  sendSubscriptionExpired, 
  sendSubscriptionExpiryReminder 
} from '@/lib/email'

// Verify CRON_SECRET from Authorization header
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('CRON_SECRET not configured')
    return false
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Invalid authorization header')
    return false
  }

  const token = authHeader.substring(7)
  return token === cronSecret
}

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting subscription check cron job')
    
    const payload = await getPayload({ config })
    let expiredCount = 0
    let remindedCount = 0

    // Find expired subscriptions
    const expiredUsers = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            subscriptionStatus: {
              equals: 'active'
            }
          },
          {
            subscriptionExpiry: {
              less_than: new Date()
            }
          }
        ]
      },
      overrideAccess: false, // Enforce access control
    })

    console.log(`Found ${expiredUsers.totalDocs} expired subscriptions`)

    // Update expired users and send emails
    if (expiredUsers.docs.length > 0) {
      for (const user of expiredUsers.docs) {
        try {
          // Update user status to expired
          await payload.update({
            collection: 'users',
            id: user.id,
            data: {
              subscriptionStatus: 'expired'
            },
            overrideAccess: false,
          })

          // Send expired email
          await sendSubscriptionExpired(user.email, user.fullName)
          
          expiredCount++
          console.log(`Processed expired user: ${user.email}`)
        } catch (error) {
          console.error(`Error processing expired user ${user.id}:`, error)
        }
      }
    }

    // Find subscriptions expiring in the next 3 days
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    const expiringUsers = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            subscriptionStatus: {
              equals: 'active'
            }
          },
          {
            subscriptionExpiry: {
              greater_than_equal: new Date(),
              less_than: threeDaysFromNow
            }
          }
        ]
      },
      overrideAccess: false,
    })

    console.log(`Found ${expiringUsers.totalDocs} subscriptions expiring in 3 days`)

    // Send expiry reminder emails
    if (expiringUsers.docs.length > 0) {
      for (const user of expiringUsers.docs) {
        try {
          const expiryDate = new Date(user.subscriptionExpiry as string)
          const today = new Date()
          const daysLeft = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          )

          // Send reminder email
          await sendSubscriptionExpiryReminder(
            user.email, 
            user.fullName, 
            daysLeft,
            user.subscriptionPlan || 'monthly'
          )
          
          remindedCount++
          console.log(`Sent reminder to user: ${user.email} (${daysLeft} days left)`)
        } catch (error) {
          console.error(`Error sending reminder to user ${user.id}:`, error)
        }
      }
    }

    console.log(`Cron job completed: ${expiredCount} expired, ${remindedCount} reminded`)

    return NextResponse.json({
      success: true,
      expired: expiredCount,
      reminded: remindedCount,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}