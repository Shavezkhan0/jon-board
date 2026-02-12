import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'location', 'jobType', 'isActive'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 5,
      maxLength: 100,
      admin: {
        description: 'Job title (5-100 characters)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        description: 'Auto-generated from title',
      },
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      admin: {
        description: 'Company name',
      },
    },
    {
      name: 'companyLogo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Company logo',
      },
    },
    {
      name: 'companyWebsite',
      type: 'text',
      admin: {
        description: 'Company website URL',
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
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'Job location (e.g. "Mumbai, Maharashtra")',
      },
    },
    {
      name: 'isRemote',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this a remote position?',
      },
    },
    {
      name: 'jobType',
      type: 'select',
      options: [
        {
          label: 'Full Time',
          value: 'full-time',
        },
        {
          label: 'Part Time',
          value: 'part-time',
        },
        {
          label: 'Remote',
          value: 'remote',
        },
        {
          label: 'Freelance',
          value: 'freelance',
        },
        {
          label: 'Internship',
          value: 'internship',
        },
        {
          label: 'Contract',
          value: 'contract',
        },
      ],
      required: true,
      admin: {
        description: 'Type of employment',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Technology',
          value: 'technology',
        },
        {
          label: 'Marketing',
          value: 'marketing',
        },
        {
          label: 'Design',
          value: 'design',
        },
        {
          label: 'Finance',
          value: 'finance',
        },
        {
          label: 'Sales',
          value: 'sales',
        },
        {
          label: 'Healthcare',
          value: 'healthcare',
        },
        {
          label: 'Education',
          value: 'education',
        },
        {
          label: 'Legal',
          value: 'legal',
        },
        {
          label: 'Operations',
          value: 'operations',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      required: true,
      admin: {
        description: 'Job category',
      },
    },
    {
      name: 'experienceLevel',
      type: 'select',
      options: [
        {
          label: 'Fresher',
          value: 'fresher',
        },
        {
          label: 'Junior',
          value: 'junior',
        },
        {
          label: 'Mid-Level',
          value: 'mid-level',
        },
        {
          label: 'Senior',
          value: 'senior',
        },
        {
          label: 'Lead',
          value: 'lead',
        },
        {
          label: 'Manager',
          value: 'manager',
        },
      ],
      required: true,
      admin: {
        description: 'Required experience level',
      },
    },
    {
      name: 'salaryMin',
      type: 'number',
      admin: {
        description: 'Minimum salary (optional)',
      },
    },
    {
      name: 'salaryMax',
      type: 'number',
      admin: {
        description: 'Maximum salary (optional)',
      },
    },
    {
      name: 'salaryCurrency',
      type: 'select',
      options: [
        {
          label: 'INR',
          value: 'INR',
        },
        {
          label: 'USD',
          value: 'USD',
        },
      ],
      defaultValue: 'INR',
      admin: {
        description: 'Salary currency',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Job description',
      },
    },
    {
      name: 'requirements',
      type: 'richText',
      required: true,
      admin: {
        description: 'Job requirements',
      },
    },
    {
      name: 'niceToHave',
      type: 'richText',
      admin: {
        description: 'Nice to have skills/qualifications (optional)',
      },
    },
    {
      name: 'applyLink',
      type: 'text',
      required: true,
      admin: {
        description: 'Application link or email',
      },
      validate: (value) => {
        if (!value) return 'Application link is required'
        try {
          new URL(value)
          return true
        } catch {
          return 'Please enter a valid URL'
        }
      },
    },
    {
      name: 'applyEmail',
      type: 'text',
      admin: {
        description: 'Application email (optional)',
      },
      validate: (value) => {
        if (!value) return true
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) || 'Please enter a valid email address'
      },
    },
    {
      name: 'skills',
      type: 'array',
      maxRows: 15,
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Required skills (max 15)',
      },
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        {
          name: 'benefit',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Job benefits',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this job active?',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this job?',
      },
    },
    {
      name: 'isUrgent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as urgent?',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of views',
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
    {
      name: 'applicationCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of applications',
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
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        description: 'Job expiry date',
      },
    },
    {
      name: 'postedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
        description: 'Date when job was posted',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data.title && !data.slug) {
            data.slug = data.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim()
          }
        }
        return data
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return {
        and: [
          {
            isActive: {
              equals: true,
            },
          },
          {
            expiresAt: {
              greater_than: new Date(),
            },
          },
        ],
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