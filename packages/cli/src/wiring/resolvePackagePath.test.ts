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
import fs from 'node:fs';

const { resolvePackagePath } = require('../../config/resolvePackagePath.cjs');

describe('resolvePackagePath', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  it('requires the owner or aggregate of a legacy forwarding path to be installed directly', () => {
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'example-root' }),
      node_modules: {
        '@backstage': {
          'cli-module-test-jest': {
            'package.json': JSON.stringify({
              name: '@backstage/cli-module-test-jest',
              main: 'index.js',
            }),
            'index.js': 'module.exports = {};',
            config: { 'jest.js': 'module.exports = {}; ' },
          },
        },
      },
    });
    const targetPaths = overrideTargetPaths(mockDir.path);

    expect(() =>
      resolvePackagePath(
        '@backstage/cli-module-test-jest/config/jest',
        '@backstage/cli-module-test-jest',
        '@backstage/cli/config/jest',
      ),
    ).toThrow(
      'The legacy "@backstage/cli/config/jest" path requires "@backstage/cli-module-test-jest" or "@backstage/cli-defaults" to be installed directly',
    );
    targetPaths.restore();
  });

  it('resolves the owning package from the target repository', () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'example-root',
        devDependencies: {
          '@backstage/cli-module-test-jest': '1.0.0',
        },
      }),
      node_modules: {
        '@backstage': {
          'cli-module-test-jest': {
            'package.json': JSON.stringify({
              name: '@backstage/cli-module-test-jest',
              main: 'index.js',
            }),
            'index.js': 'module.exports = {};',
            config: { 'jest.js': 'module.exports = {}; ' },
          },
        },
      },
    });
    const targetPaths = overrideTargetPaths(mockDir.path);

    expect(
      resolvePackagePath(
        '@backstage/cli-module-test-jest/config/jest',
        '@backstage/cli-module-test-jest',
        '@backstage/cli/config/jest',
      ),
    ).toBe(
      fs.realpathSync(
        mockDir.resolve(
          'node_modules/@backstage/cli-module-test-jest/config/jest.js',
        ),
      ),
    );
    targetPaths.restore();
  });

  it('resolves the owning package through an explicitly installed aggregate', () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'example-root',
        devDependencies: {
          '@backstage/cli-defaults': '1.0.0',
        },
      }),
      node_modules: {
        '@backstage': {
          'cli-defaults': {
            'package.json': JSON.stringify({
              name: '@backstage/cli-defaults',
              main: 'index.js',
              dependencies: {
                '@backstage/cli-module-test-jest': '1.0.0',
              },
            }),
            'index.js': 'module.exports = [];',
            node_modules: {
              '@backstage': {
                'cli-module-test-jest': {
                  'package.json': JSON.stringify({
                    name: '@backstage/cli-module-test-jest',
                    main: 'index.js',
                  }),
                  'index.js': 'module.exports = {};',
                  config: { 'jest.js': 'module.exports = {}; ' },
                },
              },
            },
          },
        },
      },
    });
    const targetPaths = overrideTargetPaths(mockDir.path);

    expect(
      resolvePackagePath(
        '@backstage/cli-module-test-jest/config/jest',
        '@backstage/cli-module-test-jest',
        '@backstage/cli/config/jest',
      ),
    ).toBe(
      fs.realpathSync(
        mockDir.resolve(
          'node_modules/@backstage/cli-defaults/node_modules/@backstage/cli-module-test-jest/config/jest.js',
        ),
      ),
    );
    targetPaths.restore();
  });
});
