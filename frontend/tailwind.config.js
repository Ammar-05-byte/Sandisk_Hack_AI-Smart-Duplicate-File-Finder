/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        void: '#080C12',
        panel: '#0E1520',
        border: '#1A2535',
        accent: '#00F5C4',
        warn: '#FF6B2B',
        info: '#4D9EFF',
        muted: '#3D5066',
        text: '#C8D6E5',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,245,196,0.15)',
        'glow-warn': '0 0 20px rgba(255,107,43,0.2)',
        'glow-info': '0 0 20px rgba(77,158,255,0.15)',
      },
    },
  },
  plugins: [],
}
