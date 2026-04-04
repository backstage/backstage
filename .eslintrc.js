/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  rules: {
    'no-warning-comments': ['error', { terms: ['FIXME'], location: 'start' }],
  },
};
