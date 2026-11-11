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
      entryPoints: { '.': createManifest('pages') },
    },
  },
  '@test/plugin-mixed': {
    manifest: {
      manifestVersion: 1,
      entryPoints: {
        '.': createManifest('mixed', {
          deferrable: false,
          notDeferrableReason: 'the plugin uses an if predicate',
        }),
      },
    },
  },
  '@test/plugin-unbuilt': { manifest: false },
  '@test/plugin-future': {
    manifest: { manifestVersion: 2, entryPoints: {} },
  },
  '@test/plugin-alpha': {
    alpha: true,
    manifest: {
      manifestVersion: 1,
      entryPoints: { './alpha': createManifest('alpha') },
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
      ...(manifest
        ? {
            backstage: {
              role: 'frontend-plugin',
              frontendManifest: 'dist/frontend-manifest.json',
            },
          }
        : { backstage: { role: 'frontend-plugin' } }),
    });
    if (manifest) {
      await fs.outputJson(
        joinPath(dir, 'dist', 'frontend-manifest.json'),
        manifest,
      );
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

  it('emits lazy entries for packages with deferrable manifests', async () => {
    await createDetectedModulesEntryPoint({
      config: new ConfigReader({
        app: {
          packages: 'all',
          experimental: {
            deferredPackages: { exclude: ['@test/plugin-alpha'] },
          },
          // Config for elements doesn't affect the build, it makes the app
          // load the plugin right after it has started
          extensions: [{ 'page:pages': { config: { path: '/other' } } }],
        },
      }),
      targetPath: appDir,
    });

    const content = await readDiscoveryModule();
    expect(content).toContain(
      `{ name: "@test/plugin-pages", export: undefined, manifest: ${JSON.stringify(
        createManifest('pages'),
      )}, load: () => import(/* webpackChunkName: "deferred-test-plugin-pages" */ '@test/plugin-pages') }`,
    );
    for (const name of ['mixed', 'unbuilt', 'future', 'alpha']) {
      expect(content).toContain(
        `default: require('@test/plugin-${name}').default }`,
      );
      expect(content).not.toContain(`*/ '@test/plugin-${name}')`);
    }
    expect(content).toContain(
      `default: require('@test/plugin-alpha/alpha').default }`,
    );

    const report = readReport();
    expect(report).toContain(
      'deferred  @test/plugin-pages (loaded on first use)',
    );
    expect(report).toContain(
      'eager     @test/plugin-mixed (the plugin uses an if predicate)',
    );
    expect(report).toContain(
      'eager     @test/plugin-unbuilt (the package has no frontend manifest)',
    );
    expect(report).toContain(
      'eager     @test/plugin-future (the frontend manifest of the package has version 2, but only version 1 is supported)',
    );
    expect(report).toContain(
      'eager     @test/plugin-alpha/alpha (excluded in app.experimental.deferredPackages)',
    );

    // Without the exclusion, only the entry point with a manifest is deferred
    logSpy.mockClear();
    await createDetectedModulesEntryPoint({
      config: new ConfigReader({
        app: {
          packages: { include: ['@test/plugin-alpha'] },
          experimental: { deferredPackages: true },
        },
      }),
      targetPath: appDir,
    });
    expect(await readDiscoveryModule()).toContain(
      `load: () => import(/* webpackChunkName: "deferred-test-plugin-alpha-alpha" */ '@test/plugin-alpha/alpha') }`,
    );
    expect(readReport()).toContain(
      'eager     @test/plugin-alpha (no manifest for the entry point)',
    );
  });

  it('analyzes workspace packages from source and caches the result', async () => {
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
    const config = new ConfigReader({
      app: { packages: 'all', experimental: { deferredPackages: true } },
    });

    await createDetectedModulesEntryPoint({ config, targetPath: appDir });
    expect(await readDiscoveryModule()).toContain(
      `load: () => import(/* webpackChunkName: "deferred-test-plugin-workspace" */ '@test/plugin-workspace') }`,
    );
    const cachePath = joinPath(
      appDir,
      'node_modules',
      '.cache',
      'backstage-frontend-manifests',
      'test-plugin-workspace.json',
    );
    const cached = await fs.readJson(cachePath);
    expect(cached.result.entryPoints['.'].manifest.deferrable).toBe(true);

    // A cached result is used as long as the source doesn't change
    await fs.writeJson(cachePath, {
      ...cached,
      result: { entryPoints: { '.': { skipped: 'from the cache' } } },
    });
    await createDetectedModulesEntryPoint({ config, targetPath: appDir });
    expect(readReport()).toContain(
      'eager     @test/plugin-workspace (from the cache)',
    );

    await fs.outputFile(
      joinPath(packageDir, 'src', 'index.ts'),
      'export const x = 1;',
    );
    await createDetectedModulesEntryPoint({ config, targetPath: appDir });
    expect(readReport()).toContain(
      'eager     @test/plugin-workspace (the entry point has no default export)',
    );
  });
});
