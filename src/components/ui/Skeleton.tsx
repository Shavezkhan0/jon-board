'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', children }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded ${className}`}
      role="status"
      aria-label="Loading..."
    >
      {children && <div className="opacity-0">{children}</div>}
    </div>
  )
}

// Card Skeleton
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-end space-x-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Text Skeleton
export const SkeletonText: React.FC<{ 
  lines?: number
  className?: string
  lineClassName?: string
}> = ({ 
  lines = 3, 
  className = '',
  lineClassName = 'h-4'
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className={`${lineClassName} ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

// Avatar Skeleton
export const SkeletonAvatar: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-full ${className}`} />
  )
}

// Table Skeleton
export const SkeletonTable: React.FC<{ 
  rows?: number
  columns?: number
  className?: string
}> = ({ 
  rows = 5,
  columns = 4,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-slate-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Stats Card Skeleton
export const SkeletonStatsCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

// Job List Skeleton
export const SkeletonJobList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start space-x-4">
            <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Profile Form Skeleton
export const SkeletonProfileForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Subscription Card Skeleton
export const SkeletonSubscriptionCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      <div className="p-6 bg-gradient-to-r from-slate-400 to-slate-600">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-6 w-20 bg-white/20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-48 bg-white/20" />
          <Skeleton className="h-4 w-64 bg-white/20" />
          <Skeleton className="h-12 w-40 bg-white/20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Loading Spinner
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <svg
        className="w-full h-full text-indigo-600"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  )
}

export default Skeleton