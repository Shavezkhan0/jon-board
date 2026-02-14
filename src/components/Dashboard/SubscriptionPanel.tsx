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
    const receiptContent = `
INVOICE #${item.id}
Date: ${formatDate(item.startedAt || item.createdAt || item.date || '')}
Plan: ${item.plan || 'monthly'}
Amount: ${(item.currency || 'INR') === 'USD' ? '$' : '₹'}${item.amount || 0}
Status: ${item.status || 'pending'}

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
    <div className="w-full space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Subscription</h1>
        <p className="text-sm text-slate-600">Manage your subscription</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div
          className={`p-3 ${
            subscriptionStatus.isActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : subscriptionStatus.status === 'expired'
                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Current Plan</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
              {getPlanName()}
            </span>
          </div>

          <div className="text-white mt-2">
            <div className="text-2xl font-bold">
              {subscriptionStatus.currency === 'USD' ? '$' : '₹'}
              {getPlanPrice()}/
              {subscriptionStatus.plan === 'monthly'
                ? 'month'
                : subscriptionStatus.plan === 'quarterly'
                  ? 'quarter'
                  : 'year'}
            </div>

            {subscriptionStatus.isActive && (
              <div className="text-xs text-white/80 mt-1">
                Next billing:{' '}
                {subscriptionStatus.expiryDate && formatDate(subscriptionStatus.expiryDate)}
              </div>
            )}

            {subscriptionStatus.status === 'expired' && (
              <div className="text-xs text-white/80 mt-1">
                Expired:{' '}
                {subscriptionStatus.expiryDate && formatDate(subscriptionStatus.expiryDate)}
              </div>
            )}

            <div className="flex gap-2 mt-2">
              {subscriptionStatus.status !== 'active' && (
                <Link
                  href="/subscribe"
                  className="bg-white hover:bg-white/90 text-indigo-600 px-3 py-1.5 rounded text-xs font-medium"
                >
                  Upgrade
                </Link>
              )}

              {subscriptionStatus.isActive && (
                <Link
                  href="/subscribe"
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                  Change Plan
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-3 py-2 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Payment History</h2>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="p-4 text-center">
              <svg
                className="w-8 h-8 text-slate-400 mx-auto mb-2"
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
              <p className="text-sm text-slate-600">No payment history</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Date</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Plan</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Amount</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Status</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-900">
                      {formatDate(item.startedAt || item.createdAt || item.date || '')}
                    </td>
                    <td className="px-3 py-2 text-slate-900">
                      {(item.plan || 'monthly').charAt(0).toUpperCase() +
                        (item.plan || 'monthly').slice(1)}
                    </td>
                    <td className="px-3 py-2 text-slate-900">
                      {(item.currency || 'INR') === 'USD' ? '$' : '₹'}
                      {item.amount || 0}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(item.status || 'pending')}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
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
    </div>
  )
}
