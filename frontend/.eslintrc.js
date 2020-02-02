module.exports = {
  extends: [
    '@spotify/eslint-config-base',
    '@spotify/eslint-config-react',
    '@spotify/eslint-config-typescript',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
