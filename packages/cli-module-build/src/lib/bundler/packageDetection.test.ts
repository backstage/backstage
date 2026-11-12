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
import { createDetectedModulesEntryPoint } from './packageDetection';

jest.mock('chokidar', () => ({
  watch: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    add: jest.fn(),
    close: jest.fn(),
  })),
}));

const createManifest = (pluginId: string, overrides: object = {}) => ({
  manifestVersion: 1 as const,
  type: 'plugin' as const,
  pluginId,
  deferrable: true,
  routes: [],
  externalRoutes: [],
  extensions: [
    {
      id: `page:${pluginId}`,
      kind: 'page',
      attachTo: { id: 'app/routes', input: 'routes' },
      disabled: false,
      page: { path: `/${pluginId}` },
    },
  ],
  ...overrides,
});

const pluginPackages: Record<
  string,
  { alpha?: boolean; manifest?: object | false }
> = {
  '@test/plugin-pages': {
    manifest: {
      manifestVersion: 1,
      frontend: { exposedModules: { '.': createManifest('pages') } },
    },
  },
  '@test/plugin-mixed': {
    manifest: {
      manifestVersion: 1,
      frontend: {
        exposedModules: {
          '.': createManifest('mixed', {
            deferrable: false,
            notDeferrableReason: 'the plugin uses an if predicate',
          }),
        },
      },
    },
  },
  '@test/plugin-unbuilt': { manifest: false },
  '@test/plugin-future': {
    manifest: { manifestVersion: 2, frontend: { exposedModules: {} } },
  },
  '@test/plugin-alpha': {
    alpha: true,
    manifest: {
      manifestVersion: 1,
      frontend: { exposedModules: { './alpha': createManifest('alpha') } },
    },
  },
};

