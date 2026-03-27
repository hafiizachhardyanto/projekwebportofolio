'use client'

export function ScanLine() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute w-full h-2 bg-gradient-to-b from-transparent via-[var(--primary)] to-transparent opacity-10 animate-scan" />
    </div>
  )
}