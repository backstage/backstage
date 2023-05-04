module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  rules: {
    'jest/expect-expect': 0,
  },
  restrictedImports: [
    {
      name: '@mui/material',
      message: "Please import '@mui/material/...' instead.",
    },
  ],
});
