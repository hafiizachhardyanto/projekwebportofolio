'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PixelButton } from '@/components/ui/PixelButton'
import { EditModal } from '@/components/ui/EditModal'
import { ThemeSelector } from '@/components/ui/ThemeSelector'
import { FontSelector } from '@/components/ui/FontSelector'
import { useEdit } from '@/hooks/useEdit'
import { Palette, Type } from 'lucide-react'
import { ThemeConfig } from '@/types'

interface EditToolbarProps {
  username: string
  currentTheme: string
  currentFont: string
  onThemeChange: (theme: string) => void
  onFontChange: (font: string) => void
}

export function EditToolbar({ 
  username, 
  currentTheme, 
  currentFont,
  onThemeChange,
  onFontChange
}: EditToolbarProps) {
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showFontModal, setShowFontModal] = useState(false)
  const { updateProfile, saving } = useEdit(username)

  const handleSaveTheme = async () => {
    const themeConfig: ThemeConfig = {
      id: currentTheme,
      primary: '',
      secondary: '',
      accent: '',
      background: '',
      surface: '',
      text: '',
      textMuted: '',
      border: '',
      glow: '',
      scanline: true,
      crt: true
    }
    
    await updateProfile({ 
      theme: themeConfig,
      font: currentFont 
    })
    setShowThemeModal(false)
    setShowFontModal(false)
  }

  return (
    <>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-16 md:top-20 left-0 right-0 z-30 bg-[var(--surface)]/95 backdrop-blur border-b-4 border-[var(--primary)]"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-[var(--primary)] animate-pulse">
              EDIT MODE ACTIVE
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={() => setShowThemeModal(true)}
              className="flex items-center gap-2"
            >
              <Palette size={14} />
              <span className="hidden sm:inline">Theme</span>
            </PixelButton>
            
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={() => setShowFontModal(true)}
              className="flex items-center gap-2"
            >
              <Type size={14} />
              <span className="hidden sm:inline">Font</span>
            </PixelButton>
          </div>
        </div>
      </motion.div>

      <EditModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        title="SELECT_THEME.exe"
        onSave={handleSaveTheme}
        saving={saving}
      >
        <ThemeSelector 
          currentTheme={currentTheme} 
          onChange={onThemeChange} 
        />
      </EditModal>

      <EditModal
        isOpen={showFontModal}
        onClose={() => setShowFontModal(false)}
        title="SELECT_FONT.exe"
        onSave={handleSaveTheme}
        saving={saving}
      >
        <FontSelector 
          currentFont={currentFont} 
          onChange={onFontChange} 
        />
      </EditModal>
    </>
  )
}