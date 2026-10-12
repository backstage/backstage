module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  rules: {
    'testing-library/prefer-screen-queries': 'error',
    '@backstage/no-top-level-material-ui-4-imports': 'error',
  },
});
