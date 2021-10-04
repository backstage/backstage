module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'react/prop-types': 1,
      },
    },
  ],
};
