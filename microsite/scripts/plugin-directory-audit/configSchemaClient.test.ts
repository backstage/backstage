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
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { create } from 'tar';
import { fetchConfigSchemaSnapshot } from './configSchemaClient';

async function buildTarball(
  packageJson: Record<string, unknown>,
  extraFiles: Record<string, string> = {},
): Promise<Buffer> {
  const root = await mkdtemp(join(tmpdir(), 'plugin-config-schema-fixture-'));
  try {
    const packageDirectory = join(root, 'package');
    await mkdir(packageDirectory);
    await writeFile(
      join(packageDirectory, 'package.json'),
      JSON.stringify(packageJson),
      'utf8',
    );
    for (const [name, contents] of Object.entries(extraFiles)) {
      await writeFile(join(packageDirectory, name), contents, 'utf8');
    }

    const tarballPath = join(root, 'package.tgz');
    await create(
      { gzip: true, cwd: root, file: tarballPath },
      ['package'],
    );
    return readFile(tarballPath);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function fakeFetch(
  tarballBuffer: Buffer,
  versionBody: Record<string, unknown> = {
    dist: { tarball: 'https://registry.npmjs.org/example/-/example-1.0.0.tgz' },
  },
): typeof fetch {
  return (async (url: string | URL) => {
    if (String(url).endsWith('.tgz')) {
      return new Response(tarballBuffer);
    }
    return new Response(JSON.stringify(versionBody), {
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;
}

describe('fetchConfigSchemaSnapshot', () => {
  it('reads a published config.schema.json artifact into an inline JSON schema', async () => {
    const schema = { type: 'object', properties: { catalog: { type: 'object' } } };
    const tarball = await buildTarball(
      { name: '@example/plugin-example', configSchema: 'config.schema.json' },
      { 'config.schema.json': JSON.stringify(schema) },
    );

    const result = await fetchConfigSchemaSnapshot(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch(tarball),
    );

    assert.equal(result.status, 'fresh');
    assert.deepEqual(
      result.status === 'fresh' ? result.schema : undefined,
      schema,
    );
  });

  it('reports config-schema-not-json when the package still points at a .d.ts file', async () => {
    const tarball = await buildTarball({
      name: '@example/plugin-example',
      configSchema: 'config.d.ts',
    });

    const result = await fetchConfigSchemaSnapshot(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch(tarball),
    );

    assert.deepEqual(result, {
      status: 'unavailable',
      lastAttemptAt: result.lastAttemptAt,
      reason: 'config-schema-not-json',
    });
  });

  it('reports config-schema-not-declared when the package has no configSchema field', async () => {
    const tarball = await buildTarball({ name: '@example/plugin-example' });

    const result = await fetchConfigSchemaSnapshot(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch(tarball),
    );

    assert.equal(result.status, 'unavailable');
    assert.equal(
      result.status === 'unavailable' ? result.reason : undefined,
      'config-schema-not-declared',
    );
  });

  it('reports npm-not-found when the registry has no matching version', async () => {
    const result = await fetchConfigSchemaSnapshot(
      '@example/plugin-missing',
      '1.0.0',
      (async () => new Response('not found', { status: 404 })) as typeof fetch,
    );

    assert.deepEqual(result, {
      status: 'unavailable',
      lastAttemptAt: result.lastAttemptAt,
      reason: 'npm-not-found',
    });
  });
});
