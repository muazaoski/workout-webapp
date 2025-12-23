/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        punk: {
          black: '#000000',
          dark: '#0A0A0A',
          gray: '#1A1A1A',
          white: '#FFFFFF',
          yellow: '#FFFF00',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        punk: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        white: '4px 4px 0px 0px #FFFFFF',
        yellow: '4px 4px 0px 0px #FFFF00',
      },
    },
  },
  plugins: [],
};