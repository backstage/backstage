const base = require('@backstage/cli/config/eslint');
const [, baseRestrictedImports] = base.rules['no-restricted-imports'];

module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  rules: {
    // TODO: add prop types to JS and remove
    'react/prop-types': 0,
    'jest/expect-expect': 0,
    'no-restricted-imports': [
      2,
      {
        ...baseRestrictedImports,
        paths: [
          {
            // Importing the entire MUI icons packages kills build performance as the list of icons is huge.
            name: '@material-ui/core',
            message: "Please import '@material-ui/core/...' instead.",
          },
          ...baseRestrictedImports.paths,
        ],
      },
    ],
  },
};
