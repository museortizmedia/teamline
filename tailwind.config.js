/** @type {import('tailwindcss').Config} */

module.exports = {

  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {

      colors: {

        primary: "var(--color-primary)",

        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",

        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)"

      }

    }
  },

  plugins: [],

}