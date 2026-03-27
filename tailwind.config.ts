import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        retro: ['"VT323"', 'monospace'],
        cyber: ['"Share Tech Mono"', 'monospace'],
        modern: ['"Inter"', 'sans-serif'],
      },
      colors: {
        cyber: {
          black: '#0a0a0f',
          dark: '#0f172a',
          primary: '#00ff41',
          secondary: '#008f11',
          accent: '#ff0080',
          cyan: '#00ffff',
          purple: '#bf00ff',
          yellow: '#ffff00',
          orange: '#ff6600',
          red: '#ff0040',
        },
        retro: {
          green: '#39ff14',
          amber: '#ffb000',
          blue: '#00b8ff',
          pink: '#ff10f0',
        },
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'scan': 'scan 8s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pixel-bounce': 'pixel-bounce 0.5s steps(2) infinite',
        'crt-flicker': 'crt-flicker 0.15s infinite',
        'slide-up': 'slide-up 0.3s steps(4)',
        'slide-down': 'slide-down 0.3s steps(4)',
        'fade-in': 'fade-in 0.5s steps(5)',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
        'pixel-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'crt-flicker': {
          '0%': { opacity: '0.97' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.98' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,1)',
        'pixel-hover': '6px 6px 0px 0px rgba(0,0,0,1)',
        'glow-green': '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 40px #00ff41',
        'glow-cyan': '0 0 10px #00ffff, 0 0 20px #00ffff',
        'glow-pink': '0 0 10px #ff0080, 0 0 20px #ff0080',
        'glow-amber': '0 0 10px #ffb000, 0 0 20px #ffb000',
        'crt': 'inset 0 0 100px rgba(0,0,0,0.5)',
      },
      borderWidth: {
        'pixel': '4px',
      },
    },
  },
  plugins: [],
}
export default config