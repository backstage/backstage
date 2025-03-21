module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  ignorePatterns: ['sample-templates/'],
  restrictedSrcImports: [
    {
      name: 'path',
      importNames: ['resolve'],
      message:
        'Do not use path.resolve, use `resolveSafeChildPath` from `@backstage/backend-common` instead as it prevents security issues',
    },
  ],
  restrictedSrcSyntax: [
    {
      message:
        'Do not use path.resolve, use `resolveSafeChildPath` from `@backstage/backend-common` instead as it prevents security issues',
      selector: 'MemberExpression[object.name="path"][property.name="resolve"]',
    },
  ],
});
