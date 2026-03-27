'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PixelCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function PixelCard({ children, className, hover = true, glow = false, onClick }: PixelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, boxShadow: '8px 8px 0 rgba(0,0,0,0.5)' } : {}}
      onClick={onClick}
      className={cn(
        'relative bg-[var(--surface)] border-4 border-[var(--border)] p-6 overflow-hidden',
        onClick && 'cursor-pointer',
        glow && 'animate-pulse-glow',
        className
      )}
      style={{
        boxShadow: '4px 4px 0 rgba(0,0,0,0.5)'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />
      {children}
    </motion.div>
  )
}