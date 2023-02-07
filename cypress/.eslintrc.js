module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint.backend')],
  rules: {
    'no-console': 0,
    'jest/valid-expect': 'off',
    'jest/expect-expect': 'off',
    'no-restricted-syntax': 'off',
  },
};
