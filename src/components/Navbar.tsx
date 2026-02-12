'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    toast('Logged out successfully', 'success')
    setIsUserMenuOpen(false)
    router.push('/')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isSubscriptionActive = () => {
    if (!user) return false
    return (
      user.subscriptionStatus === 'active' &&
      user.subscriptionExpiry &&
      new Date(user.subscriptionExpiry) > new Date()
    )
  }

  const isActiveLink = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/jobs', label: 'Browse Jobs' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const userMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/saved-jobs', label: 'My Saved Jobs', icon: '💼' },
  ]

  return (
    <>
      {/* Backdrop blur for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200'
            : 'bg-white border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-105">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                JobBoard Pro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActiveLink(link.href)
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side - Auth/User Menu */}
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
              ) : isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  {/* User Avatar with subscription indicator */}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    {/* Subscription indicator */}
                    {isSubscriptionActive() && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* User Avatar */}
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto.url}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    
                    {/* Dropdown Arrow */}
                    <svg
                      className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                        isUserMenuOpen ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        {isSubscriptionActive() && (
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Active Subscription</span>
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="p-4 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-slate-900">JobBoard Pro</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActiveLink(link.href)
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {isAuthenticated && user && userMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                {!isAuthenticated && (
                  <div className="pt-4 space-y-2 border-t border-slate-200">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                )}

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}