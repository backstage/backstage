const parent = require('@backstage/cli/config/eslint.backend');

module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint.backend')],
  ignorePatterns: ['sample-templates/'],
  rules: {
    'no-console': 0, // Permitted in console programs
    'new-cap': ['error', { capIsNew: false }], // Because Express constructs things e.g. like 'const r = express.Router()'
    // Usage of path.resolve is extra sensitive in the scaffolder, so forbid it in non-test code
    'no-restricted-imports': [
      'error',
      {
        ...parent.rules['no-restricted-imports'][1],
        paths: [
          {
            name: 'path',
            importNames: ['resolve'],
            message:
              'Do not use path.resolve, use `resolveSafeChildPath` from `@backstage/backend-common` instead as it prevents security issues',
          },
        ],
      },
    ],
    'no-restricted-syntax': parent.rules['no-restricted-syntax'].concat([
      {
        message:
          'Do not use path.resolve, use `resolveSafeChildPath` from `@backstage/backend-common` instead as it prevents security issues',
        selector:
          'MemberExpression[object.name="path"][property.name="resolve"]',
      },
    ]),
  },
  overrides: [
    {
      files: ['*.test.*', 'src/setupTests.*', 'dev/**'],
      rules: {
        'no-restricted-imports': parent.rules['no-restricted-imports'],
      },
    },
  ],
};
