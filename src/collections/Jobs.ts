import type { CollectionConfig } from 'payload'
import { sendJobNotification } from '@/lib/notifications/sendJobNotification'

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
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'Job location (e.g. "Mumbai, Maharashtra")',
      },
    },
    {
      name: 'workMode',
      type: 'select',
      options: [
        {
          label: '🏢 Office',
          value: 'office',
        },
        {
          label: '🏠 Remote',
          value: 'remote',
        },
        {
          label: '🔄 Hybrid',
          value: 'hybrid',
        },
        {
          label: '✨ Flexible',
          value: 'flexible',
        },
      ],
      required: true,
      defaultValue: 'office',
      admin: {
        description: 'Work location type',
      },
    },
    {
      name: 'officeAddress',
      type: 'textarea',
      admin: {
        description: 'Office address for walk-in/interviews (shown only for Office/Hybrid modes)',
        condition: (data: any) => {
          return data.workMode === 'office' || data.workMode === 'hybrid'
        },
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
      name: 'experienceYearsMin',
      type: 'number',
      min: 0,
      max: 50,
      admin: {
        description: 'Minimum years of experience required',
      },
    },
    {
      name: 'experienceYearsMax',
      type: 'number',
      min: 0,
      max: 50,
      admin: {
        description: 'Maximum years of experience required',
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
        description: 'Job requirements and qualifications',
      },
    },
    {
      name: 'message',
      type: 'richText',
      admin: {
        description:
          'Optional message/note for applicants (e.g., interview process, timeline, special instructions)',
      },
    },
    {
      name: 'responsibilities',
      type: 'richText',
      required: true,
      admin: {
        description: 'Key job responsibilities and day-to-day tasks',
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
      required: false,
      admin: {
        description: 'Application link (optional if HR contact provided)',
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
      name: 'applyEmail',
      type: 'text',
      admin: {
        description: 'Application email (optional)',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) || 'Please enter a valid email address'
      },
    },
    {
      name: 'acceptsReferrals',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Does this job accept employee referrals?',
      },
    },
    {
      name: 'hrContactName',
      type: 'text',
      admin: {
        description: 'HR contact person name (optional)',
      },
    },
    {
      name: 'hrEmail',
      type: 'text',
      admin: {
        description: 'HR contact email (optional)',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) || 'Please enter a valid email address'
      },
    },
    {
      name: 'hrPhone',
      type: 'text',
      admin: {
        description: 'HR contact phone number (optional)',
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
      required: false,
      admin: {
        description: 'Job expiry date (optional - leave empty for no expiry)',
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
    {
      name: 'notificationSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Has notification been sent for this job?',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'notificationSentAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'notificationSentTo',
      type: 'select',
      options: [
        { label: 'All Users', value: 'all' },
        { label: 'Subscribed Only', value: 'subscribed' },
        { label: 'Selected Users', value: 'selected' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: any) => {
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
    afterChange: [
      async ({ doc, operation, req, previousDoc }: any) => {
        try {
          // Check if this is a new job being created with isActive = true
          const isNewActiveJob = operation === 'create' && doc.isActive

          // Check if an existing job was just activated (previousDoc.isActive was false, now true)
          const wasJustActivated =
            operation === 'update' && doc.isActive && previousDoc && !previousDoc.isActive

          // Send notification if it's a new active job or was just activated, and notification hasn't been sent yet
          if ((isNewActiveJob || wasJustActivated) && !doc.notificationSent) {
            console.log(`Triggering notification for job: ${doc.title} (ID: ${doc.id})`)
            // Run notification in background to avoid blocking the save operation
            setImmediate(async () => {
              try {
                await sendJobNotification(doc, req.payload)
                console.log(`Notification sent successfully for job: ${doc.title}`)
              } catch (error) {
                console.error(`Failed to send notification for job ${doc.title}:`, error)
              }
            })
          }
        } catch (error) {
          console.error('Error in afterChange hook:', error)
          // Don't throw error to prevent blocking save operation
        }

        return doc
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      return {
        isActive: {
          equals: true,
        },
        expiresAt: {
          greater_than: new Date(),
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
