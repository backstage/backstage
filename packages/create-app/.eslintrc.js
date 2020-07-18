module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint.backend')],
  ignorePatterns: ['templates/**'],
  rules: {
    'no-console': 0,
  },
};
