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
import { extractManifests } from './manifest/extractManifests';

jest.mock('chokidar', () => ({
  watch: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    add: jest.fn(),
  })),
}));

jest.mock('./manifest/extractManifests', () => ({
  extractManifests: jest.fn(),
}));

const mockExtractManifests = extractManifests as jest.MockedFunction<
  typeof extractManifests
>;

const pluginPackages: Record<string, { alpha?: boolean }> = {
  '@test/plugin-pages': {},
  '@test/plugin-mixed': {},
  '@test/plugin-static': {},
  '@test/plugin-broken': {},
  '@test/plugin-alpha': { alpha: true },
};

describe('createDetectedModulesEntryPoint', () => {
  let appDir: string;
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    appDir = await fs.mkdtemp(joinPath(os.tmpdir(), 'package-detection-'));
    await fs.writeJson(joinPath(appDir, 'package.json'), {
      name: 'app',
      dependencies: Object.fromEntries(
        Object.keys(pluginPackages).map(name => [name, '*']),
      ),
    });
    for (const [name, { alpha }] of Object.entries(pluginPackages)) {
      const dir = joinPath(appDir, 'node_modules', name);
      await fs.ensureDir(dir);
      await fs.writeJson(joinPath(dir, 'package.json'), {
        name,
        version: '1.0.0',
        backstage: { role: 'frontend-plugin' },
        ...(alpha && {
          exports: {
            '.': './index.js',
            './alpha': './alpha.js',
            './package.json': './package.json',
          },
        }),
      });
    }
    await fs.ensureDir(joinPath(appDir, 'src'));
    await fs.writeFile(
      joinPath(appDir, 'src', 'App.tsx'),
      "import plugin from '@test/plugin-static';\n",
    );
  });

  afterEach(async () => {
    logSpy.mockRestore();
    mockExtractManifests.mockReset();
    await fs.remove(appDir);
  });

  async function readDiscoveryModule() {
    return fs.readFile(
      joinPath(appDir, 'node_modules', '__backstage-autodetected-plugins__.js'),
      'utf8',
    );
  }

  it('only emits require entries when the flag is off', async () => {
    const entryPoints = await createDetectedModulesEntryPoint({
      config: new ConfigReader({ app: { packages: 'all' } }),
      targetPath: appDir,
    });

    expect(entryPoints).toEqual(['__backstage-autodetected-plugins__']);
    expect(mockExtractManifests).not.toHaveBeenCalled();
    expect(await readDiscoveryModule()).toBe(
      `window['__@backstage/discovered__'] = { modules: [${[
        `{ name: "@test/plugin-pages", export: undefined, default: require('@test/plugin-pages').default }`,
        `{ name: "@test/plugin-mixed", export: undefined, default: require('@test/plugin-mixed').default }`,
        `{ name: "@test/plugin-static", export: undefined, default: require('@test/plugin-static').default }`,
        `{ name: "@test/plugin-broken", export: undefined, default: require('@test/plugin-broken').default }`,
        `{ name: "@test/plugin-alpha", export: undefined, default: require('@test/plugin-alpha').default }`,
        `{ name: "@test/plugin-alpha", export: "./alpha", default: require('@test/plugin-alpha/alpha').default }`,
      ].join(',')}] };`,
    );
  });

  it('emits lazy entries for deferrable packages when the flag is on', async () => {
    const manifest = {
      manifestVersion: 1 as const,
      type: 'plugin' as const,
      pluginId: 'pages',
      deferrable: true,
      routes: [],
      externalRoutes: [],
      extensions: [],
    };
    mockExtractManifests.mockResolvedValue(
      new Map([
        ['@test/plugin-pages', { manifest }],
        [
          '@test/plugin-mixed',
          {
            manifest: {
              ...manifest,
              deferrable: false,
              notDeferrableReason: "has non-page extension 'api:mixed'",
            },
          },
        ],
        ['@test/plugin-broken', { error: 'boom' }],
        ['@test/plugin-alpha', { skipped: 'no default export' }],
        ['@test/plugin-alpha./alpha', { manifest }],
      ]),
    );

    await createDetectedModulesEntryPoint({
      config: new ConfigReader({
        app: { packages: 'all', experimental: { deferredPackages: true } },
      }),
      targetPath: appDir,
    });

    // The package that the app imports statically is never extracted
    expect(mockExtractManifests).toHaveBeenCalledTimes(1);
    expect(
      mockExtractManifests.mock.calls[0][0].packages.map(p => p.key),
    ).toEqual([
      '@test/plugin-pages',
      '@test/plugin-mixed',
      '@test/plugin-broken',
      '@test/plugin-alpha',
      '@test/plugin-alpha./alpha',
    ]);

    const content = await readDiscoveryModule();
    expect(content).toContain(
      `{ name: "@test/plugin-pages", export: undefined, manifest: ${JSON.stringify(
        manifest,
      )}, load: () => import('@test/plugin-pages') }`,
    );
    expect(content).toContain(
      `{ name: "@test/plugin-alpha", export: "./alpha", manifest: ${JSON.stringify(
        manifest,
      )}, load: () => import('@test/plugin-alpha/alpha') }`,
    );
    for (const name of ['mixed', 'static', 'broken']) {
      expect(content).toContain(
        `default: require('@test/plugin-${name}').default }`,
      );
      expect(content).not.toContain(`import('@test/plugin-${name}')`);
    }
    expect(content).toContain(
      `default: require('@test/plugin-alpha').default }`,
    );

    const report = logSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(report).toContain('deferred  @test/plugin-pages');
    expect(report).toContain(
      "eager     @test/plugin-mixed (has non-page extension 'api:mixed')",
    );
    expect(report).toContain(
      'eager     @test/plugin-static (statically imported by app)',
    );
    expect(report).toContain(
      'eager     @test/plugin-broken (manifest extraction failed: boom)',
    );
  });

  it('loads packages eagerly if their config cannot be applied to a stub', async () => {
    const createManifest = (pluginId: string) => ({
      manifestVersion: 1 as const,
      type: 'plugin' as const,
      pluginId,
      deferrable: true,
      routes: [],
      externalRoutes: [],
      extensions: [
        {
          id: `entity-card:${pluginId}`,
          element: { data: {}, dataConfigKeys: ['title'] },
        },
      ],
    });
    mockExtractManifests.mockResolvedValue(
      new Map([
        ['@test/plugin-pages', { manifest: createManifest('pages') }],
        ['@test/plugin-mixed', { manifest: createManifest('mixed') }],
      ]),
    );

    await createDetectedModulesEntryPoint({
      config: new ConfigReader({
        app: {
          packages: { include: ['@test/plugin-pages', '@test/plugin-mixed'] },
          experimental: { deferredPackages: true },
          extensions: [
            'page:other',
            { 'entity-card:pages': { config: { title: 'Other' } } },
            { 'entity-card:mixed': { config: { height: 300 } } },
          ],
        },
      }),
      targetPath: appDir,
    });

    const content = await readDiscoveryModule();
    expect(content).toContain(
      `default: require('@test/plugin-pages').default }`,
    );
    expect(content).toContain(`load: () => import('@test/plugin-mixed')`);

    const report = logSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(report).toContain(
      "eager     @test/plugin-pages ('entity-card:pages' is configured with 'title' in app.extensions, which can't be applied before the plugin is loaded)",
    );
    expect(report).toContain('deferred  @test/plugin-mixed');
  });
});
