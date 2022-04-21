module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  rules: {
    'jest/expect-expect': 0,
  },
  restrictedImports: [
    {
      name: '@material-ui/core',
      message: "Please import '@material-ui/core/...' instead.",
    },
  ],
});
