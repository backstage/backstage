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

import { join } from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'fs-extra';
import { ConfigReader } from '@backstage/config';
import { rspack, RspackOptions } from '@rspack/core';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import webpack from 'webpack';
import { optimization } from './optimization';
import { transforms } from './transforms';

// Compile a feature with a lazy renderer in the same npm scope, and a shared
// workspace module. Naming chunks by scope pulls the renderer into discovery;
// failing to extract workspace modules duplicates them across lazy boundaries.
type CompilationStats = {
  errors?: unknown[];
  warnings?: unknown[];
  modules?: Array<Pick<webpack.StatsModule, 'name' | 'chunks'>>;
  namedChunkGroups?: Record<
    string,
    Pick<webpack.StatsChunkGroup, 'chunks' | 'assets'>
  >;
  stylesheetSelectors?: Record<string, string[]>;
};

async function compileFixture(
  isDev: boolean,
  remote: boolean,
  webpackImpl?: typeof webpack,
): Promise<CompilationStats> {
  const root = await fs.mkdtemp(join(tmpdir(), 'backstage-chunks-'));
  try {
    const files = {
      'entry.js': remote
        ? 'export {};'
        : `import { value } from '@fixture/api';
import { heavy } from '@fixture/renderer';
globalThis.initial = { value, heavy };
import(/* webpackChunkName: "feature" */ './feature');`,
      'other-feature.js': `import { shared } from './shared';
import './second.css';
import './first.css';
export default { shared };`,
      'feature.js': `import { value } from '@fixture/api';
import { shared } from './shared';
import './first.css';
import './second.css';
export default { value, shared, load: () => import(/* webpackChunkName: "renderer" */ './renderer') };`,
      'renderer.js': `import { heavy } from '@fixture/renderer';
import { shared } from './shared';
import './second.css';
import './first.css';
export default { heavy, shared };`,
      'shared.js': `export const shared = ${JSON.stringify(
        'shared'.repeat(5_000),
      )};`,
      'first.css': '.first { color: red; }',
      'second.css': '.second { color: blue; }',
      'node_modules/@fixture/api/package.json': JSON.stringify({
        name: '@fixture/api',
        main: 'index.js',
      }),
      'node_modules/@fixture/api/index.js': `export const value = 'api';`,
      'node_modules/@fixture/renderer/package.json': JSON.stringify({
        name: '@fixture/renderer',
        main: 'index.js',
      }),
      'node_modules/@fixture/renderer/index.js': `export const heavy = ${JSON.stringify(
        'renderer'.repeat(15_000),
      )};`,
    };
    await Promise.all(
      Object.entries(files).map(([file, content]) =>
        fs.outputFile(join(root, file), content),
      ),
    );

    const options = {
      isDev,
      webpack: webpackImpl,
      checksEnabled: false,
      frontendConfig: new ConfigReader({}),
      getFrontendAppConfigs: () => [],
      moduleFederationRemote: remote
        ? { name: 'test_remote', sharedDependencies: {} }
        : undefined,
    };
    const { loaders, plugins } = transforms(options);
    const FederationPlugin = webpackImpl
      ? require('@module-federation/enhanced/webpack').ModuleFederationPlugin
      : ModuleFederationPlugin;
    const config: RspackOptions = {
      mode: isDev ? 'development' : 'production',
      context: root,
      entry: './entry.js',
      output: { path: join(root, 'dist'), publicPath: '/' },
      optimization: {
        ...optimization(options),
        // Keep module-to-chunk assertions independent of scope hoisting.
        concatenateModules: false,
      },
      module: { rules: loaders },
      plugins: [
        ...plugins,
        ...(remote
          ? [
              new FederationPlugin({
                name: 'test_remote',
                filename: 'remoteEntry.js',
                runtime: false,
                exposes: {
                  './feature': './feature.js',
                  './other': './other-feature.js',
                },
                shared: {},
              }),
            ]
          : []),
      ],
      experiments: { css: false },
      performance: { hints: false },
    };
    const compiler = webpackImpl
      ? webpackImpl(config as webpack.Configuration)
      : rspack(config);
    const stats = await new Promise<CompilationStats>((resolve, reject) => {
      compiler.run((error, result) => {
        compiler.close(closeError => {
          if (error || closeError || !result) {
            reject(
              error ?? closeError ?? new Error('Missing compilation stats'),
            );
          } else {
            resolve(
              result.toJson({
                all: false,
                errors: true,
                warnings: true,
                modules: true,
                nestedModules: true,
                ids: true,
                chunkGroups: true,
              }),
            );
          }
        });
      });
    });
    const stylesheetSelectors = Object.fromEntries(
      await Promise.all(
        Object.entries(stats.namedChunkGroups ?? {}).map(
          async ([name, group]) => {
            const styles = await Promise.all(
              (group.assets ?? [])
                .filter(asset => asset.name.endsWith('.css'))
                .map(async asset => {
                  const css = await fs.readFile(
                    join(root, 'dist', asset.name),
                    'utf8',
                  );
                  return css.match(/\.(first|second)\b/g) ?? [];
                }),
            );
            return [name, styles.flat()];
          },
        ),
      ),
    );
    return { ...stats, stylesheetSelectors };
  } finally {
    await fs.remove(root);
  }
}

