'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      // Call PayloadCMS forgot password endpoint
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        toast('Password reset instructions have been sent to your email', 'success')
      } else {
        setError(data.message || 'Failed to send reset instructions')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-slate-600 mb-8">
              We've sent password reset instructions to:<br />
              <span className="font-medium text-slate-900">{email}</span>
            </p>
            
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600 text-left">
                <strong>Next steps:</strong><br />
                1. Open your email inbox<br />
                2. Look for an email from JobBoard Pro<br />
                3. Click the reset link in the email<br />
                4. Create a new password
              </p>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-center"
              >
                Back to Login
              </Link>
              
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                }}
                className="block w-full text-indigo-600 hover:text-indigo-700 font-medium text-center transition-colors duration-200"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-900">JobBoard Pro</span>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Forgot Password?
          </h2>
          <p className="text-slate-600">
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                  error ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Reset Instructions...
              </>
            ) : (
              'Send Reset Instructions'
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              ← Back to Login
            </Link>
          </div>
        </form>

        {/* Help Section */}
        <div className="bg-slate-100 rounded-lg p-6">
          <h3 className="text-sm font-medium text-slate-900 mb-2">Need Help?</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Make sure to check your spam/junk folder</li>
            <li>• The reset link expires after 24 hours</li>
            <li>• Contact support if you don't receive the email</li>
          </ul>
          <p className="text-sm text-slate-500 mt-3">
            Can't access your email? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}