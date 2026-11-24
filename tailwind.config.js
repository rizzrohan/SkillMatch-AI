/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E0F14',
          50: '#1E1F27',
          100: '#17181F',
          200: '#1E1F27',
          300: '#262832',
          400: '#2E3039',
        },
        cream: {
          DEFAULT: '#F2F0EB',
          100: '#F2F0EB',
          200: '#D9D6CE',
        },
        muted: {
          DEFAULT: '#8B8A94',
          light: '#A4A3AC',
          dark: '#6B6A74',
        },
        brass: {
          DEFAULT: '#D89B4A',
          50: '#F4E6CE',
          100: '#E8C084',
          200: '#D89B4A',
          300: '#B8822F',
          400: '#8F6320',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.4s ease-out both',
        'draw-line': 'draw-line 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
