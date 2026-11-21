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
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { create } from 'tar';
import { fetchConfigSchema } from './configSchemaClient';

const tarballUrl = 'https://registry.npmjs.org/example/-/example-1.0.0.tgz';

async function buildTarball(files: Record<string, string | Uint8Array>) {
  const root = await mkdtemp(join(tmpdir(), 'config-schema-fixture-'));
  try {
    await mkdir(join(root, 'package'));
    for (const [name, contents] of Object.entries(files)) {
      await writeFile(join(root, 'package', name), contents);
    }
    const tarPath = join(root, 'package.tgz');
    await create({ cwd: root, file: tarPath, gzip: true }, ['package']);
    return new Uint8Array(await readFile(tarPath));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function registry(
  tarball: Uint8Array | undefined,
  distTarball: string = tarballUrl,
): { fetchImpl: typeof fetch; requested: string[] } {
  const requested: string[] = [];
  const fetchImpl = (async (input: string | URL) => {
    const url = String(input);
    requested.push(url);
    if (url === tarballUrl) {
      return tarball
        ? new Response(new Uint8Array(tarball))
        : new Response('missing', { status: 404 });
    }
    return new Response(JSON.stringify({ dist: { tarball: distTarball } }));
  }) as typeof fetch;
  return { fetchImpl, requested };
}

describe('fetchConfigSchema', () => {
  it('returns the declared JSON schema without unsafe keywords', async () => {
    const tarball = await buildTarball({
      'package.json': JSON.stringify({ configSchema: 'config.d.json' }),
      'config.d.json': JSON.stringify({
        type: 'object',
        properties: {
          name: { type: 'string', pattern: '^(a+)+$', format: 'email' },
        },
      }),
    });

    const result = await fetchConfigSchema(
      '@example/plugin',
      '1.0.0',
      registry(tarball).fetchImpl,
    );

    assert.deepEqual(result, {
      status: 'fresh',
      schema: { type: 'object', properties: { name: { type: 'string' } } },
    });
  });

  it('reports no schema when none, or only a non-JSON declaration, exists', async () => {
    for (const files of [
      { 'package.json': JSON.stringify({ name: 'example' }) },
      { 'package.json': JSON.stringify({ configSchema: 'config.d.ts' }) },
      { 'package.json': JSON.stringify({ configSchema: 'missing.json' }) },
    ]) {
      const result = await fetchConfigSchema(
        'example',
        '1.0.0',
        registry(await buildTarball(files)).fetchImpl,
      );
      assert.deepEqual(result, { status: 'fresh', schema: undefined });
    }
  });

  it('reports a reason when the schema is unusable or the download fails', async () => {
    const invalid = await buildTarball({
      'package.json': JSON.stringify({ configSchema: 'config.json' }),
      'config.json': '{ not json',
    });
    const tooLarge = await buildTarball({
      'package.json': JSON.stringify({ configSchema: 'config.json' }),
      'config.json': JSON.stringify({
        type: 'string',
        description: 'x'.repeat(70 * 1024),
      }),
    });

    assert.deepEqual(
      await fetchConfigSchema('example', '1.0.0', registry(invalid).fetchImpl),
      { status: 'unavailable', reason: 'config-schema-invalid' },
    );
    const sourceTooLarge = await buildTarball({
      'package.json': JSON.stringify({ configSchema: 'config.json' }),
      'config.json': JSON.stringify({
        type: 'string',
        description: 'x'.repeat(2 * 1024 * 1024),
      }),
    });

    assert.deepEqual(
      await fetchConfigSchema('example', '1.0.0', registry(tooLarge).fetchImpl),
      { status: 'unavailable', reason: 'config-schema-too-large' },
    );
    assert.deepEqual(
      await fetchConfigSchema(
        'example',
        '1.0.0',
        registry(sourceTooLarge).fetchImpl,
      ),
      { status: 'unavailable', reason: 'config-schema-too-large' },
    );
    assert.deepEqual(
      await fetchConfigSchema(
        'example',
        '1.0.0',
        registry(undefined).fetchImpl,
      ),
      { status: 'unavailable', reason: 'config-schema-fetch-failed' },
    );
  });

  it('stops unpacking a tarball that expands past the size limit', async () => {
    const bomb = await buildTarball({
      'package.json': JSON.stringify({ configSchema: 'config.json' }),
      'padding.bin': new Uint8Array(65 * 1024 * 1024),
    });

    assert.deepEqual(
      await fetchConfigSchema('example', '1.0.0', registry(bomb).fetchImpl),
      { status: 'unavailable', reason: 'config-schema-fetch-failed' },
    );
  });

  it('refuses to download a tarball from outside the npm registry', async () => {
    const { fetchImpl, requested } = registry(
      undefined,
      'https://evil.example.com/example-1.0.0.tgz',
    );

    assert.deepEqual(await fetchConfigSchema('example', '1.0.0', fetchImpl), {
      status: 'unavailable',
      reason: 'config-schema-fetch-failed',
    });
    assert.equal(requested.length, 1);
  });
});