describe.each([
  ['rspack', undefined],
  ['webpack', webpack],
] as const)('optimization (%s)', (_name, webpackImpl) => {
  it.each([false, true])(
    'keeps remote renderers lazy and shares workspace code (isDev=%s)',
    async isDev => {
      const stats = await compileFixture(isDev, true, webpackImpl);
      expect(stats.errors).toEqual([]);
      expect(stats.warnings).toEqual([]);
      const renderer = stats.modules?.find(module =>
        module.name?.endsWith('@fixture/renderer/index.js'),
      );
      const shared = stats.modules?.find(module =>
        module.name?.endsWith('/shared.js'),
      );
      expect(renderer).toBeDefined();
      expect(shared).toBeDefined();
      const featureChunks =
        stats.namedChunkGroups?.__federation_expose_feature.chunks ?? [];
      const rendererChunks = stats.namedChunkGroups?.renderer.chunks ?? [];
      expect(featureChunks.length).toBeGreaterThan(0);
      expect(rendererChunks.length).toBeGreaterThan(0);
      expect(rendererChunks.some(id => renderer?.chunks?.includes(id))).toBe(
        true,
      );
      expect(featureChunks.some(id => renderer?.chunks?.includes(id))).toBe(
        false,
      );
      expect(shared?.chunks).toHaveLength(1);
      expect(featureChunks).toContain(shared?.chunks?.[0]);
      expect(
        stats.namedChunkGroups?.__federation_expose_other.chunks,
      ).toContain(shared?.chunks?.[0]);
      expect(stats.stylesheetSelectors?.__federation_expose_feature).toEqual(
        isDev ? [] : ['.first', '.second'],
      );
      expect(stats.stylesheetSelectors?.__federation_expose_other).toEqual(
        isDev ? [] : ['.second', '.first'],
      );
    },
    30_000,
  );

  it.each([false, true])(
    'preserves named initial app dependency chunks (isDev=%s)',
    async isDev => {
      const stats = await compileFixture(isDev, false, webpackImpl);
      expect(stats.errors).toEqual([]);
      expect(stats.warnings).toEqual([]);
      const renderer = stats.modules?.find(module =>
        module.name?.endsWith('@fixture/renderer/index.js'),
      );
      expect(renderer).toBeDefined();
      expect(renderer?.chunks?.length).toBeGreaterThan(0);
      const initial = stats.namedChunkGroups?.main;
      expect(initial?.chunks).toEqual(
        expect.arrayContaining(renderer?.chunks ?? []),
      );
      expect(initial?.assets?.map(asset => asset.name)).toEqual(
        expect.arrayContaining([
          expect.stringMatching(
            isDev
              ? /^module-fixture\.js$/
              : /^static\/module-fixture\.[^.]+\.js$/,
          ),
        ]),
      );
    },
    30_000,
  );
});
