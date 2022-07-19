module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  rules: {
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['expect', 'request.**.expect'],
      },
    ],
  },
});
