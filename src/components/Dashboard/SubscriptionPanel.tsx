'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SubscriptionResponse } from '@/types'
import type { PaymentHistoryResponse, PaymentHistoryItem } from '@/types/subscription'

interface SubscriptionPanelProps {
  subscriptionStatus: SubscriptionResponse
}

export default function SubscriptionPanel({ subscriptionStatus }: SubscriptionPanelProps) {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/payment/history')
      if (!response.ok) {
        throw new Error('Failed to fetch payment history')
      }
      const data: PaymentHistoryResponse = await response.json()
      setPaymentHistory(data.docs || [])
    } catch (error) {
      console.error('Error fetching payment history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentHistory()
  }, [])

  const getPlanName = () => {
    if (!subscriptionStatus.plan) return 'No Plan'
    return subscriptionStatus.plan.charAt(0).toUpperCase() + subscriptionStatus.plan.slice(1)
  }

  const getPlanPrice = () => {
    const prices: Record<string, number> = {
      monthly: 29,
      quarterly: 79,
      yearly: 299,
    }
    return prices[subscriptionStatus.plan || 'monthly'] || 29
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const downloadInvoice = (item: PaymentHistoryItem) => {
    // Create a simple PDF receipt (in a real app, you'd use a PDF library)
    const receiptContent = `
INVOICE #${item.id}
Date: ${formatDate(item.date)}
Plan: ${item.plan}
Amount: ${item.currency === 'USD' ? '$' : '₹'}${item.amount}
Status: ${item.status}

Thank you for your subscription!
    `.trim()

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${item.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Subscription</h1>
          <p className="text-slate-600">Manage your subscription and billing</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div
            className={`p-6 ${
              subscriptionStatus.isActive
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : subscriptionStatus.status === 'expired'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Current Plan</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subscriptionStatus.isActive
                    ? 'bg-white/20 text-white'
                    : subscriptionStatus.status === 'expired'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/20 text-white'
                }`}
              >
                {getPlanName()}
              </span>
            </div>

            <div className="text-white">
              <div className="text-3xl font-bold mb-2">
                {subscriptionStatus.currency === 'USD' ? '$' : '₹'}
                {getPlanPrice()}/
                {subscriptionStatus.plan === 'monthly'
                  ? 'month'
                  : subscriptionStatus.plan === 'quarterly'
                    ? 'quarter'
                    : 'year'}
              </div>

              {subscriptionStatus.isActive && (
                <div className="text-white/80 mb-4">
                  Next billing date:{' '}
                  {subscriptionStatus.expiryDate && formatDate(subscriptionStatus.expiryDate)}
                </div>
              )}

              {subscriptionStatus.status === 'expired' && (
                <div className="text-white/80 mb-4">
                  Expired on:{' '}
                  {subscriptionStatus.expiryDate && formatDate(subscriptionStatus.expiryDate)}
                </div>
              )}

              <div className="flex space-x-3">
                {subscriptionStatus.status !== 'active' && (
                  <Link
                    href="/subscribe"
                    className="bg-white hover:bg-white/90 text-indigo-600 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Upgrade Plan
                  </Link>
                )}

                {subscriptionStatus.isActive && (
                  <Link
                    href="/subscribe"
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Change Plan
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="p-6 text-center">
                <svg
                  className="w-12 h-12 text-slate-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-slate-600">No payment history available</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {paymentHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {item.plan.charAt(0).toUpperCase() + item.plan.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {item.currency === 'USD' ? '$' : '₹'}
                        {item.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => downloadInvoice(item)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Cancellation Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Subscription Management</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-slate-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-slate-900">How cancellation works</p>
                <p className="text-sm text-slate-600 mt-1">
                  If you cancel your subscription, you'll continue to have access until the end of
                  your current billing period.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-slate-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-slate-900">Refund policy</p>
                <p className="text-sm text-slate-600 mt-1">
                  We offer a 7-day money-back guarantee for new subscriptions. After that, refunds
                  are prorated.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-slate-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-slate-900">Need help?</p>
                <p className="text-sm text-slate-600 mt-1">
                  Contact our support team at support@jobboard.com for any subscription-related
                  questions.
                </p>
              </div>
            </div>
          </div>

          {subscriptionStatus.isActive && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-4">
                To cancel your subscription, please contact our support team. We'll help you through
                the process.
              </p>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Contact Support to Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
