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
import { describe, it } from 'node:test';
import { fetchPackageReadme } from './unpkgClient';

const base = 'https://unpkg.com/@example/plugin-example@1.0.0/';

function listing(...files: Array<{ path: string; size: number }>) {
  // The shape unpkg.com serves, which lists every file in the package.
  return JSON.stringify({
    package: '@example/plugin-example',
    version: '1.0.0',
    prefix: '/',
    files: files.map(file => ({
      type: 'text/markdown',
      integrity: 'sha256-example',
      ...file,
    })),
  });
}

// Serves the given responses by URL and records every request.
function fakeFetch(responses: Record<string, string | Response>): {
  fetchImpl: typeof fetch;
  requested: string[];
  redirectModes: Array<RequestInit['redirect']>;
} {
  const requested: string[] = [];
  const redirectModes: Array<RequestInit['redirect']> = [];
  const fetchImpl = (async (input: string | URL, init?: RequestInit) => {
    const url = String(input);
    requested.push(url);
    redirectModes.push(init?.redirect);
    const response = responses[url];
    if (response === undefined) {
      return new Response('Not found', { status: 404 });
    }
    return typeof response === 'string' ? new Response(response) : response;
  }) as typeof fetch;
  return { fetchImpl, requested, redirectModes };
}

describe('fetchPackageReadme', () => {
  it('finds the README name with ?meta and loads that file', async () => {
    for (const name of ['README.md', 'readme.md', 'README']) {
      const { fetchImpl, requested } = fakeFetch({
        [`${base}?meta`]: listing(
          { path: '/package.json', size: 10 },
          { path: `/${name}`, size: 10 },
        ),
        [`${base}${name}`]: '# Example\n',
      });

      const result = await fetchPackageReadme(
        '@example/plugin-example',
        '1.0.0',
        fetchImpl,
      );

      assert.deepEqual(result, { status: 'ready', value: '# Example\n' });
      assert.deepEqual(requested, [`${base}?meta`, `${base}${name}`]);
    }
  });

  it('treats a missing or empty README as no README', async () => {
    const none = fakeFetch({
      [`${base}?meta`]: listing({ path: '/package.json', size: 10 }),
    });
    assert.deepEqual(
      await fetchPackageReadme(
        '@example/plugin-example',
        '1.0.0',
        none.fetchImpl,
      ),
      { status: 'ready', value: undefined },
    );
    assert.deepEqual(none.requested, [`${base}?meta`]);

    const empty = fakeFetch({
      [`${base}?meta`]: listing({ path: '/README.md', size: 0 }),
      [`${base}README.md`]: '',
    });
    assert.deepEqual(
      await fetchPackageReadme(
        '@example/plugin-example',
        '1.0.0',
        empty.fetchImpl,
      ),
      { status: 'ready', value: undefined },
    );

    // Only the top-level README counts, not one in a subdirectory.
    const nested = fakeFetch({
      [`${base}?meta`]: listing({ path: '/docs/README.md', size: 10 }),
    });
    assert.deepEqual(
      await fetchPackageReadme(
        '@example/plugin-example',
        '1.0.0',
        nested.fetchImpl,
      ),
      { status: 'ready', value: undefined },
    );
  });

  it('reports an error when unpkg.com cannot be read', async () => {
    const failing = [
      fakeFetch({}).fetchImpl,
      fakeFetch({ [`${base}?meta`]: '{ not json' }).fetchImpl,
      fakeFetch({
        [`${base}?meta`]: listing({ path: '/README.md', size: 10 }),
        [`${base}README.md`]: new Response('Server error', { status: 500 }),
      }).fetchImpl,
    ];

    for (const fetchImpl of failing) {
      const result = await fetchPackageReadme(
        '@example/plugin-example',
        '1.0.0',
        fetchImpl,
      );
      assert.equal(result.status, 'error');
    }
  });

  it('refuses a README over 1 MiB without downloading it', async () => {
    const { fetchImpl, requested } = fakeFetch({
      [`${base}?meta`]: listing({ path: '/README.md', size: 1024 * 1024 + 1 }),
    });

    const result = await fetchPackageReadme(
      '@example/plugin-example',
      '1.0.0',
      fetchImpl,
    );

    assert.ok(
      result.status === 'error' && /too large/.test(String(result.error)),
    );
    assert.deepEqual(requested, [`${base}?meta`]);
  });

  it('enforces the size limit while reading, whatever ?meta claimed', async () => {
    let pulled = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 64 * 1024;
        controller.enqueue(new Uint8Array(64 * 1024));
      },
    });
    const responses = [
      new Response('# Small', {
        headers: { 'content-length': String(2 * 1024 * 1024) },
      }),
      new Response(stream),
    ];

    for (const response of responses) {
      const result = await fetchPackageReadme(
        '@example/plugin-example',
        '1.0.0',
        fakeFetch({
          [`${base}?meta`]: listing({ path: '/README.md', size: 10 }),
          [`${base}README.md`]: response,
        }).fetchImpl,
      );
      assert.ok(
        result.status === 'error' && /too large/.test(String(result.error)),
      );
    }
    assert.ok(pulled < 2 * 1024 * 1024, `read ${pulled} bytes`);
  });

  it('only talks to unpkg.com about well-formed packages', async () => {
    const { fetchImpl, requested } = fakeFetch({});
    for (const [name, version] of [
      ['example/../../admin', '1.0.0'],
      ['@example/plugin-example', '1.0.0/../../x'],
      ['@example/plugin-example', '1.0.0?x=1'],
    ]) {
      const result = await fetchPackageReadme(name, version, fetchImpl);
      assert.equal(result.status, 'error');
    }
    assert.deepEqual(requested, []);
  });

  it('refuses redirects instead of following them', async () => {
    const { fetchImpl, redirectModes } = fakeFetch({
      [`${base}?meta`]: listing({ path: '/README.md', size: 10 }),
      [`${base}README.md`]: '# Example\n',
    });
    const ok = await fetchPackageReadme(
      '@example/plugin-example',
      '1.0.0',
      fetchImpl,
    );
    assert.equal(ok.status, 'ready');
    assert.deepEqual(redirectModes, ['error', 'error']);

    // This is how fetch reports a redirect when it is told to refuse them.
    const result = await fetchPackageReadme(
      '@example/plugin-example',
      '1.0.0',
      (async () => {
        throw new TypeError('fetch failed');
      }) as typeof fetch,
    );
    assert.equal(result.status, 'error');
  });
});
