'use client'

export function PixelBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 pixel-grid opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background)]/50 to-[var(--background)]" />
      
      <div className="absolute top-20 left-10 w-32 h-32 border border-[var(--primary)]/20 rotate-45 animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 border border-[var(--accent)]/20 rotate-12 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-[var(--primary)]/20 -rotate-12 animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--background)_100%)]" />
    </div>
  )
}