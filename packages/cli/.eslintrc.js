module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  ignorePatterns: ['templates/**'],
  rules: {
    'no-console': 0,
  },
});
