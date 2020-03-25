const path = require('path');
const base = require('@backstage/cli/config/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'notice/notice': [
      'error',
      {
        templateFile: path.resolve(__dirname, 'scripts/copyright.js'),
      },
    ],
  },
};
