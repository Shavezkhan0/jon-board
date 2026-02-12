import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
        return `
          <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #6366f1; font-size: 32px; margin: 0; font-weight: bold;">JobBoard Pro</h1>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1f2937; font-size: 24px; margin: 0;">Verify Your Email Address</h2>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                Hi ${user.fullName || user.email},
              </p>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                Thank you for creating an account with JobBoard Pro. To get started, please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background-color: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: 600;">
                  Verify Email Address
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">This link expires in 24 hours</p>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
                <p style="color: #9ca3af; font-size: 14px;">
                  If you did not create this account, you can safely ignore this email.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">© 2024 JobBoard Pro. All rights reserved.</p>
              </div>
            </div>
          </div>
        `
      },
      generateEmailSubject: () => 'Verify your JobBoard Pro email ✅',
    },
    tokenExpiration: 86400,
    maxLoginAttempts: 5,
    lockTime: 600,
    useAPIKey: false,
    depth: 0,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['fullName', 'email', 'subscriptionStatus', 'subscriptionExpiry'],
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true,
      admin: {
        description: 'User roles',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: "User's full name",
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: '10-digit Indian phone number without country code',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        const phoneRegex = /^[6-9]\d{9}$/
        return phoneRegex.test(value) || 'Please enter a valid 10-digit Indian phone number'
      },
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'User profile photo',
      },
    },
    {
      name: 'resumeUrl',
      type: 'text',
      admin: {
        description: "URL to user's resume",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          new URL(value)
          return true
        } catch {
          return 'Please enter a valid URL'
        }
      },
    },
    {
      name: 'skills',
      type: 'array',
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'List of user skills',
      },
    },
    {
      name: 'currentJobTitle',
      type: 'text',
      admin: {
        description: 'Current job title',
      },
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      admin: {
        description: 'LinkedIn profile URL',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          new URL(value)
          return true
        } catch {
          return 'Please enter a valid URL'
        }
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Brief bio (max 300 characters)',
      },
    },
    {
      name: 'subscriptionStatus',
      type: 'select',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Expired',
          value: 'expired',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Current subscription status',
      },
    },
    {
      name: 'subscriptionExpiry',
      type: 'date',
      admin: {
        description: 'Subscription expiry date',
      },
    },
    {
      name: 'subscriptionPlan',
      type: 'select',
      options: [
        {
          label: 'Monthly',
          value: 'monthly',
        },
        {
          label: 'Quarterly',
          value: 'quarterly',
        },
        {
          label: 'Yearly',
          value: 'yearly',
        },
      ],
      admin: {
        description: 'Current subscription plan',
      },
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'totalPaid',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total amount paid by user (in paise)',
      },
      access: {
        update: ({ req: { user } }) => {
          return user?.roles?.includes('admin') || false
        },
        read: ({ req: { user } }) => {
          return user?.roles?.includes('admin') || false
        },
      },
    },
  ],
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      return user?.roles?.includes('admin') || false
    },
  },
}
