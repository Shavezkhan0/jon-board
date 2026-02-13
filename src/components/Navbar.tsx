'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Briefcase, CreditCard } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
  const isAdmin = user && adminEmails.includes(user.email)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Nav */}
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                JobBoard Pro
              </span>
            </Link>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href="/jobs"
                className="text-gray-600 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-600 text-sm font-medium transition-colors"
              >
                Find Jobs
              </Link>
              <Link
                href="/subscribe"
                className="text-gray-600 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-600 text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
                      title="Admin Panel"
                    >
                      <Shield className="w-5 h-5" />
                    </Link>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition-all"
                    >
                      {user.profilePhoto &&
                      typeof user.profilePhoto !== 'string' &&
                      user.profilePhoto.url ? (
                        <img
                          className="h-9 w-9 rounded-full object-cover"
                          src={user.profilePhoto.url}
                          alt={user.fullName}
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {getInitials(user.fullName)}
                        </div>
                      )}
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowProfileMenu(false)}
                        ></div>
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 border border-gray-100">
                          <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>

                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 mr-3 text-gray-500" />
                            Dashboard
                          </Link>

                          <Link
                            href="/dashboard?tab=profile"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-gray-500" />
                            Profile
                          </Link>

                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <Shield className="w-4 h-4 mr-3 text-gray-500" />
                              Admin Panel
                            </Link>
                          )}

                          <button
                            onClick={() => {
                              setShowProfileMenu(false)
                              handleLogout()
                            }}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/login?tab=register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/jobs"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
              onClick={() => setIsOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/subscribe"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
          </div>

          <div className="pt-4 pb-4 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center px-4 mb-4">
                  <div className="flex-shrink-0">
                    {user.profilePhoto &&
                    typeof user.profilePhoto !== 'string' &&
                    user.profilePhoto.url ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.profilePhoto.url}
                        alt={user.fullName}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      handleLogout()
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-500"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/login?tab=register"
                  className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 mt-3"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
