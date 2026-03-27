'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PixelButton } from '@/components/ui/PixelButton'
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  User, 
  FolderOpen, 
  GraduationCap, 
  Award, 
  Info,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface PageNavigationProps {
  username: string
  currentPage: 'home' | 'about' | 'projects' | 'education' | 'certificates'
  showBack?: boolean
  showHome?: boolean
  showNext?: boolean
  nextPage?: NavItem
  prevPage?: NavItem
}

export function PageNavigation({ 
  username, 
  currentPage,
  showBack = true,
  showHome = true,
  showNext = true,
  nextPage,
  prevPage
}: PageNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const allNavItems: NavItem[] = [
    { label: 'Home', href: `/${username}`, icon: Home },
    { label: 'About', href: `/${username}/about`, icon: Info },
    { label: 'Projects', href: `/${username}/projects`, icon: FolderOpen },
    { label: 'Education', href: `/${username}/education`, icon: GraduationCap },
    { label: 'Certificates', href: `/${username}/certificates`, icon: Award },
  ]

  const currentIndex = allNavItems.findIndex(item => 
    item.href === pathname || pathname?.startsWith(item.href + '/')
  )

  const defaultPrevPage = currentIndex > 0 ? allNavItems[currentIndex - 1] : undefined
  const defaultNextPage = currentIndex < allNavItems.length - 1 ? allNavItems[currentIndex + 1] : undefined

  const actualPrevPage = prevPage || defaultPrevPage
  const actualNextPage = nextPage || defaultNextPage

  return (
    <>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t-4 border-[var(--border)]"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showBack && actualPrevPage && (
                <Link href={actualPrevPage.href}>
                  <PixelButton variant="secondary" size="sm" className="flex items-center gap-2">
                    <ArrowLeft size={14} />
                    <span className="hidden sm:inline">{actualPrevPage.label}</span>
                  </PixelButton>
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1">
              {allNavItems.map((item) => {
                const isActive = item.href === pathname || pathname?.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 font-pixel text-xs transition-all border-2 ${
                      isActive
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

            <div className="flex items-center gap-2">
              {showHome && (
                <Link href={`/${username}`}>
                  <PixelButton 
                    variant={currentPage === 'home' ? 'primary' : 'secondary'} 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <Home size={14} />
                    <span className="hidden sm:inline">Home</span>
                  </PixelButton>
                </Link>
              )}
              
              <button
                className="md:hidden p-2 border-2 border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] transition-colors"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
              </button>

              {showNext && actualNextPage && (
                <Link href={actualNextPage.href}>
                  <PixelButton variant="secondary" size="sm" className="flex items-center gap-2">
                    <span className="hidden sm:inline">{actualNextPage.label}</span>
                    <ArrowRight size={14} />
                  </PixelButton>
                </Link>
              )}
            </div>
          </div>

          {mobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-3 pt-3 border-t-2 border-[var(--border)]"
            >
              <div className="grid grid-cols-2 gap-2">
                {allNavItems.map((item) => {
                  const isActive = item.href === pathname || pathname?.startsWith(item.href + '/')
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 font-pixel text-xs border-2 ${
                        isActive
                          ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]'
                          : 'text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)]'
                      }`}
                    >
                      <Icon size={14} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      <div className="h-20" />
    </>
  )
}