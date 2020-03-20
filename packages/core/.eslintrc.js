module.exports = {
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        // TODO: add prop types and set to 1
        'react/prop-types': 0,
      },
    },
  ],
  rules: {
    'jest/expect-expect': 0,
  },
};
