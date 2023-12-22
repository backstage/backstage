module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  rules: {
    '@backstage/no-top-level-mui4-imports': 'error',
  },
});
