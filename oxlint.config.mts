/*
 * Copyright 2025 The Backstage Authors
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

import { defineBackstageConfig } from '@backstage/cli-module-oxlint/defineBackstageConfig';

export default await defineBackstageConfig({
  rules: {
    'backstage/notice': 'error',
    'backstage/no-bare-to-lower-case': 'error',
    'backstage/no-bare-to-upper-case': 'error',
    'backstage/no-react-default-import': 'warn',
    'backstage/no-winston-default-import': 'warn',
    'backstage/no-dirname-in-src': 'warn',
  },

  ignorePatterns: [
    '**/dist/**',
    '**/dist-types/**',
    '**/node_modules/**',
    '**/*.generated.*',
    '**/coverage/**',
    '**/__fixtures__/**',
    '**/templates/**',
    '**/sample-templates/**',
    '**/static/**',
    '**/config/**',
  ],

  overrides: [
    {
      files: ['**/*.stories.tsx', '**/*.stories.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
});
