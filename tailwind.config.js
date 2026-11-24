/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10132B',
        navy: '#1B2044',
        purple: '#7865FF',
        purpleSoft: '#EFEDFF',
        pink: '#FF6DA9',
        mint: '#E8F4F3',
        paper: '#F6F7FB',
        line: '#E8E9F1',
        muted: '#747992',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 55px rgba(23,26,59,0.07)',
        card: '0 8px 25px rgba(23,26,59,0.04)',
      },
      borderRadius: { xl2: '20px' },
    },
  },
  plugins: [],
}
