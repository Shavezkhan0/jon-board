import type { Payload } from 'payload'
import type { Job } from '@/types'

export async function sendJobNotification(job: any, payload: Payload) {
  try {
    // Get all users with active subscriptions
    const subscribedUsers = await payload.find({
      collection: 'users',
      where: {
        subscriptionStatus: {
          equals: 'active',
        },
      },
      limit: 1000, // Adjust based on your needs
    })

    if (subscribedUsers.docs.length === 0) {
      console.log('No subscribed users found for job notification')
      return
    }

    console.log(`Sending job notification to ${subscribedUsers.docs.length} subscribed users`)

    // Prepare email data
    const emailPromises = subscribedUsers.docs.map(async (user) => {
      try {
        await payload.sendEmail({
          to: user.email,
          subject: `🎯 New Job Alert: ${job.title} at ${job.company}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎯 New Job Posted!</h1>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 30px;">
                          <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px;">${job.title}</h2>
                          <p style="color: #666; margin: 0 0 20px 0; font-size: 18px;">${job.company}</p>
                          
                          <table width="100%" cellpadding="8" cellspacing="0" style="margin: 20px 0;">
                            <tr>
                              <td style="padding: 8px; background-color: #f8f9fa; border-radius: 4px;">
                                <strong>📍 Location:</strong> ${job.location}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px; background-color: #f8f9fa; border-radius: 4px;">
                                <strong>💼 Job Type:</strong> ${job.jobType?.replace('-', ' ').toUpperCase()}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px; background-color: #f8f9fa; border-radius: 4px;">
                                <strong>🏢 Work Mode:</strong> ${job.workMode?.charAt(0).toUpperCase() + job.workMode?.slice(1)}
                              </td>
                            </tr>
                            ${
                              job.experienceYearsMin || job.experienceYearsMax
                                ? `
                            <tr>
                              <td style="padding: 8px; background-color: #f8f9fa; border-radius: 4px;">
                                <strong>📊 Experience:</strong> ${job.experienceYearsMin || 0}-${job.experienceYearsMax || '+'} years
                              </td>
                            </tr>
                            `
                                : ''
                            }
                            ${
                              job.salaryMin && job.salaryMax
                                ? `
                            <tr>
                              <td style="padding: 8px; background-color: #f8f9fa; border-radius: 4px;">
                                <strong>💰 Salary:</strong> ${job.salaryCurrency || 'INR'} ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                              </td>
                            </tr>
                            `
                                : ''
                            }
                          </table>
                          
                          <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/${job.slug}" 
                               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                              View Job Details
                            </a>
                          </div>
                          
                          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
                            You're receiving this email because you have an active subscription to JobBoard Pro.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                          <p style="color: #666; font-size: 14px; margin: 0;">
                            © ${new Date().getFullYear()} JobBoard Pro. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        })
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError)
      }
    })

    // Send all emails
    await Promise.allSettled(emailPromises)

    // Update job notification tracking
    await payload.update({
      collection: 'jobs',
      id: job.id,
      data: {
        notificationSent: true,
        notificationSentAt: new Date().toISOString(),
        notificationSentTo: 'subscribed',
      },
    })

    console.log(`Job notification completed for: ${job.title}`)
  } catch (error) {
    console.error('Error sending job notification:', error)
    throw error
  }
}
