/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        '2xs': '314px',
      },
    },
  },
  plugins: [],
}

