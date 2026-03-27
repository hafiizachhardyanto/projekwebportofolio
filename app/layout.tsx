import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '8-Bit Portfolio',
  description: 'Futuristic 8-bit style portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}