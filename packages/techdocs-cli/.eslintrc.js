module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'no-restricted-imports': 0,
      },
    },
  ],
};
