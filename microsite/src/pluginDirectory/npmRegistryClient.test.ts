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
import {
  fetchPackageConfigSchema,
  fetchPackageReadme,
} from './npmRegistryClient';

async function buildTarball(
  packageJson: Record<string, unknown>,
  extraFiles: Record<string, string> = {},
): Promise<Buffer> {
  const root = await mkdtemp(join(tmpdir(), 'npm-registry-client-fixture-'));
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
    await create({ gzip: true, cwd: root, file: tarballPath }, ['package']);
    return await readFile(tarballPath);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

const tarballUrl = 'https://registry.npmjs.org/example/-/example-1.0.0.tgz';

function fakeFetch(
  versionBody: Record<string, unknown>,
  tarballBuffer?: Buffer,
): typeof fetch {
  return (async (url: string | URL) => {
    if (tarballBuffer && String(url) === tarballUrl) {
      return new Response(tarballBuffer);
    }
    return new Response(JSON.stringify(versionBody), {
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;
}

describe('fetchPackageReadme', () => {
  it('reads README.md out of the tarball', async () => {
    const tarball = await buildTarball(
      { name: '@example/plugin-example' },
      { 'README.md': '# Example\n' },
    );

    const result = await fetchPackageReadme(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch({ dist: { tarball: tarballUrl } }, tarball),
    );
    assert.deepEqual(result, { status: 'ready', value: '# Example\n' });
  });

  it('matches README.md case-insensitively', async () => {
    const tarball = await buildTarball(
      { name: '@example/plugin-example' },
      { 'readme.md': '# Example\n' },
    );

    const result = await fetchPackageReadme(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch({ dist: { tarball: tarballUrl } }, tarball),
    );
    assert.deepEqual(result, { status: 'ready', value: '# Example\n' });
  });

  it('treats a missing README file as no README', async () => {
    const tarball = await buildTarball({ name: '@example/plugin-example' });

    const result = await fetchPackageReadme(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch({ dist: { tarball: tarballUrl } }, tarball),
    );
    assert.deepEqual(result, { status: 'ready', value: undefined });
  });

  it('reports an error when the registry request fails', async () => {
    const result = await fetchPackageReadme(
      '@example/plugin-missing',
      '1.0.0',
      (async () =>
        new Response('not found', { status: 404 })) as typeof fetch,
    );
    assert.equal(result.status, 'error');
  });
});

describe('fetchPackageConfigSchema', () => {
  it('reads a published config schema out of the tarball', async () => {
    const schema = {
      type: 'object',
      properties: { catalog: { type: 'object' } },
    };
    const tarball = await buildTarball(
      { name: '@example/plugin-example', configSchema: 'config.schema.json' },
      { 'config.schema.json': JSON.stringify(schema) },
    );

    const result = await fetchPackageConfigSchema(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch({ dist: { tarball: tarballUrl } }, tarball),
    );

    assert.deepEqual(result, { status: 'ready', value: schema });
  });

  it('returns no schema when the package has no configSchema field', async () => {
    const tarball = await buildTarball({ name: '@example/plugin-example' });

    const result = await fetchPackageConfigSchema(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch({ dist: { tarball: tarballUrl } }, tarball),
    );

    assert.deepEqual(result, { status: 'ready', value: undefined });
  });

  it('returns no schema when the declared path is not a .json file', async () => {
    const tarball = await buildTarball({
      name: '@example/plugin-example',
      configSchema: 'config.d.ts',
    });

    const result = await fetchPackageConfigSchema(
      '@example/plugin-example',
      '1.0.0',
      fakeFetch({ dist: { tarball: tarballUrl } }, tarball),
    );

    assert.deepEqual(result, { status: 'ready', value: undefined });
  });

  it('reports an error when the registry has no matching version', async () => {
    const result = await fetchPackageConfigSchema(
      '@example/plugin-missing',
      '1.0.0',
      (async () =>
        new Response('not found', { status: 404 })) as typeof fetch,
    );

    assert.equal(result.status, 'error');
  });

  it('reports an error when the tarball fails to download', async () => {
    const result = await fetchPackageConfigSchema(
      '@example/plugin-example',
      '1.0.0',
      (async (url: string | URL) => {
        if (String(url) === tarballUrl) {
          return new Response('nope', { status: 500 });
        }
        return new Response(JSON.stringify({ dist: { tarball: tarballUrl } }));
      }) as typeof fetch,
    );

    assert.equal(result.status, 'error');
  });
});
