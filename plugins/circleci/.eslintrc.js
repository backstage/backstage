module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  rules: {
    'no-use-before-define': ['error', { variables: false }],
  },
};
