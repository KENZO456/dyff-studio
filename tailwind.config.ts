import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ----------------------------------------
         FONTS
      ---------------------------------------- */
      fontFamily: {
        thunder:     ['Thunder', 'sans-serif'],
        serif:       ['var(--font-baskerville)', 'Georgia', 'serif'],
        mono:        ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
      },

      /* ----------------------------------------
         INK COLOR SYSTEM
      ---------------------------------------- */
      colors: {
        ink: {
          void:        '#080808',
          dark:        '#111111',
          surface:     '#1c1c1c',
          paper:       '#f2ead8',
          white:       '#ffffff',
          crimson:     '#8b0000',
          ember:       '#c0392b',
          gold:        '#c9a84c',
          green:       '#99ca45',
          'green-glow':'rgba(153,202,69,0.2)',
          indigo:      '#1a0050',
          violet:      '#6c00b3',
          ash:         '#3a3a3a',
          mist:        'rgba(242,234,216,0.08)',
        },
      },

      /* ----------------------------------------
         SPACING — dramatic scale for layouts
      ---------------------------------------- */
      spacing: {
        '18':  '4.5rem',
        '72':  '18rem',
        '80':  '20rem',
        '96':  '24rem',
        '128': '32rem',
        '160': '40rem',
        '200': '50rem',
      },

      /* ----------------------------------------
         FONT SIZES — fluid / vw-based display
      ---------------------------------------- */
      fontSize: {
        'hero':       ['clamp(8rem, 18vw, 22vw)',   { lineHeight: '0.88' }],
        'display':    ['clamp(4rem, 10vw, 14vw)',   { lineHeight: '0.9'  }],
        'section':    ['clamp(3rem, 6vw, 10vw)',    { lineHeight: '0.95' }],
        'card-title': ['clamp(2.5rem, 4vw, 4rem)',  { lineHeight: '1'    }],
      },

      /* ----------------------------------------
         KEYFRAMES (Tailwind-usable variants)
      ---------------------------------------- */
      keyframes: {
        'ink-drip-fall': {
          '0%':   { height: '0',    opacity: '0',   transform: 'translateX(-50%) scaleY(0)' },
          '15%':  { opacity: '1' },
          '55%':  { height: '28px', opacity: '1',   transform: 'translateX(-50%) scaleY(1)' },
          '78%':  { transform: 'translateX(-50%) scaleY(1) translateY(8px)' },
          '92%':  { height: '2px',  opacity: '0.2', transform: 'translateX(-50%) scaleY(0.3) translateY(24px)' },
          '100%': { height: '0',    opacity: '0',   transform: 'translateX(-50%) scaleY(0)' },
        },
        'ink-reveal-expand': {
          from: { clipPath: 'inset(0 50% 0 50%)', opacity: '0' },
          to:   { clipPath: 'inset(0 0% 0 0%)',   opacity: '1' },
        },
        'ink-glitch-shift': {
          '0%, 100%': { textShadow: '-2px 0 #99ca45, 2px 0 #00c4cc' },
          '33%':       { textShadow:  '2px 0 #99ca45, -2px 0 #00c4cc' },
          '66%':       { textShadow: '-1px 2px #c0392b, 1px -2px #00c4cc' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(153,202,69,0.3)' },
          '50%':       { boxShadow: '0 0 20px rgba(153,202,69,0.7)' },
        },
      },
      animation: {
        'ink-drip':    'ink-drip-fall 4s ease-in-out infinite',
        'ink-reveal':  'ink-reveal-expand 0.9s cubic-bezier(0.76, 0, 0.24, 1) forwards',
        'ink-glitch':  'ink-glitch-shift 0.35s steps(4) infinite',
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite',
      },

      /* ----------------------------------------
         TRANSITIONS
      ---------------------------------------- */
      transitionTimingFunction: {
        'ink': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}

export default config
