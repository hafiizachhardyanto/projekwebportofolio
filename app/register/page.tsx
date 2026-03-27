'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { checkUsernameAvailable, createPortfolio } from '@/lib/db'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelCard } from '@/components/ui/PixelCard'
import { PixelBackground } from '@/components/layout/PixelBackground'
import { GlitchText } from '@/components/ui/GlitchText'
import { ScanLine } from '@/components/ui/ScanLine'
import { UserPlus, Mail, Lock, User, AlertTriangle, ArrowLeft, Home, Check, X } from 'lucide-react'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const validateUsername = (username: string) => {
    return /^[a-z0-9_]{3,20}$/.test(username)
  }

  const checkUsername = async (username: string) => {
    if (!validateUsername(username)) {
      setUsernameStatus(null)
      return
    }
    
    setUsernameStatus('checking')
    const available = await checkUsernameAvailable(username)
    setUsernameStatus(available ? 'available' : 'taken')
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setFormData({ ...formData, username: value })
    if (value.length >= 3) {
      const timeout = setTimeout(() => checkUsername(value), 500)
      return () => clearTimeout(timeout)
    } else {
      setUsernameStatus(null)
    }
  }

  const validateStep1 = () => {
    if (!validateUsername(formData.username)) {
      setError('Username must be 3-20 characters, lowercase letters, numbers, and underscores only')
      return false
    }
    if (usernameStatus !== 'available') {
      setError('Username is not available')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.displayName.length < 2) {
      setError('Display name must be at least 2 characters')
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setError('')
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateStep2()) return
    
    setLoading(true)

    try {
      const userCredential = await register(formData.email, formData.password, formData.displayName)
      
await createPortfolio({
  uid: userCredential.user.uid,
  username: formData.username,
  displayName: formData.displayName,
  email: formData.email,
  photoURL: '',
  bio: '',
  title: 'Digital Creator',
  location: '',
  website: '',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: ''
  },
  theme: {
    id: 'green',
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#ff0080',
    background: '#0a0a0f',
    surface: '#0f172a',
    text: '#ffffff',
    textMuted: '#94a3b8',
    border: '#1e293b',
    glow: 'rgba(0, 255, 65, 0.5)',
    scanline: true,
    crt: true
  },
  font: 'cyber'
})

      router.push(`/${formData.username}`)
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak')
      } else {
        setError('Registration failed. Please try again.')
      }
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
                <UserPlus size={32} className="text-[var(--primary)]" />
              </div>
              <GlitchText text="NEW_USER_INIT" size="md" />
              <p className="font-cyber text-[var(--text-muted)] mt-2">
                Create your portfolio account
              </p>
            </div>

            <PixelCard>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className={`w-8 h-8 flex items-center justify-center font-pixel text-xs border-4 ${step === 1 ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'}`}>
                  1
                </div>
                <div className="w-8 h-1 bg-[var(--border)]">
                  <div className={`h-full bg-[var(--primary)] transition-all ${step === 2 ? 'w-full' : 'w-0'}`} />
                </div>
                <div className={`w-8 h-8 flex items-center justify-center font-pixel text-xs border-4 ${step === 2 ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'}`}>
                  2
                </div>
              </div>

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

              <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }} className="space-y-6">
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <label className="font-pixel text-xs text-[var(--primary)] flex items-center gap-2">
                        <User size={14} />
                        USERNAME ID
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-pixel text-[var(--text-muted)]">
                          @
                        </span>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={handleUsernameChange}
                          placeholder="username"
                          maxLength={20}
                          className="w-full bg-[var(--background)] border-4 border-[var(--border)] pl-12 pr-12 py-3 font-pixel text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {usernameStatus === 'checking' && (
                            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                          )}
                          {usernameStatus === 'available' && (
                            <Check size={20} className="text-[var(--primary)]" />
                          )}
                          {usernameStatus === 'taken' && (
                            <X size={20} className="text-[var(--accent)]" />
                          )}
                        </div>
                      </div>
                      <p className="font-cyber text-xs text-[var(--text-muted)]">
                        3-20 chars, lowercase, numbers, underscores only
                      </p>
                      {usernameStatus === 'taken' && (
                        <p className="font-pixel text-xs text-[var(--accent)]">
                          Username is already taken
                        </p>
                      )}
                      {usernameStatus === 'available' && (
                        <p className="font-pixel text-xs text-[var(--primary)]">
                          Username is available
                        </p>
                      )}
                    </div>

                    <PixelButton
                      type="button"
                      className="w-full"
                      onClick={handleNext}
                      disabled={usernameStatus !== 'available' || loading}
                    >
                      Continue
                    </PixelButton>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="font-pixel text-xs text-[var(--primary)] flex items-center gap-2">
                        <User size={14} />
                        DISPLAY NAME
                      </label>
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        placeholder="Your Name"
                        className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-pixel text-xs text-[var(--primary)] flex items-center gap-2">
                        <Mail size={14} />
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-pixel text-xs text-[var(--primary)] flex items-center gap-2">
                        <Lock size={14} />
                        PASSWORD KEY
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min 6 characters"
                        className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-pixel text-xs text-[var(--primary)] flex items-center gap-2">
                        <Lock size={14} />
                        CONFIRM PASSWORD
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Repeat password"
                        className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <PixelButton
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={handleBack}
                        disabled={loading}
                      >
                        Back
                      </PixelButton>
                      <PixelButton
                        type="submit"
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? 'CREATING...' : 'CREATE_ACCOUNT'}
                      </PixelButton>
                    </div>
                  </>
                )}
              </form>
            </PixelCard>

            <div className="mt-6 text-center space-y-3">
              <p className="font-cyber text-sm text-[var(--text-muted)]">
                Already have an account?
              </p>
              <Link href="/login">
                <PixelButton variant="secondary" size="sm">
                  Sign In
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