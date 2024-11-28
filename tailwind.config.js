/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#757575',
        accent: '#4CAF50'
      },
      borderRadius: {
        DEFAULT: '12px'
      }
    },
  },
  plugins: [],
}
