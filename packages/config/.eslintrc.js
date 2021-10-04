module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  rules: {
    'jest/expect-expect': 0,
  },
};
