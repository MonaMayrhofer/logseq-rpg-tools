// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "var(--ls-primary-background-color)",
        // secondary: "var(--ls-secondary-background-color)",
        testme: "#ff00ff",
        "secondary-bg": "var(--ls-secondary-background-color)",
      },
    },
  },
  plugins: [],
};
