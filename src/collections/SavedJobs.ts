import type { CollectionConfig } from 'payload'

export const SavedJobs: CollectionConfig = {
  slug: 'saved-jobs',
  admin: {
    useAsTitle: 'job',
    defaultColumns: ['user', 'job', 'savedAt'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who saved this job',
      },
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
      admin: {
        description: 'Job that was saved',
      },
    },
    {
      name: 'savedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
        description: 'Date when job was saved',
      },
    },
  ],
  access: {
    create: ({ req: { user } }) => {
      // Users can only create saved jobs for themselves
      return !!user
    },
    read: ({ req: { user } }) => {
      if ((user as any)?.roles?.includes('admin')) return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      return (user as any)?.roles?.includes('admin') || false
    },
    delete: ({ req: { user } }) => {
      if ((user as any)?.roles?.includes('admin')) return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const existing = await req.payload.find({
            collection: 'saved-jobs',
            where: {
              and: [
                {
                  user: {
                    equals: data.user,
                  },
                },
                {
                  job: {
                    equals: data.job,
                  },
                },
              ],
            },
            limit: 1,
          })

          if (existing.docs.length > 0) {
            throw new Error('Job already saved by this user')
          }
        }
        return data
      },
    ],
  },
}
