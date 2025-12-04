import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Visual Identity Guide Colors
        foreground: '#153D33', // Foreground Green
        background: '#FAF8F5', // Background
        
        // Mazar Green Palette (From Visual Identity)
        primary: {
          DEFAULT: '#1A4D40', // Primary Dark Green
          50: '#e8f5f0',
          100: '#d1ebe1',
          200: '#a3d7c3',
          300: '#5fb894',
          400: '#307C5F',
          500: '#195B4A', // Button Normal State
          600: '#1A4D40', // Primary
          700: '#0B2F29', // Button Hover State
          800: '#092520',
          900: '#001A15', // Button Active State
          light: '#3D7A6B', // Green Light
        },
        
        // Gold/Accent Palette (From Visual Identity)
        accent: {
          DEFAULT: '#B89D6D', // Gold Accent
          50: '#faf6f0',
          100: '#f5ede1',
          200: '#DBC8A8',
          300: '#B89D6D', // Main Gold
          400: '#9D7D4E',
          500: '#694F2E',
          600: '#5a4327',
          700: '#4a3720',
          800: '#3b2c19',
          900: '#2c2113',
        },
        
        // Secondary Colors (From Visual Identity)
        secondary: '#F5F3EF', // Secondary
        muted: '#EBE8E1', // Muted
        border: '#DDDDDD', // Border
        
        // Dark Teal Palette (Keep existing)
        dark: {
          50: '#f5f6f7',
          100: '#e5e7e8',
          200: '#c8ccce',
          300: '#9ea4a7',
          400: '#6C7475',
          500: '#3C3F42',
          600: '#262B2F',
          700: '#1a1e21',
          800: '#0A1118',
          900: '#050a0d',
        },
        
        // Button States (From Visual Identity)
        button: {
          normal: '#195B4A',
          hover: '#0B2F29',
          active: '#001A15',
        },
      },
      fontFamily: {
        arabic: ['Tajawal', 'Cairo', 'sans-serif'],
        english: ['Playfair Display', 'serif'],
        sans: ['Tajawal', 'Cairo', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        '2xl': '64px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
}
export default config

