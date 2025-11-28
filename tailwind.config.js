/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316', // Orange-500
          600: '#ea580c', // Orange-600
          700: '#c2410c',
        }
      },
      screens: {
        'xs': '375px',
      }
    },
  },
  plugins: [],
}