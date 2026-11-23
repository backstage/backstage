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

import { ConfigReader } from '@backstage/config';
import fs from 'fs-extra';
import os from 'node:os';
import { join as joinPath } from 'node:path';
import { buildBundle } from './bundle';
import { buildDeferredRemotes } from './buildDeferredRemotes';

jest.mock('./bundle', () => ({ buildBundle: jest.fn(async () => {}) }));

describe('buildDeferredRemotes', () => {
  let appDir: string;

  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    appDir = await fs.mkdtemp(joinPath(os.tmpdir(), 'deferred-remotes-'));
    const packageDir = joinPath(appDir, 'node_modules', '@test', 'plugin-x');
    await fs.outputJson(joinPath(packageDir, 'package.json'), {
      name: '@test/plugin-x',
      exports: { '.': './index.js', './package.json': './package.json' },
    });
    await fs.outputFile(joinPath(packageDir, 'index.js'), '');
    await fs.outputFile(joinPath(appDir, 'dist', 'remotes', 'stale', 'x'), '');
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await fs.remove(appDir);
  });

  it('builds each package as a remote with its manifest', async () => {
    const manifest = {
      manifestVersion: 1 as const,
      type: 'plugin' as const,
      pluginId: 'x',
      deferrable: true,
      routes: [],
      externalRoutes: [],
      extensions: [],
    };
    const config = new ConfigReader({});
    const targetDir = joinPath(appDir, 'dist', 'remotes');

    await buildDeferredRemotes({
      packages: [
        {
          name: '@test/plugin-x',
          dir: joinPath(appDir, 'node_modules', '@test', 'plugin-x'),
          packageJson: {
            name: '@test/plugin-x',
            version: '1.0.0',
            backstage: { role: 'frontend-plugin' },
          },
          entryPoints: { '.': { import: '@test/plugin-x', manifest } },
        },
      ],
      targetDir,
      appDir,
      frontendConfig: config,
      frontendAppConfigs: [],
      fullConfig: config,
    });

    // Remotes of earlier builds are removed
    expect(await fs.readdir(targetDir)).toEqual([]);
    expect(buildBundle).toHaveBeenCalledTimes(1);
    expect(buildBundle).toHaveBeenCalledWith(
      expect.objectContaining({
        targetDir: joinPath(appDir, 'node_modules', '@test', 'plugin-x'),
        dist: joinPath(targetDir, 'test-plugin-x'),
        moduleFederationRemote: {
          name: 'test__plugin_x',
          exposes: {
            '.': fs.realpathSync(
              joinPath(appDir, 'node_modules', '@test', 'plugin-x', 'index.js'),
            ),
          },
          sharedDependencies: expect.any(Object),
          backstageManifest: {
            manifestVersion: 1,
            packageName: '@test/plugin-x',
            role: 'frontend-plugin',
            frontend: { exposedModules: { '.': manifest } },
          },
        },
      }),
    );
  });
});
