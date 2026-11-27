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
// These scripts are not packages and run on Node's built-in test runner.
/* eslint-disable no-restricted-imports */
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

function manifestYamlWithout(): string {
  const { addedDate: _addedDate, ...rest } = validManifest;
  return dump(rest);
}

describe('loadPluginManifests', () => {
  it('loads manifests in filename order without truncating descriptions', async () => {
    const longDescription = 'A'.repeat(250);

    await withFixtureDirectory(
      {
        'z-plugin.yaml': manifestYaml({ title: 'Z Plugin' }),
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

  it('reports every invalid file instead of stopping at the first', async () => {
    await assert.rejects(
      () =>
        withFixtureDirectory(
          {
            'a-valid.yaml': manifestYaml(),
            'b-bad-url.yaml': manifestYaml({ authorUrl: 'not-a-url' }),
            'c-malformed.yaml': 'title: [unterminated',
            'D_Bad_Name.yaml': manifestYaml(),
          },
          directory => loadPluginManifests(directory),
        ),
      error => {
        assert(error instanceof Error);
        assert.ok(error.message.includes('3 plugin manifest(s)'));
        assert.ok(error.message.includes('b-bad-url.yaml'));
        assert.ok(error.message.includes('authorUrl'));
        assert.ok(error.message.includes('c-malformed.yaml'));
        assert.ok(error.message.includes('D_Bad_Name.yaml'));
        assert.ok(!error.message.includes('a-valid.yaml'));
        return true;
      },
    );
  });

  it('accepts quoted and unquoted YAML dates and normalizes them', async () => {
    await withFixtureDirectory(
      {
        'quoted.yaml': `addedDate: '2025-01-02'\n${manifestYamlWithout()}`,
        'unquoted.yaml': `addedDate: 2025-01-02\n${manifestYamlWithout()}`,
      },
      async directory => {
        const plugins = await loadPluginManifests(directory);

        assert.deepEqual(
          plugins.map(plugin => plugin.addedDate),
          ['2025-01-02', '2025-01-02'],
        );
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
