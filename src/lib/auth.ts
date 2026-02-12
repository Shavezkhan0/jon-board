import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import jwt from 'jsonwebtoken'

export async function getCurrentUser() {
  const payload = await getPayload({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return null
  }

  try {
    // Decode token without verification
    const decoded = jwt.decode(token) as any
    const userId = decoded?.id || decoded?.sub

    if (!userId) {
      return null
    }

    // Fetch user from database
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 0,
    })

    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export function isSubscriptionActive(user: any): boolean {
  if (!user) return false

  return user.subscriptionStatus === 'active' && new Date(user.subscriptionExpiry) > new Date()
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = (await cookies()).get('payload-token')?.value

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `JWT ${token}`
  }

  return headers
}

export async function getPayloadClient() {
  const payload = await getPayload({ config })
  return payload
}
