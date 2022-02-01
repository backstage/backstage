module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  rules: {
    // Prefer to use rendered.getBy*, which will throw an error
    'jest/expect-expect': 0,
  },
};
