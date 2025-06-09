// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    // add any other places you use Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        diary: ["'Indie Flower'", "cursive"],
      },
    },
  },
  plugins: [],
};
