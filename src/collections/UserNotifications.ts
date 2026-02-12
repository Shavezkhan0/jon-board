import type { CollectionConfig } from 'payload'

const UserNotifications: CollectionConfig = {
  slug: 'user-notifications',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'notification', 'isRead', 'createdAt'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
      required: true,
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'readAt',
      type: 'date',
      required: false,
    },
  ],
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return {
        user: { equals: req.user.id },
      }
    },
    create: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      return {
        user: { equals: req.user.id },
      }
    },
    delete: ({ req }) => req.user?.roles?.includes('admin') || false,
  },
  timestamps: true,
}

export default UserNotifications
