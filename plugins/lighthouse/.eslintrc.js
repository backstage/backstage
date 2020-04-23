module.exports = {
  plugins: [
  "react-hooks"
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  },
  extends: [require.resolve('@backstage/cli/config/eslint.js')],
};
