'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Note: You'll need to install canvas-confetti:
// npm install canvas-confetti @types/canvas-confetti
// import confetti from 'canvas-confetti'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const plan = searchParams.get('plan') || 'Premium Plan'
  const expiresAt = searchParams.get('expiresAt') || ''

  useEffect(() => {
    // Trigger confetti animation on mount
    // Uncomment the following lines after installing canvas-confetti:
    /*
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      })
    }, 250)

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      })
    }, 400)
    */

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/jobs')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-xl text-slate-600">
            Welcome to JobBoard Pro
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 mb-4">
              🎉 {plan} Activated
            </div>
            
            {expiresAt && (
              <div className="text-slate-600 mb-4">
                Your subscription is valid until:
                <div className="font-semibold text-slate-900 mt-1">
                  {formatDate(expiresAt)}
                </div>
              </div>
            )}

            <div className="bg-emerald-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-emerald-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-emerald-800 text-left space-y-1">
                <li>• Browse thousands of job listings</li>
                <li>• Save your favorite positions</li>
                <li>• Get personalized job alerts</li>
                <li>• Apply directly to companies</li>
              </ul>
            </div>

            <div className="text-slate-500 text-sm">
              Redirecting to jobs in {countdown} seconds...
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/jobs"
              className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 text-center"
            >
              Browse Jobs Now
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200 text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-slate-500 text-sm">
          <p>A confirmation email has been sent to your registered email address.</p>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-teal-200 rounded-full opacity-20 animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse delay-150"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-300"></div>
        </div>

        {/* Manual Trigger for Confetti (Falling back to CSS since canvas-confetti not installed) */}
        <style jsx>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }

          .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background: linear-gradient(45deg, #10b981, #34d399, #6ee7b7);
            animation: confetti-fall 3s linear infinite;
          }

          .confetti:nth-child(1) { left: 10%; animation-delay: 0s; background: #10b981; }
          .confetti:nth-child(2) { left: 20%; animation-delay: 0.2s; background: #34d399; }
          .confetti:nth-child(3) { left: 30%; animation-delay: 0.4s; background: #6ee7b7; }
          .confetti:nth-child(4) { left: 40%; animation-delay: 0.6s; background: #10b981; }
          .confetti:nth-child(5) { left: 50%; animation-delay: 0.8s; background: #34d399; }
          .confetti:nth-child(6) { left: 60%; animation-delay: 1s; background: #6ee7b7; }
          .confetti:nth-child(7) { left: 70%; animation-delay: 1.2s; background: #10b981; }
          .confetti:nth-child(8) { left: 80%; animation-delay: 1.4s; background: #34d399; }
          .confetti:nth-child(9) { left: 90%; animation-delay: 1.6s; background: #6ee7b7; }
        `}</style>

        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'Payment Successful - JobBoard Pro',
    description: 'Your subscription has been activated successfully. Start exploring premium job features now.',
    keywords: 'payment success, subscription activated, job board',
    noindex: true, // Prevent indexing of success pages
  }
}