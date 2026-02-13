import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'JobBoard Pro <noreply@jobboardpro.com>'

interface EmailOptions {
  to: string[]
  subject: string
  html: string
}

async function sendEmail(options: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      console.error('Email send error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}

function createEmailTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JobBoard Pro</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          padding: 30px 20px;
          text-align: center;
        }
        .logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .button {
          display: inline-block;
          background: #4f46e5;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          transition: background-color 0.2s;
        }
        .button:hover {
          background: #4338ca;
        }
        .button-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        .button-secondary:hover {
          background: #e5e7eb;
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        .social-link {
          color: #6b7280;
          text-decoration: none;
          font-size: 20px;
        }
        .social-link:hover {
          color: #4f46e5;
        }
        .text-center {
          text-align: center;
        }
        .mb-4 {
          margin-bottom: 24px;
        }
        .mb-3 {
          margin-bottom: 18px;
        }
        .mb-2 {
          margin-bottom: 12px;
        }
        .text-gray-600 {
          color: #6b7280;
        }
        .text-xl {
          font-size: 20px;
        }
        .text-lg {
          font-size: 18px;
        }
        .success-icon {
          width: 60px;
          height: 60px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 30px;
        }
        .warning-icon {
          width: 60px;
          height: 60px;
          background: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 30px;
        }
        .expired-icon {
          width: 60px;
          height: 60px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 30px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }
        .feature-list li {
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
        }
        .feature-list li:before {
          content: "✓";
          color: #10b981;
          font-weight: bold;
          margin-right: 10px;
        }
        @media only screen and (max-width: 480px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 30px 20px;
          }
          .button {
            display: block;
            width: 100%;
          }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `
}

export async function sendWelcomeEmail(email: string, fullName: string) {
  const html = createEmailTemplate(`
    <div class="container">
      <div class="header">
        <div class="logo">
          <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
          </svg>
          JobBoard Pro
        </div>
        <h1 style="color: white; margin: 0;">Welcome to JobBoard Pro! 🎉</h1>
      </div>
      
      <div class="content">
        <h2 class="text-xl mb-4">Hi ${fullName}!</h2>
        
        <p class="mb-4">
          Thank you for joining JobBoard Pro! We're excited to help you find your dream job in India's growing job market.
        </p>
        
        <p class="mb-4">
          With JobBoard Pro, you get access to:
        </p>
        
        <ul class="feature-list">
          <li>Exclusive job listings from top companies</li>
          <li>Advanced search and filtering options</li>
          <li>Job application tracking</li>
          <li>Career resources and interview tips</li>
          <li>Priority support from our team</li>
        </ul>
        
        <div class="text-center mb-4">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" class="button">
            Browse Jobs
          </a>
        </div>
        
        <div class="text-center">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard?tab=profile" class="button button-secondary">
            Complete Your Profile
          </a>
        </div>
        
        <p class="text-gray-600 mb-3">
          Having questions? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #4f46e5;">Help Center</a> or reply to this email.
        </p>
        
        <p class="text-gray-600">
          Happy job hunting!<br>
          The JobBoard Pro Team
        </p>
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href="#" class="social-link">LinkedIn</a>
          <a href="#" class="social-link">Twitter</a>
          <a href="#" class="social-link">Instagram</a>
        </div>
        <p class="text-gray-600 text-sm mb-2">
          Made with ❤️ in India
        </p>
        <p class="text-gray-600 text-sm">
          You received this email because you signed up for JobBoard Pro.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `)

  return sendEmail({
    to: [email],
    subject: 'Welcome to JobBoard Pro! 🎉',
    html,
  })
}

export async function sendSubscriptionConfirmation(
  email: string,
  fullName: string,
  plan: string,
  expiresAt: string,
) {
  const planPrices: Record<string, string> = {
    monthly: '₹1/month',
    quarterly: '₹1,299/quarter',
    yearly: '₹2,999/year',
  }

  const formattedDate = new Date(expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const html = createEmailTemplate(`
    <div class="container">
      <div class="header">
        <div class="logo">
          <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
          </svg>
          JobBoard Pro
        </div>
        <h1 style="color: white; margin: 0;">Subscription Activated ✅</h1>
      </div>
      
      <div class="content">
        <div class="success-icon">✓</div>
        
        <h2 class="text-xl text-center mb-4">Hi ${fullName}!</h2>
        
        <p class="text-center mb-4 text-lg">
          Congratulations! Your subscription has been successfully activated.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937;">Subscription Details</h3>
          <p style="margin: 5px 0; color: #6b7280;">
            <strong>Plan:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)}
          </p>
          <p style="margin: 5px 0; color: #6b7280;">
            <strong>Price:</strong> ${planPrices[plan] || 'Custom'}
          </p>
          <p style="margin: 5px 0; color: #6b7280;">
            <strong>Activated:</strong> ${new Date().toLocaleDateString()}
          </p>
          <p style="margin: 5px 0; color: #6b7280;">
            <strong>Expires:</strong> ${formattedDate}
          </p>
        </div>
        
        <h4 style="margin: 20px 0 10px 0; color: #1f2937;">What's Included:</h4>
        <ul class="feature-list">
          <li>Unlimited job applications</li>
          <li>Priority job alerts</li>
          <li>Resume building tools</li>
          <li>Interview preparation resources</li>
          <li>Direct messaging with recruiters</li>
          <li>Priority customer support</li>
        </ul>
        
        <div class="text-center mb-4">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" class="button">
            Start Browsing Jobs
          </a>
        </div>
        
        <p class="text-gray-600">
          Need help? Reply to this email and our team will assist you.<br>
          The JobBoard Pro Team
        </p>
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href="#" class="social-link">LinkedIn</a>
          <a href="#" class="social-link">Twitter</a>
          <a href="#" class="social-link">Instagram</a>
        </div>
        <p class="text-gray-600 text-sm mb-2">
          Made with ❤️ in India
        </p>
        <p class="text-gray-600 text-sm">
          You received this email because you have an active subscription.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `)

  return sendEmail({
    to: [email],
    subject: 'Subscription Activated ✅ - JobBoard Pro',
    html,
  })
}

export async function sendSubscriptionExpiryReminder(
  email: string,
  fullName: string,
  daysLeft: number,
  plan: string,
) {
  const planPrices: Record<string, string> = {
    monthly: '₹1/month',
    quarterly: '₹1,299/quarter',
    yearly: '₹2,999/year',
  }

  const html = createEmailTemplate(`
    <div class="container">
      <div class="header">
        <div class="logo">
          <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
          </svg>
          JobBoard Pro
        </div>
        <h1 style="color: white; margin: 0;">Subscription Expiring Soon ⏰</h1>
      </div>
      
      <div class="content">
        <div class="warning-icon">⏰</div>
        
        <h2 class="text-xl text-center mb-4">Hi ${fullName}!</h2>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">Your subscription expires in</h3>
          <div style="font-size: 36px; font-weight: bold; color: #dc2626; margin: 10px 0;">${daysLeft} days</div>
        </div>
        
        <p class="mb-4">
          Don't lose access to exclusive job listings and premium features! Renew your subscription to continue enjoying all benefits.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 15px 0; color: #1f2937;">Available Plans:</h4>
          <div style="display: grid; gap: 15px;">
            <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px;">
              <strong>Starter:</strong> ₹1/month<br>
              <small style="color: #6b7280;">50+ job listings, Basic features</small>
            </div>
            <div style="border: 1px solid #4f46e5; padding: 15px; border-radius: 6px; background: #f0f9ff;">
              <strong style="color: #4f46e5;">Professional:</strong> ₹1,299/quarter<br>
              <small style="color: #6b7280;">200+ job listings, All features</small>
            </div>
            <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px;">
              <strong>Enterprise:</strong> ₹2,999/year<br>
              <small style="color: #6b7280;">Unlimited access, Premium support</small>
            </div>
          </div>
        </div>
        
        <div class="text-center mb-4">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe" class="button">
            Renew Now
          </a>
        </div>
        
        <p class="text-gray-600">
          Questions about your subscription? We're here to help!<br>
          The JobBoard Pro Team
        </p>
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href="#" class="social-link">LinkedIn</a>
          <a href="#" class="social-link">Twitter</a>
          <a href="#" class="social-link">Instagram</a>
        </div>
        <p class="text-gray-600 text-sm mb-2">
          Made with ❤️ in India
        </p>
        <p class="text-gray-600 text-sm">
          You received this email because your subscription is expiring soon.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `)

  return sendEmail({
    to: [email],
    subject: `Your JobBoard Pro subscription expires in ${daysLeft} days ⏰`,
    html,
  })
}

export async function sendSubscriptionExpired(email: string, fullName: string) {
  const html = createEmailTemplate(`
    <div class="container">
      <div class="header">
        <div class="logo">
          <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
          </svg>
          JobBoard Pro
        </div>
        <h1 style="color: white; margin: 0;">Subscription Expired</h1>
      </div>
      
      <div class="content">
        <div class="expired-icon">!</div>
        
        <h2 class="text-xl text-center mb-4">Hi ${fullName}!</h2>
        
        <p class="mb-4">
          Your JobBoard Pro subscription has expired. To continue accessing exclusive job listings and premium features, you'll need to renew your subscription.
        </p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="margin: 0 0 10px 0; color: #991b1b;">What happens now?</h3>
          <ul style="color: #7f1d1d; padding-left: 20px;">
            <li>Limited access to job listings</li>
            <li>No more priority applications</li>
            <li>Limited search and filtering</li>
            <li>Basic profile visibility only</li>
          </ul>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">🎉 Special Offer - Come Back!</h3>
          <p style="color: #065f46; margin: 0 0 15px 0;">
            Reactivate your subscription within 7 days and get <strong>20% off</strong> any plan!
          </p>
          <p style="color: #065f46; margin: 0;">
            Use code: <strong style="background: #d1fae5; padding: 2px 8px; border-radius: 4px;">COMEBACK20</strong>
          </p>
        </div>
        
        <div class="text-center mb-4">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe?offer=comeback20" class="button">
            Reactivate Subscription
          </a>
        </div>
        
        <p class="text-gray-600">
          We'd love to have you back! If you have any questions or need assistance, please don't hesitate to reach out.<br>
          The JobBoard Pro Team
        </p>
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href="#" class="social-link">LinkedIn</a>
          <a href="#" class="social-link">Twitter</a>
          <a href="#" class="social-link">Instagram</a>
        </div>
        <p class="text-gray-600 text-sm mb-2">
          Made with ❤️ in India
        </p>
        <p class="text-gray-600 text-sm">
          You received this email because your subscription has expired.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `)

  return sendEmail({
    to: [email],
    subject: 'Your JobBoard Pro subscription has expired',
    html,
  })
}

interface JobNotificationData {
  title: string
  company: string
  location: string
  jobType: string
  slug: string
  salaryMin?: number
  salaryMax?: number
}

export async function sendJobNotificationEmail(
  email: string,
  fullName: string,
  job: JobNotificationData,
) {
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}`
      : 'Competitive'

  const html = createEmailTemplate(`
    <div class="container">
      <div class="header">
        <div class="logo">
          <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
          </svg>
          JobBoard Pro
        </div>
        <h1 style="color: white; margin: 0;">New Job Alert! 💼</h1>
      </div>
      
      <div class="content">
        <h2 class="text-xl mb-4">Hi ${fullName}!</h2>
        
        <p class="mb-4">
          A new job opportunity matching your profile has been posted!
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">${job.title}</h3>
          
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
            <span style="background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
              ${job.company}
            </span>
            <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
              ${job.location}
            </span>
            <span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
              ${job.jobType}
            </span>
          </div>
          
          <p style="color: #64748b; margin: 0; font-size: 14px;">
            <strong>Salary:</strong> ${salaryRange}
          </p>
        </div>
        
        <div class="text-center mb-4">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.slug}" class="button">
            View Job Details
          </a>
        </div>
        
        <p class="text-gray-600">
          Don't miss out on this opportunity! Apply now to increase your chances of getting hired.<br>
          The JobBoard Pro Team
        </p>
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href="#" class="social-link">LinkedIn</a>
          <a href="#" class="social-link">Twitter</a>
          <a href="#" class="social-link">Instagram</a>
        </div>
        <p class="text-gray-600 text-sm mb-2">
          Made with ❤️ in India
        </p>
        <p class="text-gray-600 text-sm">
          You received this email because you subscribed to job alerts.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `)

  return sendEmail({
    to: [email],
    subject: `New Job: ${job.title} at ${job.company}`,
    html,
  })
}

export async function sendGeneralNotificationEmail(
  email: string,
  fullName: string,
  title: string,
  message: string,
) {
  const html = createEmailTemplate(`
    <div class="container">
      <div class="header">
        <div class="logo">
          <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
          </svg>
          JobBoard Pro
        </div>
        <h1 style="color: white; margin: 0;">${title}</h1>
      </div>
      
      <div class="content">
        <h2 class="text-xl mb-4">Hi ${fullName}!</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #334155; line-height: 1.6;">${message}</p>
        </div>
        
        <p class="text-gray-600">
          Thank you for being a part of JobBoard Pro!<br>
          The JobBoard Pro Team
        </p>
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href="#" class="social-link">LinkedIn</a>
          <a href="#" class="social-link">Twitter</a>
          <a href="#" class="social-link">Instagram</a>
        </div>
        <p class="text-gray-600 text-sm mb-2">
          Made with ❤️ in India
        </p>
        <p class="text-gray-600 text-sm">
          You received this notification from JobBoard Pro.<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `)

  return sendEmail({
    to: [email],
    subject: title,
    html,
  })
}
