import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005CFF',
        secondary: '#002147',
        accent: '#FFD700',
        success: {
          light: '#EBF5FF', // Light blue background
          DEFAULT: '#005CFF', // Using our primary blue for success
          dark: '#003399', // Darker blue for text
        },
        text: {
          DEFAULT: '#1F2937',
          light: '#6B7280',
        },
      },
      fontSize: {
        h1: ['2.5rem', {
          lineHeight: '1.2',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }],
        h2: ['2rem', {
          lineHeight: '1.3',
          fontWeight: '700',
          letterSpacing: '-0.01em'
        }],
        h3: ['1.5rem', {
          lineHeight: '1.4',
          fontWeight: '600',
          letterSpacing: '-0.01em'
        }],
        h4: ['1.25rem', {
          lineHeight: '1.5',
          fontWeight: '600'
        }],
        body: ['1rem', {
          lineHeight: '1.6'
        }],
        small: ['0.875rem', {
          lineHeight: '1.5'
        }],
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-inter)'],
      },
      spacing: {
        container: '2rem',
        section: '4rem',
      },
      maxWidth: {
        container: '80rem', // 1280px
        content: '65ch',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1F2937',
            a: {
              color: '#005CFF',
              '&:hover': {
                color: '#003399',
              },
            },
            h1: {
              color: '#002147',
            },
            h2: {
              color: '#002147',
            },
            h3: {
              color: '#002147',
            },
            h4: {
              color: '#002147',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config 