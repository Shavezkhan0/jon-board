'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

type Status = 'loading' | 'success' | 'error' | 'already_verified' | 'invalid' | 'expired'

function VerifyEmailContent() {
  const [status, setStatus] = useState<Status>('loading')
  const [countdown, setCountdown] = useState(3)
  const [email, setEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }

    verifyEmail()
  }, [token])

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (status === 'success' && countdown === 0) {
      router.push('/login')
    }
  }, [status, countdown, router])

  const verifyEmail = async () => {
    try {
      const response = await fetch(`/api/users/verify/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (response.ok) {
        if (data.message?.includes('already been verified')) {
          setStatus('already_verified')
        } else {
          setStatus('success')
        }
      } else {
        if (data.message?.includes('expired')) {
          setStatus('expired')
          // Extract email from error message if available
          const urlParams = new URLSearchParams(searchParams.toString())
          const emailParam = urlParams.get('email')
          if (emailParam) {
            setEmail(emailParam)
          }
        } else if (data.message?.includes('invalid')) {
          setStatus('invalid')
        } else {
          setStatus('error')
          setErrorMessage(data.message || 'Verification failed')
        }
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Failed to verify email. Please try again.')
    }
  }

  const handleResend = async () => {
    if (!email) {
      setResendError('Email is required')
      return
    }

    setResendLoading(true)
    setResendError('')
    setResendSuccess(false)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendSuccess(true)
      } else {
        setResendError(data.error || 'Failed to resend verification email')
      }
    } catch (error) {
      setResendError('Failed to resend verification email. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-white text-2xl font-bold mb-2">Verifying your email...</h1>
          <p className="text-slate-400">Please wait a moment</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Email Verified! 🎉</h1>
          <p className="text-slate-400 mb-6">Your email has been successfully verified.</p>
          <p className="text-slate-400 mb-6">Redirecting to login in {countdown} seconds...</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl text-white font-semibold transition-colors"
          >
            Login Now →
          </button>
        </div>
      </div>
    )
  }

  if (status === 'already_verified') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Already Verified</h1>
          <p className="text-slate-400 mb-6">Your email is already verified.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl text-white font-semibold transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Link Expired</h1>
          <p className="text-slate-400 mb-2">This verification link has expired.</p>
          <p className="text-slate-500 text-sm mb-4">Links are valid for 24 hours only</p>
          
          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white mt-4 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleResend}
            disabled={resendLoading || !email}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed py-3 rounded-xl text-white font-semibold transition-colors"
          >
            {resendLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>

          {resendSuccess && (
            <p className="text-green-400 text-sm mt-2">✅ Email sent! Check your inbox.</p>
          )}
          {resendError && (
            <p className="text-red-400 text-sm mt-2">{resendError}</p>
          )}
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Verification Failed</h1>
          <p className="text-slate-400 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <button
              onClick={verifyEmail}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl text-white font-semibold transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-xl text-white font-semibold transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Invalid Link</h1>
          <p className="text-slate-400 mb-6">This link is invalid or malformed.</p>
          <button
            onClick={() => router.push('/register')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl text-white font-semibold transition-colors"
          >
            Go to Register
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}