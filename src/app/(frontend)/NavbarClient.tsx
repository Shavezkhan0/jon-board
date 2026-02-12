'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function NavbarClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/login'

  return (
    <>
      {!isDashboard && !isLoginPage && <Navbar />}
      <main className="min-h-screen">{children}</main>
    </>
  )
}
