module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
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
});
