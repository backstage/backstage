/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require('path');

module.exports = {
  root: true,
  plugins: ['notice'],
  rules: {
    'notice/notice': [
      'error',
      {
        // eslint-disable-next-line no-restricted-syntax
        templateFile: path.resolve(__dirname, './scripts/copyright-header.txt'),
        templateVars: {
          NAME: 'The Backstage Authors',
        },
        varRegexps: {
          NAME: /(The Backstage Authors)|(Spotify AB)/,
        },
        onNonMatchingHeader: 'replace',
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        message:
          "Avoid using .toLowerCase(), use .toLocaleLowerCase('en-US') instead. " +
          'This rule can sometimes be ignored when converting text to be displayed to the user.',
        selector:
          "CallExpression[arguments.length=0] > MemberExpression[property.name='toLowerCase']",
      },
      {
        message:
          "Avoid using .toUpperCase(), use .toLocaleUpperCase('en-US') instead. " +
          'This rule can sometimes be ignored when converting text to be displayed to the user.',
        selector:
          "CallExpression[arguments.length=0] > MemberExpression[property.name='toUpperCase']",
      },
    ],
  },
};
