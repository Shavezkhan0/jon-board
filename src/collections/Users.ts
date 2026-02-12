import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['fullName', 'email', 'subscriptionStatus', 'subscriptionExpiry'],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'User\'s full name',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: '10-digit Indian phone number without country code',
      },
      validate: (value) => {
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
        description: 'URL to user\'s resume',
      },
      validate: (value) => {
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
      validate: (value) => {
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
