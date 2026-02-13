export interface NotificationType {
  id: string
  title: string
  message: string
  type: 'new_job' | 'subscription_expiry' | 'subscription_expired' | 'general' | 'job_alert'
  job?: {
    id: string
    title: string
    company: string
    slug: string
    location: string
    jobType: string
  } | null
  recipient: 'all' | 'subscribed' | 'selected'
  selectedUsers?: { email: string }[]
  sentAt: string
  totalRecipients: number
  emailAlsoSent: boolean
}

export interface UserNotificationType {
  id: string
  user: string
  notification: NotificationType
  isRead: boolean
  readAt?: string
  createdAt: string
}

export interface SendNotificationRequest {
  jobId?: string
  title: string
  message: string
  type: 'new_job' | 'subscription_expiry' | 'general' | 'job_alert'
  recipient: 'all' | 'subscribed' | 'selected'
  selectedEmails?: string[]
  sendEmail: boolean
}

export interface SendNotificationResponse {
  success: boolean
  message: string
  notificationId?: string
  totalRecipients?: number
  emailSent?: boolean
  error?: string
}
