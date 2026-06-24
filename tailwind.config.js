/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        liverpool: {
          yellow: '#FFD600',
          'yellow-dark': '#E6C000',
          black: '#111111',
          gray: '#F5F5F5',
          'gray-mid': '#E0E0E0',
          'gray-text': '#6B6B6B',
        },
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
}
