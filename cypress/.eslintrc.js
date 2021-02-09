module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint.backend')],
  rules: {
    'no-console': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
        bundledDependencies: false,
      },
    ],
  },

  overrides: [
    {
      files: ['**/cypress/integration/**'],
      rules: {
        'jest/expect-expect': 'off',
      },
    },
    {
      files: ['src/commands/cypress.ts'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
  ],
};
