import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import SavedJobsClient from '@/components/Dashboard/SavedJobsPanel'

async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return null
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `payload-token=${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export default async function SavedJobsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <SavedJobsClient />
}