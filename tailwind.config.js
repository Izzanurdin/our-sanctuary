/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0508",
        surface: "rgba(255, 255, 255, 0.05)",
        primary: {
          light: "#fbcfe8",
          DEFAULT: "#f472b6",
          dark: "#be185d",
        },
        accent: "#fda4af",
      },
    },
  },
  plugins: [],
}