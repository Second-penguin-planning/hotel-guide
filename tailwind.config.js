export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2fb',
          100: '#d4def5',
          200: '#a9bdeb',
          300: '#7e9be0',
          400: '#5379d5',
          500: '#2857c9',
          600: '#1B3A7A',
          700: '#152e61',
          800: '#0f2248',
          900: '#091630',
        },
        accent: {
          400: '#f46b6b',
          500: '#e03030',
          600: '#c42828',
        },
        gold: {
          400: '#d4a843',
          500: '#b8912a',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hotel-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    }
  },
  plugins: []
}
