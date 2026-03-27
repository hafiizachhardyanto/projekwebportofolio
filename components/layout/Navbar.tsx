'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { PixelButton } from '@/components/ui/PixelButton'
import { GlitchText } from '@/components/ui/GlitchText'
import { Menu, X, User, LogOut, Edit, Eye, Home, Info, GraduationCap, FolderOpen, Award } from 'lucide-react'
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
    { href: `/${username}`, label: 'Home', icon: Home },
    { href: `/${username}/about`, label: 'About', icon: Info },
    { href: `/${username}/education`, label: 'Education', icon: GraduationCap },
    { href: `/${username}/projects`, label: 'Projects', icon: FolderOpen },
    { href: `/${username}/certificates`, label: 'Certificates', icon: Award },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--background)]/95 backdrop-blur-md border-b-4 border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link href={`/${username}`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary)] flex items-center justify-center border-2 border-[var(--background)] animate-pulse-glow">
              <span className="font-pixel text-[var(--background)] text-xs">
                {username.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <GlitchText text={username} size="sm" className="hidden md:block" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs transition-all border-2 ${
                    isActive(item.href)
                      ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]'
                      : 'text-[var(--text)] border-transparent hover:border-[var(--primary)] hover:text-[var(--primary)]'
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            
            {/* Edit Mode Toggle */}
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

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <User size={16} />
                  <span className="font-pixel text-xs">{user.email?.split('@')[0]}</span>
                </div>
                <PixelButton variant="ghost" size="sm" onClick={signOut}>
                  <LogOut size={16} />
                </PixelButton>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <PixelButton size="sm">Login</PixelButton>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-[var(--text)] p-2 border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[var(--surface)] border-t-4 border-[var(--border)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              
              {/* Mobile Nav Items */}
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 font-pixel text-xs border-2 ${
                      isActive(item.href)
                        ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]'
                        : 'text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}

              {/* Mobile Edit Toggle */}
              {isOwner && (
                <PixelButton
                  variant={editMode ? 'danger' : 'secondary'}
                  size="md"
                  onClick={() => {
                    onToggleEdit()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2"
                >
                  {editMode ? <Eye size={16} /> : <Edit size={16} />}
                  {editMode ? 'Switch to View Mode' : 'Switch to Edit Mode'}
                </PixelButton>
              )}

              {/* Mobile Auth */}
              {!user ? (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <PixelButton size="md" className="w-full mt-4">
                    Login
                  </PixelButton>
                </Link>
              ) : (
                <PixelButton
                  variant="danger"
                  size="md"
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </PixelButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}