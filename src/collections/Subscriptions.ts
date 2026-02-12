import type { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'userEmail',
    defaultColumns: ['userEmail', 'plan', 'status', 'amount', 'startedAt', 'expiresAt'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who owns this subscription',
      },
    },
    {
      name: 'userEmail',
      type: 'text',
      required: true,
      admin: {
        description: 'User email for reference',
      },
    },
    {
      name: 'plan',
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
      required: true,
      admin: {
        description: 'Subscription plan',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'pending',
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
      defaultValue: 'pending',
      admin: {
        description: 'Subscription status',
      },
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      required: true,
      admin: {
        description: 'Razorpay order ID',
      },
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      admin: {
        description: 'Razorpay payment ID (populated after successful payment)',
      },
    },
    {
      name: 'razorpaySignature',
      type: 'text',
      admin: {
        description: 'Razorpay signature for webhook verification',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: {
        description: 'Amount paid (in paise)',
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'INR',
      admin: {
        description: 'Currency code',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        description: 'Subscription start date',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        description: 'Subscription expiry date',
      },
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Payment verified via webhook',
      },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
    create: ({ req: { user } }) => {
      return user?.roles?.includes('admin') || false
    },
    update: ({ req: { user } }) => {
      return user?.roles?.includes('admin') || false
    },
    delete: ({ req: { user } }) => {
      return user?.roles?.includes('admin') || false
    },
  },
}