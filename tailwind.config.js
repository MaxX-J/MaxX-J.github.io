/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#FF8233',
          300: '#FDAC55',
          accent: '#F16524',
          'menu-start': '#FF6B1A',
          'menu-end': '#FF9642',
        },
        encre: '#1F140D',
      },
      fontFamily: {
        display: ['Kanit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
