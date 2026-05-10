/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e0f2fe',
          500: '#67e8f9',
          600: '#22d3ee',
        },
        dark: {
          900: '#0a0a1f',
          800: '#0f0f23',
          700: '#1a1a2e',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'neon': '0 0 20px rgba(103, 232, 249, 0.5)',
        'premium': '0 25px 50px -12px rgb(0 0 0 / 0.4)',
      },
      animation: {
        'float': 'float 25s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, 40px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(103, 232, 249, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(103, 232, 249, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
