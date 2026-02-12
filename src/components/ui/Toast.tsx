'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 4000
  ) => {
    const id = Date.now().toString()
    const newToast: Toast = { id, message, type, duration }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✓',
          iconBg: 'bg-green-100',
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '✕',
          iconBg: 'bg-red-100',
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠',
          iconBg: 'bg-yellow-100',
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ',
          iconBg: 'bg-blue-100',
        }
    }
  }

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((toastItem) => {
          const styles = getToastStyles(toastItem.type)
          
          return (
            <div
              key={toastItem.id}
              className={`
                flex items-start space-x-3 p-4 rounded-lg border shadow-lg
                max-w-md w-full pointer-events-auto
                transform transition-all duration-300 ease-in-out
                ${styles.bg} ${styles.border} ${styles.text}
                animate-slide-in-right
              `}
            >
              {/* Icon */}
              <div
                className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                  text-sm font-medium
                  ${styles.iconBg}
                `}
              >
                {styles.icon}
              </div>
              
              {/* Message */}
              <div className="flex-1 text-sm font-medium">
                {toastItem.message}
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => removeToast(toastItem.id)}
                className={`
                  flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10
                  transition-colors duration-200
                  ${styles.text}
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  )
}

// Export a simple toast function for quick usage
export const showToast = (
  message: string,
  type?: 'success' | 'error' | 'warning' | 'info',
  duration?: number
) => {
  // This is a fallback for when ToastProvider is not available
  console.log(`Toast (${type || 'info'}): ${message}`)
}