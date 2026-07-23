// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          50:  '#f7f7f8',
          200: '#e3e4e8',
          300: '#c9cbd2',
          400: '#9a9ca8',
          500: '#6b6d7a',
          700: '#3a3c47',
          800: '#26272f',
          900: '#18191f',
          950: '#0e0f13',
        },
        brand: {
          200: '#bcd4ff',
          300: '#8fb8ff',
          400: '#5c96ff',
          500: '#3b7bff',
          600: '#2563eb',
          700: '#1d4fc4',
          800: '#1a3f9c',
          900: '#17337a',
        },
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};