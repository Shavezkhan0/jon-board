import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Jobs } from './collections/Jobs'
import { Subscriptions } from './collections/Subscriptions'
import { SavedJobs } from './collections/SavedJobs'
import Notifications from './collections/Notifications'
import UserNotifications from './collections/UserNotifications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Jobs, Subscriptions, SavedJobs, Notifications, UserNotifications],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  serverURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  cors: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', 'http://localhost:3000'],
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    defaultFromName: process.env.EMAIL_FROM_NAME || 'JobBoard Pro',
    transport: nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    }),
  }),
  sharp,
  plugins: [],
})
