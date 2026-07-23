/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        incubyte: {
          bg: '#F2FAF4',
          card: '#FFFFFF',
          cardMint: '#F7FDF9',
          border: '#D1EFE0',
          forest: '#024738',
          forestDark: '#013328',
          lime: '#C0F762',
          limeHover: '#B2F348',
          limeSoft: '#E8FCC9',
          blueCard: '#52C5E4',
          darkCard: '#06211C',
          textDark: '#0A2B23',
          textMuted: '#47695F',
        },
        dark: {
          bg: '#06211C',
          card: '#0B2D27',
          cardHover: '#103831',
          border: 'rgba(209, 239, 224, 0.15)',
          subtle: 'rgba(209, 239, 224, 0.08)',
        },
        accent: {
          DEFAULT: '#024738',
          hover: '#013328',
          glow: 'rgba(2, 71, 56, 0.25)',
          lime: '#C0F762',
        },
        status: {
          success: '#059669',
          warning: '#D97706',
          error: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '18px',
        'xl': '14px',
      },
      boxShadow: {
        'incubyte': '0 10px 30px -5px rgba(2, 71, 56, 0.06), 0 2px 8px rgba(2, 71, 56, 0.04)',
        'incubyte-lg': '0 20px 40px -10px rgba(2, 71, 56, 0.12), 0 4px 12px rgba(2, 71, 56, 0.06)',
        'glow-lime': '0 0 25px -5px rgba(192, 247, 98, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};