describe('createDetectedModulesEntryPoint', () => {
  let appDir: string;
  let logSpy: jest.SpyInstance;

  async function writePackage(
    dir: string,
    packageJson: object,
    manifest?: object | false,
  ) {
    await fs.ensureDir(dir);
    await fs.writeJson(joinPath(dir, 'package.json'), {
      version: '1.0.0',
      ...packageJson,
      backstage: { role: 'frontend-plugin' },
    });
    if (manifest) {
      await fs.outputJson(joinPath(dir, 'dist', 'backstage-manifest.json'), {
        packageName: (packageJson as { name?: string }).name,
        role: 'frontend-plugin',
        ...manifest,
      });
    }
  }

  beforeEach(async () => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    appDir = await fs.mkdtemp(joinPath(os.tmpdir(), 'package-detection-'));
    await fs.writeJson(joinPath(appDir, 'package.json'), {
      name: 'app',
      dependencies: Object.fromEntries(
        Object.keys(pluginPackages).map(name => [name, '*']),
      ),
    });
    for (const [name, { alpha, manifest }] of Object.entries(pluginPackages)) {
      await writePackage(
        joinPath(appDir, 'node_modules', name),
        {
          name,
          ...(alpha && {
            exports: {
              '.': './index.js',
              './alpha': './alpha.js',
              './package.json': './package.json',
            },
          }),
        },
        manifest,
      );
    }
  });

  afterEach(async () => {
    logSpy.mockRestore();
    await fs.remove(appDir);
  });

  async function readDiscoveryModule() {
    return fs.readFile(
      joinPath(appDir, 'node_modules', '__backstage-autodetected-plugins__.js'),
      'utf8',
    );
  }

  function readReport() {
    return logSpy.mock.calls.map(call => call.join(' ')).join('\n');
  }

  it('only emits require entries when the flag is off', async () => {
    const entryPoints = await createDetectedModulesEntryPoint({
      config: new ConfigReader({ app: { packages: 'all' } }),
      targetPath: appDir,
    });

    expect(entryPoints).toEqual(['__backstage-autodetected-plugins__']);
    expect(await readDiscoveryModule()).toBe(
      `window['__@backstage/discovered__'] = { modules: [${[
        `{ name: "@test/plugin-pages", export: undefined, default: require('@test/plugin-pages').default }`,
        `{ name: "@test/plugin-mixed", export: undefined, default: require('@test/plugin-mixed').default }`,
        `{ name: "@test/plugin-unbuilt", export: undefined, default: require('@test/plugin-unbuilt').default }`,
        `{ name: "@test/plugin-future", export: undefined, default: require('@test/plugin-future').default }`,
        `{ name: "@test/plugin-alpha", export: undefined, default: require('@test/plugin-alpha').default }`,
        `{ name: "@test/plugin-alpha", export: "./alpha", default: require('@test/plugin-alpha/alpha').default }`,
      ].join(',')}] };`,
    );
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('leaves deferrable packages out of the bundle and builds them as remotes', async () => {
    const onDeferredPackages = jest.fn(async () => {});
    await createDetectedModulesEntryPoint({
      config: new ConfigReader({
        app: {
          packages: 'all',
          experimental: {
            deferredPackages: { exclude: ['@test/plugin-alpha'] },
          },
        },
      }),
      targetPath: appDir,
      onDeferredPackages,
    });

    const content = await readDiscoveryModule();
    expect(content).not.toContain(`'@test/plugin-pages'`);
    for (const name of ['mixed', 'unbuilt', 'future', 'alpha']) {
      expect(content).toContain(
        `default: require('@test/plugin-${name}').default }`,
      );
    }
    expect(content).toContain(
      `default: require('@test/plugin-alpha/alpha').default }`,
    );
    expect(onDeferredPackages).toHaveBeenCalledTimes(1);
    expect(onDeferredPackages).toHaveBeenCalledWith([
      expect.objectContaining({
        name: '@test/plugin-pages',
        dir: fs.realpathSync(
          joinPath(appDir, 'node_modules', '@test/plugin-pages'),
        ),
        entryPoints: {
          '.': {
            import: '@test/plugin-pages',
            manifest: createManifest('pages'),
          },
        },
      }),
    ]);

    const report = readReport();
    expect(report).toContain(
      'remote    @test/plugin-pages (built as a remote and loaded on first use)',
    );
    expect(report).toContain(
      'eager     @test/plugin-mixed (the plugin uses an if predicate)',
    );
    expect(report).toContain(
      'eager     @test/plugin-unbuilt (the package has no Backstage manifest)',
    );
    expect(report).toContain(
      'eager     @test/plugin-future (the Backstage manifest of the package has version 2, but only version 1 is supported)',
    );
    expect(report).toContain(
      'eager     @test/plugin-alpha/alpha (excluded in app.experimental.deferredPackages)',
    );

    // Without the exclusion, the package is built as a remote with only the
    // entry point that has a manifest
    logSpy.mockClear();
    onDeferredPackages.mockClear();
    await createDetectedModulesEntryPoint({
      config: new ConfigReader({
        app: {
          packages: { include: ['@test/plugin-alpha'] },
          experimental: { deferredPackages: true },
        },
      }),
      targetPath: appDir,
      onDeferredPackages,
    });
    expect(await readDiscoveryModule()).toBe(
      `window['__@backstage/discovered__'] = { modules: [] };`,
    );
    expect(onDeferredPackages).toHaveBeenCalledWith([
      expect.objectContaining({
        name: '@test/plugin-alpha',
        entryPoints: {
          './alpha': {
            import: '@test/plugin-alpha/alpha',
            manifest: createManifest('alpha'),
          },
        },
      }),
    ]);
    expect(readReport()).toContain(
      'skipped   @test/plugin-alpha (no manifest for the entry point)',
    );
  });

  it('analyzes workspace packages from source', async () => {
    // A workspace package is linked into node_modules
    const packageDir = joinPath(appDir, 'plugins', 'workspace');
    await writePackage(packageDir, { name: '@test/plugin-workspace' });
    await fs.outputFile(
      joinPath(packageDir, 'src', 'index.ts'),
      `
        import { createFrontendPlugin, PageBlueprint } from '@backstage/frontend-plugin-api';
        export default createFrontendPlugin({
          pluginId: 'workspace',
          extensions: [
            PageBlueprint.make({ params: { path: '/workspace', loader: async () => null } }),
          ],
        });
      `,
    );
    await fs.ensureSymlink(
      packageDir,
      joinPath(appDir, 'node_modules', '@test/plugin-workspace'),
    );
    await fs.writeJson(joinPath(appDir, 'package.json'), {
      name: 'app',
      dependencies: { '@test/plugin-workspace': '*' },
    });
    const onDeferredPackages = jest.fn(async () => {});
    const config = new ConfigReader({
      app: { packages: 'all', experimental: { deferredPackages: true } },
    });

    await createDetectedModulesEntryPoint({
      config,
      targetPath: appDir,
      onDeferredPackages,
    });
    expect(onDeferredPackages).toHaveBeenCalledWith([
      expect.objectContaining({
        name: '@test/plugin-workspace',
        entryPoints: {
          '.': expect.objectContaining({
            manifest: expect.objectContaining({
              pluginId: 'workspace',
              deferrable: true,
            }),
          }),
        },
      }),
    ]);

    // A package that can't be deferred is bundled with the app
    await fs.outputFile(
      joinPath(packageDir, 'src', 'index.ts'),
      'export const x = 1;',
    );
    onDeferredPackages.mockClear();
    await createDetectedModulesEntryPoint({
      config,
      targetPath: appDir,
      onDeferredPackages,
    });
    expect(onDeferredPackages).toHaveBeenCalledWith([]);
    expect(await readDiscoveryModule()).toContain(
      `default: require('@test/plugin-workspace').default }`,
    );
    expect(readReport()).toContain(
      'eager     @test/plugin-workspace (the entry point has no default export)',
    );
  });
});
