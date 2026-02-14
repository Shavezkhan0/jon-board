'use client'

import { useState, useRef } from 'react'
import { Upload, Building2 } from 'lucide-react'

interface CompanyLogoUploadProps {
  jobId: string
  company: string
  currentLogoUrl?: string | null
  onUploadSuccess: (newUrl: string) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
}

export default function CompanyLogoUpload({
  jobId,
  company,
  currentLogoUrl,
  onUploadSuccess,
  size = 'md',
}: CompanyLogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const sizeClasses = sizeMap[size]

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setError('File size must be under 3MB')
      return
    }

    setError('')
    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('jobId', jobId)
    formData.append('company', company)

    try {
      const res = await fetch('/api/upload/company-logo', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        onUploadSuccess(data.url)
        setPreview(null)
      } else {
        setError(data.error || 'Upload failed')
        setPreview(null)
      }
    } catch {
      setError('Upload failed. Please try again.')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative group ${sizeClasses}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview || currentLogoUrl ? (
          <img
            src={preview || currentLogoUrl || ''}
            alt={`${company} logo`}
            className="w-full h-full object-contain rounded-xl bg-white p-1"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-600">
            <div className="text-center">
              <Building2 size={24} className="text-slate-500 mx-auto" />
              <span className="text-slate-600 text-xs mt-1 block">Logo</span>
            </div>
          </div>
        )}

        {!isUploading && (
          <div
            className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={20} className="text-white" />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 rounded-xl bg-black/70 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <label className="text-indigo-400 text-xs cursor-pointer hover:text-indigo-300 mt-2 block text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
          }}
        />
        {isUploading ? 'Uploading...' : 'Upload Logo'}
      </label>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
