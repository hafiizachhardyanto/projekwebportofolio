'use client'

import { useState, useRef } from 'react'
import { PixelButton } from './PixelButton'
import { Upload, Image as ImageIcon, Video, X } from 'lucide-react'

interface MediaUploadProps {
  onUpload: (file: File) => void
  accept?: string
  type?: 'image' | 'video' | 'both'
  currentUrl?: string
  onClear?: () => void
}

export function MediaUpload({ onUpload, type = 'both', currentUrl, onClear }: MediaUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const MAX_SIZE_MB = 5

  const acceptTypes = {
    image: 'image/*',
    video: 'video/*',
    both: 'image/*,video/*'
  }

  const validateFile = (file: File): boolean => {
    setError('')
    
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_SIZE_MB}MB`)
      return false
    }

    const validTypes = type === 'image' ? ['image/'] : type === 'video' ? ['video/'] : ['image/', 'video/']
    const isValid = validTypes.some(t => file.type.startsWith(t))
    
    if (!isValid) {
      setError(`Invalid file type. Please upload ${type === 'both' ? 'image or video' : type}`)
      return false
    }

    return true
  }

  const handleFile = (file: File) => {
    if (!validateFile(file)) return
    
    const url = URL.createObjectURL(file)
    setPreview(url)
    onUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClear = () => {
    setPreview(null)
    setError('')
    if (onClear) onClear()
  }

  return (
    <div>
      <div
        className={`border-4 border-dashed p-6 text-center transition-colors ${
          dragging ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes[type]}
          onChange={handleChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="space-y-4">
            {preview.startsWith('data:video') || preview.endsWith('.mp4') || preview.includes('video') ? (
              <video src={preview} className="max-h-48 mx-auto rounded border-2 border-[var(--border)]" controls />
            ) : (
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded border-2 border-[var(--border)]" />
            )}
            <div className="flex justify-center gap-3">
              <PixelButton variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
                Change File
              </PixelButton>
              <PixelButton variant="danger" size="sm" onClick={handleClear} className="flex items-center gap-2">
                <X size={14} />
                Remove
              </PixelButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center gap-4 text-[var(--text-muted)]">
              <ImageIcon size={32} />
              <Video size={32} />
            </div>
            <p className="font-retro text-lg text-[var(--text-muted)]">
              Drag & drop or click to upload
            </p>
            <p className="font-pixel text-xs text-[var(--text-muted)]">
              Max {MAX_SIZE_MB}MB
            </p>
            <PixelButton size="sm" onClick={() => inputRef.current?.click()}>
              Select File
            </PixelButton>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 font-pixel text-xs text-[var(--accent)]">{error}</p>
      )}
    </div>
  )
}