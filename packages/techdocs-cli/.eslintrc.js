module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'no-restricted-imports': 0,
      },
    },
  ],
});
