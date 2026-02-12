import { ReactNode } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {children}
      </div>
    </div>
  )
}