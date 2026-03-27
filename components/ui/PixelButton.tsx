'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PixelButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function PixelButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  type = 'button'
}: PixelButtonProps) {
  const baseStyles = 'relative font-pixel uppercase tracking-wider transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-[var(--primary)] text-[var(--background)] border-4 border-[var(--background)] shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]',
    secondary: 'bg-transparent text-[var(--primary)] border-4 border-[var(--primary)] shadow-[4px_4px_0_0_var(--primary)] hover:shadow-[2px_2px_0_0_var(--primary)]',
    danger: 'bg-[var(--accent)] text-white border-4 border-[var(--background)] shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]',
    ghost: 'bg-transparent text-[var(--text)] border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
  }

  const sizes = {
    sm: 'px-3 py-2 text-[10px]',
    md: 'px-4 py-3 text-xs',
    lg: 'px-6 py-4 text-sm'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {children}
    </motion.button>
  )
}