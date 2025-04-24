/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700', // Dark Blue
        secondary: '#002147', // Emerald Green
        accent: '#005CFF', // Amber
        background: '#F9FAFB', // Light Gray
        text: '#002147', // Dark Gray005CFF
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: '2.5rem', // 40px
        h2: '1.875rem', // 30px
        body: '1rem', // 16px
        small: '0.875rem', // 14px
      },
    },
  },
  plugins: [],
} 