'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PixelButton } from './PixelButton'
import { X } from 'lucide-react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSave: () => void
  saving?: boolean
}

export function EditModal({ isOpen, onClose, title, children, onSave, saving }: EditModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[var(--surface)] border-4 border-[var(--primary)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: '8px 8px 0 rgba(0,0,0,0.5)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b-4 border-[var(--border)] bg-[var(--background)]">
            <h2 className="font-pixel text-[var(--primary)] text-sm md:text-base">{title}</h2>
            <button 
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {children}
          </div>
          
          <div className="flex justify-end gap-3 p-4 border-t-4 border-[var(--border)] bg-[var(--background)]">
            <PixelButton variant="secondary" onClick={onClose}>
              Cancel
            </PixelButton>
            <PixelButton onClick={onSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </PixelButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}