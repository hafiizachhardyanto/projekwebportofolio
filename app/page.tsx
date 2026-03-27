'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlitchText } from '@/components/ui/GlitchText'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelCard } from '@/components/ui/PixelCard'
import { PixelBackground } from '@/components/layout/PixelBackground'
import { ScanLine } from '@/components/ui/ScanLine'
import { Terminal, User, ArrowRight, Sparkles, UserPlus, Home, Info, GraduationCap, FolderOpen, Award, Menu, X, LogIn, ArrowLeft } from 'lucide-react'

export default function LandingPage() {
  const [username, setUsername] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '#features', label: 'Features', icon: Info },
    { href: '/login', label: 'Login', icon: LogIn },
    { href: '/register', label: 'Register', icon: UserPlus },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" data-theme="green">
      <PixelBackground />
      <ScanLine />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        
        <header className="p-4 md:p-6 flex justify-between items-center border-b-4 border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--primary)] border-4 border-[var(--background)] flex items-center justify-center animate-pulse-glow">
              <span className="font-pixel text-[var(--background)] text-sm md:text-lg">P</span>
            </div>
            <span className="font-pixel text-[var(--primary)] text-xs md:text-sm hidden sm:block">PORTFOLIO.OS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 font-pixel text-xs text-[var(--text)] border-2 border-transparent hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <button
            className="md:hidden text-[var(--text)] p-2 border-2 border-[var(--border)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="md:hidden bg-[var(--surface)] border-b-4 border-[var(--border)]"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 font-pixel text-xs text-[var(--text)] border-2 border-[var(--border)] hover:border-[var(--primary)]"
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border-2 border-[var(--primary)] mb-6">
                <Sparkles size={16} className="text-[var(--primary)]" />
                <span className="font-pixel text-xs text-[var(--primary)]">v0.1 FUTURISTIC MODE</span>
              </div>
              
              <GlitchText text="8-BIT PORTFOLIO" size="xl" className="mb-4" />
              
              <p className="font-cyber text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                Create your futuristic portfolio with 8-bit aesthetics. 
                Dynamic, editable, and totally rad.
              </p>
            </motion.div>

            <PixelCard className="max-w-lg mx-auto mb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[var(--primary)] mb-4">
                  <Terminal size={20} />
                  <span className="font-pixel text-xs">ENTER USERNAME.exe</span>
                </div>
                
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-pixel text-[var(--primary)]">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    placeholder="username"
                    className="w-full bg-[var(--background)] border-4 border-[var(--border)] pl-12 pr-4 py-4 font-pixel text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                  />
                </div>

                <Link 
                  href={username ? `/${username}` : '#'}
                  className={!username ? 'pointer-events-none' : ''}
                >
                  <PixelButton 
                    className="w-full flex items-center justify-center gap-3"
                    disabled={!username}
                  >
                    View Portfolio
                    <ArrowRight size={16} />
                  </PixelButton>
                </Link>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-[var(--surface)] font-pixel text-xs text-[var(--text-muted)]">
                      OR
                    </span>
                  </div>
                </div>

                <Link href="/register">
                  <PixelButton variant="secondary" className="w-full flex items-center justify-center gap-3">
                    <UserPlus size={16} />
                    Create Your Portfolio
                  </PixelButton>
                </Link>
              </div>
            </PixelCard>

            <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: User, title: 'Personal Brand', desc: 'Custom username & profile' },
                { icon: Terminal, title: 'Dynamic Content', desc: 'Editable sections & media' },
                { icon: Sparkles, title: '8-Bit Themes', desc: 'Multiple color schemes' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <PixelCard className="h-full text-center">
                    <feature.icon size={32} className="mx-auto mb-4 text-[var(--primary)]" />
                    <h3 className="font-pixel text-xs text-[var(--text)] mb-2">{feature.title}</h3>
                    <p className="font-cyber text-sm text-[var(--text-muted)]">{feature.desc}</p>
                  </PixelCard>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        <footer className="p-6 text-center border-t-4 border-[var(--border)] bg-[var(--surface)]">
          <p className="font-pixel text-xs text-[var(--text-muted)]">
            SYSTEM.READY PRESS START TO CONTINUE
          </p>
        </footer>
      </div>
    </div>
  )
}