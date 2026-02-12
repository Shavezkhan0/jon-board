'use client'

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'white' | 'indigo' | 'gray'
  className?: string
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'indigo',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }

  const colorClasses = {
    white: 'text-white',
    indigo: 'text-indigo-600',
    gray: 'text-gray-500'
  }

  return (
    <div className={`inline-block animate-spin ${className}`}>
      <svg
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// Loading overlay component
export function LoadingOverlay({ 
  show = true, 
  message = 'Loading...' 
}: { 
  show?: boolean
  message?: string 
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="large" color="indigo" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
}

// Loading button component
export function LoadingButton({ 
  children, 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}: {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
  [key: string]: any
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center px-4 py-2 border border-transparent 
        text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 
        hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
    >
      {loading && <LoadingSpinner size="small" color="white" className="mr-2" />}
      {children}
    </button>
  )
}

// Loading card component
export function LoadingCard({ 
  title, 
  className = '' 
}: { 
  title?: string
  className?: string 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      )}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
      </div>
    </div>
  )
}

// Full page loading component
export function FullPageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="large" color="indigo" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

// Loading skeleton for job cards
export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        
        <div className="text-lg font-semibold text-gray-900 mb-3">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      <div className="px-6 pb-4 pt-2">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  )
}