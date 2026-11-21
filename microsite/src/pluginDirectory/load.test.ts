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
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { dump } from 'js-yaml';
import { loadPluginManifests } from './load';

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

async function withFixtureDirectory<T>(
  files: Record<string, string>,
  callback: (directory: string) => Promise<T>,
): Promise<T> {
  const directory = await mkdtemp(join(tmpdir(), 'plugin-directory-'));

  try {
    await Promise.all(
      Object.entries(files).map(([filename, contents]) =>
        writeFile(join(directory, filename), contents),
      ),
    );
    return await callback(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function manifestYaml(overrides: Partial<typeof validManifest> = {}): string {
  return dump({ ...validManifest, ...overrides });
}

describe('loadPluginManifests', () => {
  it('loads manifests in filename order without truncating descriptions', async () => {
    const longDescription = 'A'.repeat(250);
    const recentDate = new Date(Date.now() - 95 * 24 * 60 * 60 * 1_000)
      .toISOString()
      .slice(0, 10);

    await withFixtureDirectory(
      {
        'z-plugin.yaml': manifestYaml({
          title: 'Z Plugin',
          addedDate: recentDate,
        }),
        'a-plugin.yaml': manifestYaml({
          title: 'A Plugin',
          description: longDescription,
        }),
      },
      async fixtureDirectory => {
        const plugins = await loadPluginManifests(fixtureDirectory);

        assert.deepEqual(
          plugins.map(plugin => plugin.slug),
          ['a-plugin', 'z-plugin'],
        );
        assert.equal(plugins[0].isNew, false);
        assert.equal(plugins[1].isNew, true);
        assert.equal(plugins[0].description, longDescription);
      },
    );
  });

  it('rejects filenames outside the lowercase kebab-case YAML format', async () => {
    for (const filename of [
      'notes.txt',
      'short-extension.yml',
      'Uppercase-plugin.yaml',
      'underscore_plugin.yaml',
    ]) {
      await assert.rejects(
        () =>
          withFixtureDirectory({ [filename]: manifestYaml() }, directory =>
            loadPluginManifests(directory),
          ),
        error => {
          assert(error instanceof Error);
          assert.ok(error.message.includes(filename));
          return true;
        },
      );
    }
  });

  it('reports the filename and field path for invalid manifest data', async () => {
    await assert.rejects(
      () =>
        withFixtureDirectory(
          {
            'invalid-plugin.yaml': manifestYaml({
              authorUrl: 'not-a-url',
            }),
          },
          directory => loadPluginManifests(directory),
        ),
      error => {
        assert(error instanceof Error);
        assert.ok(error.message.includes('invalid-plugin.yaml'));
        assert.ok(error.message.includes('authorUrl'));
        return true;
      },
    );
  });

  it('reports the filename for malformed YAML', async () => {
    await assert.rejects(
      () =>
        withFixtureDirectory(
          { 'malformed-plugin.yaml': 'title: [unterminated' },
          directory => loadPluginManifests(directory),
        ),
      error => {
        assert(error instanceof Error);
        assert.ok(error.message.includes('malformed-plugin.yaml'));
        return true;
      },
    );
  });
});
