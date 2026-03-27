'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { usePortfolio } from '@/hooks/usePortfolio'
import { Navbar } from '@/components/layout/Navbar'
import { PixelBackground } from '@/components/layout/PixelBackground'
import { ScanLine } from '@/components/ui/ScanLine'
import { EditToolbar } from '@/components/layout/EditToolbar'
import { GlitchText } from '@/components/ui/GlitchText'
import { PixelCard } from '@/components/ui/PixelCard'

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const username = params.username as string
  const { user } = useAuth()
  const { data, loading, error } = usePortfolio(username)
  const [editMode, setEditMode] = useState(false)
  const [theme, setTheme] = useState('green')
  const [font, setFont] = useState('cyber')

  const isOwner = user?.uid === data?.profile.uid

  useEffect(() => {
    if (data?.profile.theme) {
      const themeId = typeof data.profile.theme === 'string' 
        ? data.profile.theme 
        : (data.profile.theme as any).id || 'green'
      setTheme(themeId)
    }
    if (data?.profile.font) {
      setFont(data.profile.font)
    }
  }, [data])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-font', font)
  }, [theme, font])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-theme="green">
        <PixelBackground />
        <div className="text-center">
          <GlitchText text="LOADING..." size="md" />
          <p className="font-pixel text-xs text-[var(--text-muted)] mt-4 animate-pulse">
            Initializing system
          </p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" data-theme="green">
        <PixelBackground />
        <PixelCard className="max-w-md text-center">
          <GlitchText text="ERROR 404" size="lg" className="text-[var(--accent)]" />
          <p className="font-cyber text-[var(--text-muted)] mt-4">
            Portfolio not found in database
          </p>
        </PixelCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" data-theme={theme} data-font={font}>
      <PixelBackground />
      <ScanLine />
      
      <Navbar 
        username={username} 
        isOwner={isOwner} 
        editMode={editMode}
        onToggleEdit={() => setEditMode(!editMode)}
      />
      
      {editMode && isOwner && (
        <EditToolbar
          username={username}
          currentTheme={theme}
          currentFont={font}
          onThemeChange={setTheme}
          onFontChange={setFont}
        />
      )}
      
      <main className="relative z-10 pt-20 md:pt-24">
        {children}
      </main>
    </div>
  )
}