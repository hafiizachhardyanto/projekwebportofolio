'use client'

import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function GlitchText({ text, className, size = 'md' }: GlitchTextProps) {
  const sizes = {
    sm: 'text-lg md:text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-7xl'
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <h1 
        className={cn('font-pixel font-bold text-[var(--primary)] glitch', sizes[size])}
        data-text={text}
      >
        {text}
      </h1>
    </div>
  )
}