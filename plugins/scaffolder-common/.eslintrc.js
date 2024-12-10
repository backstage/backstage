module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  overrides: [
    {
      files: ['client/src/schema/openapi/generated/models/*.model.ts'],
      rules: {
        '@typescript-eslint/no-redeclare': 'off',
      },
    },
  ],
});
