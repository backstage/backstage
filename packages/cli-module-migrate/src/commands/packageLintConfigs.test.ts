/*
 * Copyright 2026 The Backstage Authors
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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { withLogCollector } from '@backstage/test-utils';
import packageLintConfigs from './packageLintConfigs';

jest.mock('@backstage/cli-common', () => ({
  ...jest.requireActual('@backstage/cli-common'),
  runOutput: jest.fn().mockResolvedValue(''),
}));

describe('migrate package-lint-configs', () => {
  const mockDir = createMockDirectory();

  beforeAll(() => overrideTargetPaths(mockDir.path));

  it('migrates configs that extend the config files of the project CLI', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({ workspaces: ['packages/*'] }),
      node_modules: {
        '@backstage': {
          cli: {
            'package.json': JSON.stringify({ name: '@backstage/cli' }),
            config: {
              'eslint.js': 'module.exports = {};',
              'eslint.backend.js': 'module.exports = {};',
            },
          },
        },
      },
      packages: {
        a: {
          'package.json': JSON.stringify({ name: 'a' }),
          '.eslintrc.js': `module.exports = {
            extends: [require.resolve('@backstage/cli/config/eslint.js')],
            rules: { 'no-console': 'off' },
          };`,
        },
        b: {
          'package.json': JSON.stringify({ name: 'b' }),
          '.eslintrc.js': `module.exports = {
            extends: [require.resolve('@backstage/cli/config/eslint.backend.js')],
          };`,
        },
      },
    });

    const { log } = await withLogCollector(['log'], () =>
      packageLintConfigs({ args: [], info: { usage: 'test', name: 'test' } }),
    );

    expect(log).toEqual([]);
    expect(mockDir.content({ path: 'packages/a' })?.['.eslintrc.js']).toBe(
      `module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, ${JSON.stringify(
        { rules: { 'no-console': 'off' } },
        null,
        2,
      )});\n`,
    );
    expect(mockDir.content({ path: 'packages/b' })?.['.eslintrc.js']).toBe(
      `module.exports = require('@backstage/cli/config/eslint-factory')(__dirname);\n`,
    );
  });
});
