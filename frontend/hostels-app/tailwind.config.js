/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
         colors: {
        purpleOverlay: 'rgba(106, 27, 154, 0.9)',
        tealOverlay: 'rgba(38, 166, 154, 0.8)',
      },
    },
  },
  plugins: [],
}

