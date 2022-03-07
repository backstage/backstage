module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  ignorePatterns: ['sample-templates/'],
  rules: {
    'no-console': 0,
    'new-cap': [
      'error',
      {
        capIsNew: false,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'path',
            importNames: ['resolve'],
            message:
              'Do not use path.resolve, use `resolveSafeChildPath` from `@backstage/backend-common` instead as it prevents security issues',
          },
        ],
        patterns: ['**/../../**/*/src/**', '**/../../**/*/src'],
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        message:
          'Default import from winston is not allowed, import `* as winston` instead.',
        selector:
          'ImportDeclaration[source.value="winston"] ImportDefaultSpecifier',
      },
      {
        message:
          "`__dirname` doesn't refer to the same dir in production builds, try `resolvePackagePath()` from `@backstage/backend-common` instead.",
        selector: 'Identifier[name="__dirname"]',
      },
      {
        message:
          'Do not use path.resolve, use `resolveSafeChildPath` from `@backstage/backend-common` instead as it prevents security issues',
        selector:
          'MemberExpression[object.name="path"][property.name="resolve"]',
      },
    ],
  },
  overrides: [
    {
      files: ['*.test.*', 'src/setupTests.*', 'dev/**'],
      rules: {
        'no-restricted-imports': [
          2,
          {
            patterns: ['**/../../**/*/src/**', '**/../../**/*/src'],
          },
        ],
      },
    },
  ],
});
