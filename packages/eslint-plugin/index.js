/*
 * Copyright 2023 The Backstage Authors
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

module.exports = {
  configs: {
    recommended: {
      plugins: ['@backstage'],
      rules: {
        '@backstage/no-forbidden-package-imports': 'error',
        '@backstage/no-relative-monorepo-imports': 'error',
        '@backstage/no-undeclared-imports': 'error',
      },
    },
  },
  rules: {
    'no-forbidden-package-imports': require('./rules/no-forbidden-package-imports'),
    'no-relative-monorepo-imports': require('./rules/no-relative-monorepo-imports'),
    'no-undeclared-imports': require('./rules/no-undeclared-imports'),
    'no-top-level-material-ui-4-imports': require('./rules/no-top-level-material-ui-4-imports'),
  },
};
