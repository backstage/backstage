module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint.backend')],
  rules: {
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['expect', 'request.**.expect'],
      },
    ],
  },
};
