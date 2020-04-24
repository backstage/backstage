module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  ignorePatterns: ['templates/**'],
  rules: {
    'no-console': 0,
  },
};
