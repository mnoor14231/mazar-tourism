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
        // Mazar Green Palette
        primary: {
          50: '#e8f5f0',
          100: '#d1ebe1',
          200: '#a3d7c3',
          300: '#5fb894',
          400: '#307C5F',
          500: '#195B4A',
          600: '#0D3B2F',
          700: '#0B2F29',
          800: '#092520',
          900: '#071a17',
        },
        // Gold/Accent Palette
        accent: {
          50: '#faf6f0',
          100: '#f5ede1',
          200: '#DBC8A8',
          300: '#B69D6D',
          400: '#9D7D4E',
          500: '#694F2E',
          600: '#5a4327',
          700: '#4a3720',
          800: '#3b2c19',
          900: '#2c2113',
        },
        // Dark Teal Palette
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
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

