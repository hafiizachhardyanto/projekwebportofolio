'use client'

import { PixelButton } from './PixelButton'
import { Check } from 'lucide-react'

const themes = [
  { id: 'green', name: 'Matrix Green', primary: '#00ff41', accent: '#ff0080' },
  { id: 'cyber', name: 'Cyber Cyan', primary: '#00ffff', accent: '#ff00ff' },
  { id: 'amber', name: 'Retro Amber', primary: '#ffb000', accent: '#ff4000' },
  { id: 'pink', name: 'Neon Pink', primary: '#ff10f0', accent: '#00ffff' },
  { id: 'red', name: 'Crimson Red', primary: '#ff0040', accent: '#ffff00' },
]

interface ThemeSelectorProps {
  currentTheme: string
  onChange: (theme: string) => void
}

export function ThemeSelector({ currentTheme, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onChange(theme.id)}
          className={`relative p-4 border-4 transition-all ${
            currentTheme === theme.id 
              ? 'border-[var(--primary)]' 
              : 'border-[var(--border)] hover:border-[var(--text-muted)]'
          }`}
          style={{ 
            backgroundColor: 'var(--surface)',
            boxShadow: currentTheme === theme.id ? '4px 4px 0 var(--primary)' : 'none'
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-6 h-6 border-2 border-black"
              style={{ backgroundColor: theme.primary }}
            />
            <span className="font-pixel text-xs" style={{ color: theme.primary }}>
              {theme.name}
            </span>
          </div>
          {currentTheme === theme.id && (
            <div className="absolute top-2 right-2 text-[var(--primary)]">
              <Check size={16} />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}