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
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import type {
  LoadContext,
  PluginContentLoadedActions,
  RouteConfig,
} from '@docusaurus/types';
import { dump } from 'js-yaml';
import pluginDirectoryPlugin from './plugin';

const validManifest = {
  title: 'Example',
  author: 'Example Inc.',
  authorUrl: 'https://example.com',
  category: 'Monitoring',
  description: 'Shows service health.',
  documentation: 'https://example.com/docs',
  npmPackageName: '@example/backstage-plugin-example',
  addedDate: '2020-01-01',
  status: 'active',
};

async function withFixtureSite<T>(
  callback: (siteDir: string) => Promise<T>,
): Promise<T> {
  const siteDir = await mkdtemp(join(tmpdir(), 'plugin-directory-site-'));
  const manifestDirectory = join(siteDir, 'data', 'plugins');

  try {
    await mkdir(manifestDirectory, { recursive: true });
    await Promise.all([
      writeFile(
        join(manifestDirectory, 'z-plugin.yaml'),
        dump({ ...validManifest, title: 'Z Plugin' }),
      ),
      writeFile(
        join(manifestDirectory, 'a-plugin.yaml'),
        dump({ ...validManifest, title: 'A Plugin' }),
      ),
    ]);
    return await callback(siteDir);
  } finally {
    await rm(siteDir, { recursive: true, force: true });
  }
}

describe('pluginDirectoryPlugin', () => {
  it('creates one deterministic static route and data module per manifest', async () => {
    await withFixtureSite(async siteDir => {
      const fetchCalls: Parameters<typeof fetch>[] = [];
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async (...args) => {
        fetchCalls.push(args);
        throw new Error('Unexpected remote fetch');
      };

      try {
        const plugin = pluginDirectoryPlugin({ siteDir } as LoadContext);
        const content = await plugin.loadContent?.();
        assert.ok(content);
        assert.deepEqual(
          content.map(manifest => manifest.slug),
          ['a-plugin', 'z-plugin'],
        );
        assert.deepEqual(plugin.getPathsToWatch?.(), [
          join(siteDir, 'data', 'plugins', '*.yaml'),
          join(siteDir, 'data', 'latest-backstage-version.yaml'),
        ]);

        const routes: RouteConfig[] = [];
        const dataModules: Array<{ name: string; data: string | object }> = [];
        const actions: PluginContentLoadedActions = {
          addRoute(route) {
            routes.push(route);
          },
          async createData(name, data) {
            dataModules.push({ name, data });
            return `/generated/${name}`;
          },
          setGlobalData() {},
        };

        await plugin.contentLoaded?.({ content, actions });

        assert.deepEqual(
          routes.map(route => route.path),
          ['/plugins/a-plugin', '/plugins/z-plugin'],
        );
        assert.equal(routes[0].exact, true);
        assert.equal(
          routes[0].component,
          '@site/src/components/pluginDirectory/PluginDetailPage.tsx',
        );
        assert.deepEqual(
          routes.map(route => route.modules),
          [
            {
              plugin: '/generated/a-plugin.json',
              latestBackstageVersion:
                '/generated/latest-backstage-version.json',
            },
            {
              plugin: '/generated/z-plugin.json',
              latestBackstageVersion:
                '/generated/latest-backstage-version.json',
            },
          ],
        );
        assert.deepEqual(
          dataModules.map(({ name }) => name),
          [
            'latest-backstage-version.json',
            'a-plugin.json',
            'z-plugin.json',
          ],
        );
        assert.deepEqual(
          JSON.parse(String(dataModules[0].data)),
          null,
        );
        assert.deepEqual(
          dataModules
            .slice(1)
            .map(({ data }) =>
              JSON.parse(typeof data === 'string' ? data : JSON.stringify(data)),
            ),
          content,
        );
        assert.equal(fetchCalls.length, 0);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});
