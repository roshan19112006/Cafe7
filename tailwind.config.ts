import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          950: '#07080b',
          900: '#0e1017',
          850: '#141721',
          800: '#1a1e2b',
          700: '#262c3f',
          600: '#38415c',
          gold: {
            DEFAULT: '#f3b73e',
            light: '#fbd374',
            dark: '#c78d1e',
            subtle: 'rgba(243, 183, 62, 0.12)',
          },
          amber: '#fb923c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(243, 183, 62, 0.25)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'scale-up': 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
