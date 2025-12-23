/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030303",
        foreground: "#ffffff",
        card: {
          DEFAULT: "rgba(18, 18, 18, 0.7)",
          foreground: "#ffffff",
          border: "rgba(255, 255, 255, 0.1)",
        },
        primary: {
          DEFAULT: "#facc15", // Yellow-400
          foreground: "#000000",
          soft: "rgba(250, 204, 21, 0.15)",
        },
        accent: {
          DEFAULT: "#fbbf24", // Amber-400
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "#1f1f1f",
          foreground: "#a1a1aa",
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}