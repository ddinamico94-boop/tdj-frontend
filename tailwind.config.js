/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#1CDFE8',
          soft: 'rgba(28,223,232,0.12)',
        },
        pink: {
          DEFAULT: '#FF8AD1',
          soft: 'rgba(255,138,209,0.12)',
        },
        ink: {
          DEFAULT: '#14161C',
          soft: '#4A4E5A',
        },
        line: '#E7E9EE',
        bg: '#FAFBFC',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1CDFE8, #FF8AD1)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(28,223,232,0.12), rgba(255,138,209,0.12))',
      },
      borderRadius: {
        card: '18px',
      },
    },
  },
  plugins: [],
}
