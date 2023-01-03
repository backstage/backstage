module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint.backend')],
  rules: {
    "no-else-return": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-shadow": "off",
    "prefer-const": "off",
  }
};
