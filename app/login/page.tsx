'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelCard } from '@/components/ui/PixelCard'
import { PixelBackground } from '@/components/layout/PixelBackground'
import { GlitchText } from '@/components/ui/GlitchText'
import { ScanLine } from '@/components/ui/ScanLine'
import { Lock, Mail, AlertTriangle, ArrowLeft, Home, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/')
    } catch (err: any) {
      setError('ACCESS DENIED: Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative" data-theme="green">
      <PixelBackground />
      <ScanLine />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header dengan Navigasi */}
        <header className="p-4 md:p-6 flex justify-between items-center border-b-4 border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary)] border-2 border-[var(--background)] flex items-center justify-center">
              <span className="font-pixel text-[var(--background)] text-xs">P</span>
            </div>
            <span className="font-pixel text-[var(--primary)] text-xs hidden sm:block">PORTFOLIO.OS</span>
          </Link>
          
          <Link href="/" className="flex items-center gap-2 px-3 py-2 font-pixel text-xs text-[var(--text)] border-2 border-transparent hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
            <Home size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--surface)] border-4 border-[var(--primary)] mb-4 animate-pulse-glow">
                <Lock size={32} className="text-[var(--primary)]" />
              </div>
              <GlitchText text="SECURE LOGIN" size="md" />
              <p className="font-cyber text-[var(--text-muted)] mt-2">
                Authentication required
              </p>
            </div>

            <PixelCard>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-4 bg-[var(--accent)]/10 border-2 border-[var(--accent)] mb-6"
                >
                  <AlertTriangle size={20} className="text-[var(--accent)] shrink-0" />
                  <span className="font-pixel text-xs text-[var(--accent)]">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-pixel text-xs text-[var(--primary)] flex items-center gap-2">
                    <Mail size={14} />
                    EMAIL ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="admin@system.net"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-pixel text-xs text-[var(--primary)] flex items-center gap-2">
                    <Lock size={14} />
                    PASSWORD KEY
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="********"
                  />
                </div>

                <PixelButton
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                </PixelButton>
              </form>
            </PixelCard>

            <div className="mt-6 text-center space-y-3">
              <p className="font-cyber text-sm text-[var(--text-muted)]">
                New user?
              </p>
              <Link href="/register">
                <PixelButton variant="secondary" size="sm" className="flex items-center gap-2 mx-auto">
                  <UserPlus size={14} />
                  Create Account
                </PixelButton>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 font-pixel text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                <ArrowLeft size={14} />
                Return to Main
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}