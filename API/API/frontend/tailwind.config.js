/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        /* Palette Base Directa */
        snow: '#F8F9F8',
        lavender: '#DEE5FF',
        wisteria: '#7E9BED',
        golden: '#FED139',
        navy: '#080067',

        /* Mapeo Semántico dinámico (utiliza las variables CSS de index.css) */
        main: 'var(--bg-main)',
        card: 'var(--bg-card)',
        input: 'var(--bg-input)',
        border: 'var(--border-color)',
        
        /* Texto */
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        
        /* Acentos */
        accent: {
          DEFAULT: 'var(--accent-primary)',
          highlight: 'var(--accent-highlight)',
        }
      },
    },
  },
  plugins: [],
}