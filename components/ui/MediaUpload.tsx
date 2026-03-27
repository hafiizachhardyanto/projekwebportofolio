'use client'

import { useState } from 'react'
import { ImageIcon, Video, Link2, X } from 'lucide-react'
import { PixelButton } from './PixelButton'

interface MediaUploadProps {
  onUpload: (url: string) => void
  type?: 'image' | 'video'
  currentUrl?: string
  onClear?: () => void
}

export function MediaUpload({ onUpload, type = 'image', currentUrl, onClear }: MediaUploadProps) {
  const [url, setUrl] = useState<string>(currentUrl || '')
  const [error, setError] = useState('')

  const validateUrl = (inputUrl: string): boolean => {
    setError('')
    
    if (!inputUrl.trim()) {
      setError('URL cannot be empty')
      return false
    }

    try {
      new URL(inputUrl)
    } catch {
      setError('Please enter a valid URL')
      return false
    }

    const validExtensions = type === 'image' 
      ? ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      : ['.mp4', '.webm', '.mov', '.avi']
    
    const hasValidExt = validExtensions.some(ext => 
      inputUrl.toLowerCase().endsWith(ext) || 
      inputUrl.toLowerCase().includes(ext)
    )
    
    if (!hasValidExt) {
      setError(`URL should be a valid ${type} link`)
      return false
    }

    return true
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    
    if (validateUrl(newUrl)) {
      onUpload(newUrl)
    }
  }

  const handleClear = () => {
    setUrl('')
    setError('')
    if (onClear) onClear()
  }

  const isVideo = type === 'video' || url.match(/\.(mp4|webm|mov|avi)$/i)

  return (
    <div className="space-y-4">
      {url && validateUrl(url) && (
        <div className="relative border-4 border-[var(--border)] overflow-hidden bg-[var(--background)]">
          {isVideo ? (
            <video 
              src={url} 
              className="w-full h-48 object-cover" 
              controls 
              muted
              onError={() => setError('Failed to load video')}
            />
          ) : (
            <img 
              src={url} 
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

      <div>
        <label className="font-pixel text-xs text-[var(--primary)] block mb-2 flex items-center gap-2">
          {type === 'video' ? <Video size={14} /> : <ImageIcon size={14} />}
          {type === 'video' ? 'VIDEO_URL' : 'IMAGE_URL'}
        </label>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder={`Enter ${type} URL (https://...)`}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] pl-10 pr-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          {url && (
            <PixelButton variant="danger" size="sm" onClick={handleClear}>
              Clear
            </PixelButton>
          )}
        </div>
        
        <p className="mt-2 font-pixel text-xs text-[var(--text-muted)]">
          Supported: {type === 'video' ? 'MP4, WebM, MOV' : 'JPG, PNG, GIF, WebP, SVG'}
        </p>
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