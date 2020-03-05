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
  // Adding this to .eslintignore just doesn't even, let me know if you can make it work ._.
  ignorePatterns: ['**/*_pb.js', '**/*_pb.d.ts'],
};
