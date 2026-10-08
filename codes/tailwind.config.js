/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          dark: '#1b1b1e',
          surface: '#373f51',
          primary: '#58a4b0',
          secondary: '#a9bcd0',
          light: '#d8dbe2',
        },
        brand: {
          50: '#f2f6f7',
          100: '#deeaed',
          200: '#bfdbe0',
          300: '#8dc2cc',
          400: '#58a4b0', // User Palette Accent
          500: '#438894',
          600: '#39707b',
          700: '#335c65',
          800: '#2e4d55',
          900: '#294249',
          950: '#172b31',
        },
        clinical: {
          dark: '#1b1b1e',     // User Palette Dark Base
          card: '#222834',     // Elevated Card Base
          surface: '#373f51',  // User Palette Surface
          border: '#373f51',   // User Palette Border
          cyan: '#58a4b0',     // User Palette Teal/Cyan Accent
          teal: '#58a4b0',     // User Palette Teal Accent
          accent: '#58a4b0',   // User Palette Primary
          subtle: '#a9bcd0',   // User Palette Soft Blue / Muted
          light: '#d8dbe2',    // User Palette Light Foreground
          powder: '#a9bcd0',   // User Palette Powder Blue
          emerald: '#4eae8c',
          amber: '#d99b4d',
          crimson: '#d45d6a',
          indigo: '#6d88b4',
          slate: '#373f51'
        },
        dark: {
          bg: '#1b1b1e',
          card: '#222834',
          surface: '#373f51',
          border: '#454f66',
          muted: '#a9bcd0'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(88, 164, 176, 0.45)',
        'glow-teal': '0 0 25px -5px rgba(88, 164, 176, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(169, 188, 208, 0.45)',
        'glow-emerald': '0 0 25px -5px rgba(78, 174, 140, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(109, 136, 180, 0.4)',
        'glow-amber': '0 0 25px -5px rgba(217, 155, 77, 0.4)',
        'glow-rose': '0 0 25px -5px rgba(212, 93, 106, 0.4)',
        'clinical': '0 4px 20px -2px rgba(27, 27, 30, 0.6), 0 0 0 1px rgba(169, 188, 208, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'ecg': 'ecgScan 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        ecgScan: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' }
        }
      }
    },
  },
  plugins: [],
}
