import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f5ff',
          100: '#dce7ff',
          200: '#b8ceff',
          300: '#8cb4ff',
          400: '#5f96ff',
          500: '#3d78ff',
          600: '#2c5de6',
          700: '#2449b3',
          800: '#1e3b8a',
          900: '#1c3570',
        },
      },
    },
  },
} satisfies Config;
