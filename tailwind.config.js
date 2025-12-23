/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFFF00',
        'brand-black': '#000000',
        'brand-dark': '#0A0A0A',
        'brand-gray': '#1A1A1A',
        'brand-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'sharp': '4px 4px 0px 0px #FFFF00',
        'sharp-white': '4px 4px 0px 0px #FFFFFF',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}