'use client'

const fonts = [
  { id: 'pixel', name: 'Pixel Art', family: '"Press Start 2P", cursive', sample: 'ABC' },
  { id: 'retro', name: 'Terminal', family: '"VT323", monospace', sample: 'ABC' },
  { id: 'cyber', name: 'Cyber Mono', family: '"Share Tech Mono", monospace', sample: 'ABC' },
  { id: 'modern', name: 'Modern', family: '"Inter", sans-serif', sample: 'ABC' },
]

interface FontSelectorProps {
  currentFont: string
  onChange: (font: string) => void
}

export function FontSelector({ currentFont, onChange }: FontSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {fonts.map((font) => (
        <button
          key={font.id}
          onClick={() => onChange(font.id)}
          className={`p-4 border-4 text-left transition-all ${
            currentFont === font.id 
              ? 'border-[var(--primary)]' 
              : 'border-[var(--border)] hover:border-[var(--text-muted)]'
          }`}
          style={{ 
            backgroundColor: 'var(--surface)',
            boxShadow: currentFont === font.id ? '4px 4px 0 var(--primary)' : 'none'
          }}
        >
          <div 
            className="text-2xl mb-2"
            style={{ fontFamily: font.family, color: 'var(--primary)' }}
          >
            {font.sample}
          </div>
          <span className="font-pixel text-xs text-[var(--text-muted)]">
            {font.name}
          </span>
        </button>
      ))}
    </div>
  )
}