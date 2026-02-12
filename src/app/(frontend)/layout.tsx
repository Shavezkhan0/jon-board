import React from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import Navbar from '@/components/Navbar'
import '../globals.css'

export const metadata = {
  description: 'Find your dream job with JobBoard Pro - The best job board for professionals',
  title: 'JobBoard Pro - Find Your Dream Job',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
