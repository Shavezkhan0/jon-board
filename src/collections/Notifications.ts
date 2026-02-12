import type { CollectionConfig } from 'payload'

const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'recipient', 'totalRecipients', 'sentAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'New Job Posted', value: 'new_job' },
        { label: 'Subscription Expiring', value: 'subscription_expiry' },
        { label: 'Subscription Expired', value: 'subscription_expired' },
        { label: 'General Announcement', value: 'general' },
        { label: 'Job Alert', value: 'job_alert' },
      ],
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: false,
    },
    {
      name: 'recipient',
      type: 'select',
      required: true,
      options: [
        { label: 'All Users', value: 'all' },
        { label: 'Subscribed Users Only', value: 'subscribed' },
        { label: 'Selected Users', value: 'selected' },
      ],
    },
    {
      name: 'selectedUsers',
      type: 'array',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
      ],
      admin: {
        condition: (data) => data.recipient === 'selected',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'totalRecipients',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'emailAlsoSent',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  access: {
    read: ({ req }) => req.user?.roles?.includes('admin') || false,
    create: ({ req }) => req.user?.roles?.includes('admin') || false,
    update: ({ req }) => req.user?.roles?.includes('admin') || false,
    delete: ({ req }) => req.user?.roles?.includes('admin') || false,
  },
}

export default Notifications
