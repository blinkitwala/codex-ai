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
        codex: {
          bg: '#05070c',
          card: 'rgba(15, 20, 32, 0.65)',
          gold: '#e2b540',
          cyan: '#00f2fe',
          purple: '#9d4edd',
          darkBlue: '#0b1329',
          accent: '#d4af37'
        }
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 30%, rgba(226, 181, 64, 0.15) 0%, rgba(11, 19, 41, 0.8) 50%, rgba(5, 7, 12, 1) 100%)',
        'orb-gradient': 'linear-gradient(135deg, #ff4500, #ff8c00, #ffee00, #00ff66, #00ffff, #0066ff, #9900ff, #ff00cc)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'orb-rotate': 'orbRotate 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(226, 181, 64, 0.6))' },
          '50%': { transform: 'scale(1.06)', opacity: '1', filter: 'drop-shadow(0 0 45px rgba(0, 242, 254, 0.8))' },
        },
        orbRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
