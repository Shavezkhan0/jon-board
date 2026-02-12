import { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import NavbarClient from './NavbarClient'
import '../globals.css'

export const metadata = {
  description: 'Find your dream job with JobBoard Pro - The best job board for professionals',
  title: 'JobBoard Pro - Find Your Dream Job',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <ToastProvider>
            <NavbarClient>{props.children}</NavbarClient>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
