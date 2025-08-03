/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#606c38',
          50: '#f4f6f0',
          100: '#e8eddc',
          200: '#d2dcbc',
          300: '#b8c894',
          400: '#9db36e',
          500: '#606c38',
          600: '#4f5a2d',
          700: '#3f4824',
          800: '#32381c',
          900: '#283018',
        },
        secondary: {
          DEFAULT: '#dda15e',
          50: '#fdf8f1',
          100: '#faeede',
          200: '#f3d9b8',
          300: '#eac188',
          400: '#dda15e',
          500: '#d18b45',
          600: '#c47439',
          700: '#a35c2f',
          800: '#844a2a',
          900: '#6c3d25',
        },
        accent: {
          DEFAULT: '#bc6c25',
          50: '#fdf6f0',
          100: '#faebdc',
          200: '#f3d4b4',
          300: '#eab882',
          400: '#df954e',
          500: '#bc6c25',
          600: '#a85a21',
          700: '#8b481e',
          800: '#71391e',
          900: '#5d2f1b',
        },
        surface: {
          DEFAULT: '#fefae0',
          50: '#fefae0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        dark: {
          DEFAULT: '#283618',
          50: '#f2f4f0',
          100: '#e3e8dc',
          200: '#c8d2bc',
          300: '#a6b693',
          400: '#85996e',
          500: '#6b7d54',
          600: '#546243',
          700: '#444f37',
          800: '#394030',
          900: '#283618',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'airbnb': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'airbnb-lg': '0 8px 28px rgba(0, 0, 0, 0.28)',
      }
    },
  },
  plugins: [],
}