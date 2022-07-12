module.exports = {
  content: ["apps/web/index.html", "apps/web/src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        iaQuattro: ["iA Quattro", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
