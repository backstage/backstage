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
import { ConfigReader } from '@backstage/config';
import { rspack, Configuration, MultiStats, Stats } from '@rspack/core';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import { createConfig } from './config';
import { resolveBundlingPaths } from './paths';
import {
  findPublicSources,
  preparePublicSources,
  PUBLIC_SOURCES_COMPILER_NAME,
  PublicSourcesRegistry,
} from './publicSources';

jest.setTimeout(60_000);

function run(config: Configuration): Promise<Stats>;
function run(configs: Configuration[]): Promise<MultiStats>;
function run(config: Configuration | Configuration[]) {
  return new Promise<Stats | MultiStats>((resolve, reject) => {
    rspack(config as Configuration, (error, stats) => {
      if (error || !stats) {
        reject(error ?? new Error('No stats'));
      } else if (stats.hasErrors()) {
        reject(new Error(stats.toString({ all: false, errors: true })));
      } else {
        resolve(stats);
      }
    });
  });
}

describe('public sources', () => {
  const mockDir = createMockDirectory();

  it('builds each source into a standalone, hashed script', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'app' }),
      'src/index.ts': '',
      'public-sources': {
        'preload.ts': [
          "import { greeting } from './lib/greeting';",
          'declare global { interface Window { greeting?: string } }',
          'window.greeting = greeting;',
        ].join('\n'),
        'lib/greeting.ts': "export const greeting: string = 'hello';",
        'theme.js': 'document.documentElement.dataset.theme = "dark";',
        'types.d.ts': 'export {};',
        'README.md': 'not a source',
      },
    });
    const paths = resolveBundlingPaths({
      entry: 'src/index',
      targetDir: mockDir.path,
    });

    await expect(findPublicSources(paths)).resolves.toEqual({
      preload: resolvePath(mockDir.path, 'public-sources/preload.ts'),
      theme: resolvePath(mockDir.path, 'public-sources/theme.js'),
    });

    const { registry, config } = await preparePublicSources(paths, {
      isDev: false,
      publicPath: '/app',
    });
    await run(config!);

    const preloadFile = registry.getFile('preload');
    expect(preloadFile).toMatch(/^static\/preload\.[0-9a-f]{12}\.js$/);
    expect(registry.getFile('theme')).toMatch(
      /^static\/theme\.[0-9a-f]{12}\.js$/,
    );
    // Everything emitted, which the build also copies for the public entry
    // point
    expect([...registry.emittedFiles].sort()).toEqual(
      [
        preloadFile,
        `${preloadFile}.map`,
        registry.getFile('theme'),
        `${registry.getFile('theme')}.map`,
      ].sort(),
    );

    // A classic script that inlines its imports, with no bundler runtime
    // that would wait for chunks from the app
    const output = await fs.readFile(
      resolvePath(paths.targetDist, preloadFile),
      'utf8',
    );
    expect(output).toContain('hello');
    expect(output).not.toMatch(/\bimport\b|\bexport\b|webpackChunk/);
    expect(
      (await fs.readdir(resolvePath(paths.targetDist, 'static'))).filter(file =>
        file.endsWith('.js'),
      ),
    ).toHaveLength(2);

    // Running it in the page does what the source says
    const window: { greeting?: string } = {};
    // eslint-disable-next-line no-new-func
    new Function('window', output)(window);
    expect(window.greeting).toBe('hello');

    // The index template gets full paths, and the raw template for the app
    // backend gets paths relative to its public path placeholder
    const sources = registry.createTemplateParameter('/app');
    expect(sources.preload).toBe(`/app/${preloadFile}`);
    expect(
      registry.resolvePlaceholders(
        '<script src="<%= sources.preload %>"></script><%= publicPath %>',
      ),
    ).toBe(
      `<script src="<%= publicPath %>/${preloadFile}"></script><%= publicPath %>`,
    );
  });

  it('fills in the source paths in both index templates', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'app', version: '0.0.0' }),
      'src/index.ts': 'console.log("app");',
      'public/index.html': [
        '<html><head>',
        '<script async src="<%= sources.preload %>"></script>',
        '</head><body></body></html>',
      ].join('\n'),
      'public-sources/preload.ts': 'console.log("preload");',
    });
    const paths = resolveBundlingPaths({
      entry: 'src/index',
      targetDir: mockDir.path,
    });
    const frontendConfig = new ConfigReader({
      app: { baseUrl: 'http://localhost:3000/app' },
    });

    const publicSources = await preparePublicSources(paths, {
      isDev: false,
      publicPath: '/app',
    });
    const appConfig = await createConfig(paths, {
      checksEnabled: false,
      isDev: false,
      frontendConfig,
      getFrontendAppConfigs: () => [],
      publicSources: publicSources.registry,
    });
    appConfig.dependencies = [PUBLIC_SOURCES_COMPILER_NAME];
    await run([appConfig, publicSources.config!]);

    const file = publicSources.registry.getFile('preload');
    const read = (name: string) =>
      fs.readFile(resolvePath(paths.targetDist, name), 'utf8');
    await expect(read('index.html')).resolves.toContain(
      `<script async src="/app/${file}"></script>`,
    );
    // The app backend only knows the public path when rendering this one
    const template = await read('index.html.tmpl');
    expect(template).toContain(
      `<script async src="<%= publicPath %>/${file}"></script>`,
    );
    expect(template).not.toContain('sources.');
  });

  it('reports sources that do not exist', async () => {
    mockDir.setContent({ 'package.json': '{}', 'src/index.ts': '' });
    const paths = resolveBundlingPaths({
      entry: 'src/index',
      targetDir: mockDir.path,
    });

    const { registry, config } = await preparePublicSources(paths, {
      isDev: false,
      publicPath: '',
    });
    expect(config).toBeUndefined();
    expect(registry.isEmpty).toBe(true);
    expect(() => registry.createTemplateParameter('').missing).toThrow(
      "The index template refers to the public source 'missing', which does not exist, and the app has no public sources",
    );

    const named = new PublicSourcesRegistry(['preload']);
    expect(() => named.resolvePlaceholders('<%= sources.other %>')).toThrow(
      "The index template refers to the public source 'other', which does not exist, the available sources are: preload",
    );
    expect(() => named.getFile('preload')).toThrow(
      "The public source 'preload' has not been built",
    );
  });
});
