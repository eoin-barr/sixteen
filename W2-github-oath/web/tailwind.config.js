/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple1: '#181621',
        purple2: '#7c3fc7',
        purple3: '#9e6add',
        purple4: '#2b273b',
      },
      backgroundColor: (theme) => theme('colors'),
    },
  },
  plugins: [],
};
