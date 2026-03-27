'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { PixelButton } from '@/components/ui/PixelButton'
import { GlitchText } from '@/components/ui/GlitchText'
import { Menu, X, User, LogOut, Edit, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
  username: string
  isOwner: boolean
  editMode: boolean
  onToggleEdit: () => void
}

export function Navbar({ username, isOwner, editMode, onToggleEdit }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navItems = [
    { href: `/${username}`, label: 'Home' },
    { href: `/${username}/about`, label: 'About' },
    { href: `/${username}/education`, label: 'Education' },
    { href: `/${username}/projects`, label: 'Projects' },
    { href: `/${username}/certificates`, label: 'Certificates' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--background)]/90 backdrop-blur-md border-b-4 border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href={`/${username}`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary)] flex items-center justify-center border-2 border-[var(--background)]">
              <span className="font-pixel text-[var(--background)] text-xs">
                {username.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <GlitchText text={username} size="sm" className="hidden md:block" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 font-pixel text-xs transition-all border-2 ${
                  isActive(item.href)
                    ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]'
                    : 'text-[var(--text)] border-transparent hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isOwner && (
              <PixelButton
                variant={editMode ? 'danger' : 'secondary'}
                size="sm"
                onClick={onToggleEdit}
                className="hidden md:flex items-center gap-2"
              >
                {editMode ? <Eye size={14} /> : <Edit size={14} />}
                {editMode ? 'View' : 'Edit'}
              </PixelButton>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-[var(--text-muted)]">
                  <User size={16} />
                  <span className="font-pixel text-xs">{user.email?.split('@')[0]}</span>
                </div>
                <PixelButton variant="ghost" size="sm" onClick={signOut}>
                  <LogOut size={16} />
                </PixelButton>
              </div>
            ) : (
              <Link href="/login">
                <PixelButton size="sm">Login</PixelButton>
              </Link>
            )}

            <button
              className="md:hidden text-[var(--text)] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[var(--surface)] border-t-4 border-[var(--border)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-pixel text-xs border-2 ${
                    isActive(item.href)
                      ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]'
                      : 'text-[var(--text)] border-[var(--border)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {isOwner && (
                <PixelButton
                  variant={editMode ? 'danger' : 'secondary'}
                  size="md"
                  onClick={() => {
                    onToggleEdit()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full mt-4"
                >
                  {editMode ? 'View Mode' : 'Edit Mode'}
                </PixelButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}