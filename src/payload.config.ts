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

const getServerUrl = () => {
  const url = process.env.NEXT_PUBLIC_APP_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set')
  }
  return url
}

const getCorsOrigins = (): string[] => {
  const serverUrl = getServerUrl()
  const origins: string[] = [serverUrl]

  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3000', 'http://localhost:3001')
  } else {
    origins.push('*')
  }

  return origins
}

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- JobBoard Pro',
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
    connectOptions: {
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  }),
  serverURL: getServerUrl(),
  cors: getCorsOrigins(),
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
