/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        's' : '560px',
        '2s' : '440px',
        'xs': '375px',
        '2xs': '314px',
      },
    },
  },
  plugins: [],
}

