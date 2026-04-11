// Standalone ESLint config for the evals subfolder.
// root: true prevents ESLint from merging with packages/ui/.eslintrc.js,
// which requires plugins that are not needed here.
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: { node: true, es2022: true },
  rules: {},
};
