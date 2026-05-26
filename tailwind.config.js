/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          dark: "#07080d",
          cardBack: "#121424",
          cardBackHover: "#1c1f36",
          neonCyan: "#00f0ff",
          neonPurple: "#bd00ff",
          neonGold: "#ffb800",
          neonRed: "#ff0055",
          neonGreen: "#39ff14",
        }
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
        'flash-red': 'flashRed 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        flashRed: {
          '0%': { backgroundColor: 'rgba(255, 0, 85, 0)' },
          '100%': { backgroundColor: 'rgba(255, 0, 85, 0.25)' },
        }
      }
    },
  },
  plugins: [],
}
