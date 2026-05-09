/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          red: '#ff3355',
          green: '#3cff8f',
          yellow: '#ffd54a',
        },
        ssp: {
          bg: '#ffffff',
          panel: '#ffffff',
          green: '#2563eb',
          purple: '#ffffff',
          pink: '#2563eb',
          blue: '#ffffff',
        },
      },
      fontFamily: {
        neon: ['"Audiowide"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-red': '0 0 24px rgba(255, 51, 85, 0.75)',
        'neon-green': '0 0 24px rgba(60, 255, 143, 0.75)',
      },
    },
  },
  plugins: [],
}


