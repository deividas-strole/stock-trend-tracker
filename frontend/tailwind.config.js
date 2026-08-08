/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0B0F14",
          900: "#0F151C",
          800: "#121821",
          700: "#1A222D",
          600: "#232B36",
          500: "#3A4552",
        },
        ink: {
          100: "#E7ECF2",
          300: "#AEB9C4",
          500: "#7C8896",
        },
        bull: {
          DEFAULT: "#2BB3A3",
          soft: "#173B37",
        },
        bear: {
          DEFAULT: "#E0554F",
          soft: "#3A1F1E",
        },
        signal: {
          DEFAULT: "#6C8EF5",
          soft: "#1E2440",
        },
        amber: {
          DEFAULT: "#E0A339",
          soft: "#3A2E14",
        },
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}

