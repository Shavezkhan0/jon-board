'use client'

import { useState, useRef, DragEvent } from 'react'
import { Upload, X, Camera, AlertCircle } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string | null
  userName: string
  userId: string
  onUploadSuccess: (newUrl: string) => void
  onDeleteSuccess: () => void
}

function getUserInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() || '')
  return initials.join('')
}

export default function ProfilePhotoUpload({
  currentPhotoUrl,
  userName,
  onUploadSuccess,
  onDeleteSuccess,
}: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB')
      return
    }

    setError('')

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError('')
    setUploadProgress(0)

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload/profile-photo', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (res.ok) {
        onUploadSuccess(data.url)
        setPreview(null)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      clearInterval(progressInterval)
      setError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false)
    setIsDeleting(true)
    setError('')

    try {
      const res = await fetch('/api/upload/profile-photo', {
        method: 'DELETE',
      })

      if (res.ok) {
        onDeleteSuccess()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to delete photo')
      }
    } catch {
      setError('Failed to delete photo. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-700 relative">
          {preview || currentPhotoUrl ? (
            <img
              src={preview || currentPhotoUrl || ''}
              alt="Profile photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {getUserInitials(userName)}
            </div>
          )}

          <div
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center text-white">
              <Camera size={24} className="mx-auto mb-1" />
              <span className="text-xs">Change</span>
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/70 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-1" />
            <span className="text-white text-xs">{uploadProgress}%</span>
          </div>
        )}

        {(currentPhotoUrl || preview) && !isUploading && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors shadow-lg"
          >
            {isDeleting ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <X size={14} />
            )}
          </button>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Remove Profile Photo"
        message="Are you sure you want to remove your profile photo? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
        variant="danger"
      />

      <div className="flex flex-col items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
          }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Upload size={16} />
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </button>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl px-6 py-3 text-center transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <p className="text-slate-500 text-xs">or drag & drop here</p>
          <p className="text-slate-600 text-xs mt-1">JPEG, PNG, WebP up to 5MB</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  )
}
