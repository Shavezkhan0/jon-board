'use client'

import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import ProfileClient from '@/components/Dashboard/ProfilePanel'
import type { User } from '@/types'

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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then((userData) => {
      if (!userData) {
        redirect('/login')
      }
      setUser(userData)
      setIsLoading(false)
    })
  }, [])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <ProfileClient user={user} setUser={setUser} />
}
