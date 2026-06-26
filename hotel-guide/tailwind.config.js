/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fef3ee',
          100: '#fde3d0',
          200: '#fbc3a0',
          300: '#f89b66',
          400: '#f4693a',
          500: '#f14920',
          600: '#e22d12',
          700: '#bb1f11',
          800: '#941b16',
          900: '#771a15',
          950: '#400a08',
        },
      },
    },
  },
  plugins: [],
}
