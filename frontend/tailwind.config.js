/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0E14",
        panel: "rgba(19, 23, 34, 0.55)",
        cyan: "#00F2FE",
        purple: "#8A2387",
        dormant: "#5B6472",
        gap: "#FF5D73",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
