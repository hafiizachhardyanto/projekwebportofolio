'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Info, GraduationCap, FolderOpen, Award } from 'lucide-react'
import { PixelButton } from '@/components/ui/PixelButton'

interface PortfolioNavProps {
  username: string
}

export function PortfolioNav({ username }: PortfolioNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: `/${username}`, label: 'Home', icon: Home },
    { href: `/${username}/about`, label: 'About', icon: Info },
    { href: `/${username}/education`, label: 'Education', icon: GraduationCap },
    { href: `/${username}/projects`, label: 'Projects', icon: FolderOpen },
    { href: `/${username}/certificates`, label: 'Certificates', icon: Award },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)]/95 backdrop-blur-md border-t-4 border-[var(--primary)] p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:flex items-center justify-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <PixelButton
                  variant={isActive(item.href) ? 'primary' : 'secondary'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon size={16} />
                  {item.label}
                </PixelButton>
              </Link>
            )
          })}
        </div>

        <div className="md:hidden grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded ${
                    isActive(item.href)
                      ? 'bg-[var(--primary)] text-[var(--background)]'
                      : 'bg-[var(--surface)] text-[var(--text)] border-2 border-[var(--border)]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-pixel text-[8px]">{item.label.slice(0, 4)}</span>
                </button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}