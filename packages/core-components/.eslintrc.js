module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  rules: {
    'jest/expect-expect': 0,
    '@backstage/no-top-level-material-ui-4-imports': 'error',
  },
  restrictedImports: [
    {
      name: '@backstage/core-components',
      message: "To avoid circular dependencies, use relative paths to import '@backstage/core-components' from its subdirectories."
    },
    {
      name: '@material-ui/core',
      message: "Please import '@material-ui/core/...' instead.",
    },
  ],
});
