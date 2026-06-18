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

import {
  createMockDirectory,
  type MockDirectoryContent,
} from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { discoverCliModules } from './discoverCliModules';

describe('discoverCliModules', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  function setTargetRepository(options: {
    dependencies?: Record<string, string>;
    packages?: Record<
      string,
      { role?: string; main?: string; exports?: string }
    >;
  }) {
    const packageContent: MockDirectoryContent = {};
    for (const [name, pkg] of Object.entries(options.packages ?? {})) {
      const [scope, packageName] = name.split('/');
      const packageFiles = {
        'package.json': JSON.stringify({
          name,
          main: pkg.main ?? 'index.js',
          exports: pkg.exports,
          backstage: pkg.role ? { role: pkg.role } : undefined,
        }),
        'index.js': 'module.exports = [];',
      };
      packageContent[scope] = {
        ...(packageContent[scope] as MockDirectoryContent),
        [packageName]: packageFiles,
      };
    }

    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'example-root',
        workspaces: ['packages/*'],
        dependencies: options.dependencies,
      }),
      node_modules: packageContent,
    });
    return overrideTargetPaths(mockDir.path);
  }

  it('fails early when the target repository has no CLI modules', () => {
    const targetPaths = setTargetRepository({
      dependencies: { 'uninstalled-unrelated-package': '1.0.0' },
    });

    expect(() => discoverCliModules()).toThrow(
      'No CLI modules are installed in the target repository. Add "@backstage/cli-defaults" as a devDependency',
    );
    targetPaths.restore();
  });

  it('loads explicit modules from the target repository in deterministic order', () => {
    const targetPaths = setTargetRepository({
      dependencies: {
        '@example/strict-cli-module': '1.0.0',
        '@backstage/cli-defaults': '1.0.0',
      },
      packages: {
        '@example/strict-cli-module': {
          role: 'cli-module',
          exports: './index.js',
        },
        '@backstage/cli-defaults': { role: 'cli-module' },
      },
    });

    expect(discoverCliModules()).toEqual([
      {
        name: '@backstage/cli-defaults',
        path: pathToFileURL(
          fs.realpathSync(
            mockDir.resolve('node_modules/@backstage/cli-defaults/index.js'),
          ),
        ).href,
      },
      {
        name: '@example/strict-cli-module',
        path: pathToFileURL(
          fs.realpathSync(
            mockDir.resolve('node_modules/@example/strict-cli-module/index.js'),
          ),
        ).href,
      },
    ]);
    targetPaths.restore();
  });

  it('surfaces unresolvable and malformed explicit CLI modules', () => {
    let targetPaths = setTargetRepository({
      dependencies: { '@backstage/cli-module-missing': '1.0.0' },
    });
    expect(() => discoverCliModules()).toThrow(
      'Failed to resolve installed CLI module "@backstage/cli-module-missing" from the target repository',
    );
    targetPaths.restore();

    targetPaths = setTargetRepository({
      dependencies: { '@backstage/cli-module-broken': '1.0.0' },
      packages: {
        '@backstage/cli-module-broken': { role: 'node-library' },
      },
    });
    expect(() => discoverCliModules()).toThrow(
      'Installed CLI module "@backstage/cli-module-broken" is malformed',
    );
    targetPaths.restore();

    targetPaths = setTargetRepository({
      dependencies: { '@example/broken-cli-module': '1.0.0' },
      packages: {
        '@example/broken-cli-module': {
          role: 'cli-module',
          main: 'missing.js',
          exports: './missing.js',
        },
      },
    });
    expect(() => discoverCliModules()).toThrow(
      'Failed to resolve the entry point of installed CLI module "@example/broken-cli-module" from the target repository',
    );
    targetPaths.restore();
  });
});
