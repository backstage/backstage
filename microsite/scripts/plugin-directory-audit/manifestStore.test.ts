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
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import type { PluginManifest } from '../../src/pluginDirectory/manifest';
import { readManifestFiles, writeManifestFile } from './manifestStore';

const fixture = `title: Example Plugin
author: Example Author
authorUrl: https://example.com
category: Development
description: An example plugin used to test persistence.
documentation: https://example.com/docs
npmPackageName: '@example/plugin-example'
addedDate: '2024-01-01'
status: active
`;

async function withFixture(
  run: (directory: string, path: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'plugin-audit-store-'));
  const path = join(directory, 'example.yaml');
  try {
    await writeFile(path, fixture, 'utf8');
    await run(directory, path);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function snapshot(): NonNullable<PluginManifest['snapshot']> {
  return {
    backstage: {
      status: 'fresh',
      lastAttemptAt: '2026-08-03T12:00:00.000Z',
      checkedAt: '2026-08-03T12:00:00.000Z',
      version: '1.40.0',
      sourceUrl:
        'https://github.com/example/backstage-plugins/blob/main/backstage.json',
      sourcePath: 'backstage.json',
    },
    packages: [
      {
        npmPackageName: '@example/plugin-example',
        npm: {
          status: 'fresh',
          lastAttemptAt: '2026-08-03T12:00:00.000Z',
          checkedAt: '2026-08-03T12:00:00.000Z',
          latestVersion: '1.2.3',
          lastPublishedAt: '2026-07-01T00:00:00.000Z',
          repository: {
            url: 'https://github.com/example/backstage-plugins',
            directory: 'plugins/example',
          },
        },
      },
    ],
  };
}

describe('manifestStore', () => {
  it('does not rewrite a file whose semantic manifest is unchanged', async () => {
    await withFixture(async (directory, path) => {
      const [file] = await readManifestFiles(directory);

      assert.equal(file.filename, 'example.yaml');
      assert.equal(file.path, path);
      await writeManifestFile(file);

      assert.equal(await readFile(path, 'utf8'), fixture);
    });
  });

  it('writes deterministic YAML with audit-owned fields after authored fields', async () => {
    await withFixture(async (directory, path) => {
      const [file] = await readManifestFiles(directory);
      await writeManifestFile({
        ...file,
        manifest: {
          ...file.manifest,
          capabilities: ['search-result', 'catalog-provider'],
          snapshot: snapshot(),
        },
      });

      assert.equal(
        await readFile(path, 'utf8'),
        `---
title: Example Plugin
author: Example Author
authorUrl: https://example.com
category: Development
description: An example plugin used to test persistence.
documentation: https://example.com/docs
npmPackageName: '@example/plugin-example'
addedDate: '2024-01-01'
status: active
capabilities:
  - search-result
  - catalog-provider
snapshot:
  backstage:
    status: fresh
    lastAttemptAt: '2026-08-03T12:00:00.000Z'
    checkedAt: '2026-08-03T12:00:00.000Z'
    version: 1.40.0
    sourceUrl: https://github.com/example/backstage-plugins/blob/main/backstage.json
    sourcePath: backstage.json
  packages:
    - npmPackageName: '@example/plugin-example'
      npm:
        status: fresh
        lastAttemptAt: '2026-08-03T12:00:00.000Z'
        checkedAt: '2026-08-03T12:00:00.000Z'
        latestVersion: 1.2.3
        lastPublishedAt: '2026-07-01T00:00:00.000Z'
        repository:
          url: https://github.com/example/backstage-plugins
          directory: plugins/example
`,
      );
    });
  });
});
