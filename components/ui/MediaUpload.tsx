'use client'

import { useState, useRef } from 'react'
import { ImageIcon, Video, Upload, X, FileUp } from 'lucide-react'
import { PixelButton } from './PixelButton'

interface MediaUploadProps {
  onFileSelect: (file: File | null, base64Data: string) => void
  type?: 'image' | 'video'
  currentUrl?: string
  onClear?: () => void
}

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB limit for Firestore

export function MediaUpload({ onFileSelect, type = 'image', currentUrl, onClear }: MediaUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl || '')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  const validateFile = (file: File): boolean => {
    setError('')

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than 1MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      return false
    }

    const validTypes = type === 'image'
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      : ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']

    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type. Supported: ${type === 'video' ? 'MP4, WebM, MOV' : 'JPG, PNG, GIF, WebP, SVG'}`)
      return false
    }

    return true
  }

  const handleFileChange = async (file: File | null) => {
    if (!file) return

    if (!validateFile(file)) {
      onFileSelect(null, '')
      return
    }

    try {
      const base64 = await fileToBase64(file)
      setPreviewUrl(base64)
      onFileSelect(file, base64)
      setError('')
    } catch {
      setError('Failed to process file')
      onFileSelect(null, '')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileChange(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClear = () => {
    setPreviewUrl('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileSelect(null, '')
    if (onClear) onClear()
  }

  const isVideo = type === 'video' || previewUrl.match(/^data:video\//) || previewUrl.match(/\.(mp4|webm|mov|avi)$/i)

  return (
    <div className="space-y-4">
      {previewUrl && (
        <div className="relative border-4 border-[var(--border)] overflow-hidden bg-[var(--background)]">
          {isVideo ? (
            <video 
              src={previewUrl} 
              className="w-full h-48 object-cover" 
              controls 
              muted
              onError={() => setError('Failed to load video')}
            />
          ) : (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-48 object-cover"
              onError={() => setError('Failed to load image')}
            />
          )}
          
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-2 bg-[var(--accent)] text-white border-2 border-[var(--background)] hover:scale-110 transition-transform"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-4 border-dashed cursor-pointer transition-all
          ${isDragging 
            ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
            : 'border-[var(--border)] hover:border-[var(--primary)]/50'
          }
          ${previewUrl ? 'p-4' : 'p-8'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={type === 'video' ? 'video/*' : 'image/*'}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
          <FileUp size={32} className={isDragging ? 'text-[var(--primary)]' : ''} />
          <div className="text-center">
            <p className="font-pixel text-xs mb-1">
              {isDragging ? 'DROP_FILE_HERE' : 'CLICK_OR_DRAG_FILE'}
            </p>
            <p className="font-cyber text-xs opacity-70">
              Max size: 1MB | {type === 'video' ? 'MP4, WebM, MOV' : 'JPG, PNG, GIF, WebP'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="font-pixel text-xs text-[var(--accent)] flex items-center gap-2">
          <X size={12} />
          {error}
        </p>
      )}
    </div>
  )
}