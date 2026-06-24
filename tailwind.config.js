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
          magenta: '#E21F8F',
          'magenta-dark': '#C01A7A',
          rosa: '#E888B8',
          'rosa-light': '#F7D5EA',
          naranja: '#F3702C',
          morado: '#79256F',
          'morado-dark': '#5E1B55',
        },
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
}
