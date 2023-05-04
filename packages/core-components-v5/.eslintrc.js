module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  plugins: ['tss-unused-classes'],
  rules: {
    'jest/expect-expect': 0,
    'tss-unused-classes/unused-classes': 'warn',
  },
  restrictedImports: [
    {
      name: '@mui/material',
      message: "Please import '@mui/material/...' instead.",
    },
  ],
});
