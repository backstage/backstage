module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'react/prop-types': 1,
      },
    },
  ],
});
