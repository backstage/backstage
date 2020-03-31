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
    // TODO: add prop types to JS and remove
    'react/prop-types': 0,
    'jest/expect-expect': 0,
  },
};
