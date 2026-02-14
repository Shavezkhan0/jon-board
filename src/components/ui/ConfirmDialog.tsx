'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: 'bg-red-500',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      icon: 'bg-yellow-500',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: 'bg-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 transform transition-all">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div
          className={`w-12 h-12 ${styles.icon} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <AlertTriangle size={24} className="text-white" />
        </div>

        <h3 className="text-white text-lg font-semibold text-center mb-2">{title}</h3>
        <p className="text-slate-400 text-sm text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 px-4 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${styles.button} text-white py-2.5 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
