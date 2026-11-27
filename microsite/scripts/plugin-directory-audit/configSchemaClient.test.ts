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
import { describe, it } from 'node:test';
import { fetchConfigSchema } from './configSchemaClient';

type Files = Record<string, string | Response>;

// Serves files for example@1.0.0 the way unpkg.com does and records requests.
function unpkg(files: Files): { fetchImpl: typeof fetch; requested: string[] } {
  const requested: string[] = [];
  const fetchImpl = (async (input: string | URL) => {
    const url = String(input);
    requested.push(url);
    const prefix = 'https://unpkg.com/example@1.0.0/';
    const file = url.startsWith(prefix) ? files[url.slice(prefix.length)] : '';
    if (file === undefined) {
      return new Response('Not found', { status: 404 });
    }
    return typeof file === 'string' ? new Response(file) : file;
  }) as typeof fetch;
  return { fetchImpl, requested };
}

const declare = (path: string) => JSON.stringify({ configSchema: path });

// Resolves only by rejecting once the request's signal aborts, like a server
// that never answers. AbortSignal.timeout is replaced with an already aborted
// signal so the test does not wait for the real timeout.
function hangingFetch(): typeof fetch {
  return ((_input: unknown, init?: RequestInit) =>
    new Promise((_resolve, reject) => {
      const signal = init?.signal;
      assert.ok(signal, 'expected the request to carry an abort signal');
      signal.addEventListener('abort', () => reject(signal.reason));
      if (signal.aborted) {
        reject(signal.reason);
      }
    })) as typeof fetch;
}

describe('fetchConfigSchema', () => {
  it('returns the declared JSON schema without unsafe keywords', async () => {
    const { fetchImpl, requested } = unpkg({
      'package.json': declare('./config.d.json'),
      'config.d.json': JSON.stringify({
        type: 'object',
        properties: {
          name: { type: 'string', pattern: '^(a+)+$', format: 'email' },
        },
      }),
    });

    assert.deepEqual(await fetchConfigSchema('example', '1.0.0', fetchImpl), {
      status: 'fresh',
      schema: { type: 'object', properties: { name: { type: 'string' } } },
    });
    assert.deepEqual(requested, [
      'https://unpkg.com/example@1.0.0/package.json',
      'https://unpkg.com/example@1.0.0/config.d.json',
    ]);
  });

  it('keeps the scope of a scoped package in the request', async () => {
    const requested: string[] = [];
    const fetchImpl = (async (input: string | URL) => {
      requested.push(String(input));
      return new Response(JSON.stringify({}));
    }) as typeof fetch;

    await fetchConfigSchema('@backstage/plugin-example', '1.2.3', fetchImpl);

    assert.deepEqual(requested, [
      'https://unpkg.com/@backstage/plugin-example@1.2.3/package.json',
    ]);
  });

  it('reports no schema when none, or only a non-JSON declaration, exists', async () => {
    for (const files of [
      { 'package.json': JSON.stringify({ name: 'example' }) },
      { 'package.json': declare('config.d.ts') },
      { 'package.json': declare('missing.json') },
    ]) {
      assert.deepEqual(
        await fetchConfigSchema('example', '1.0.0', unpkg(files).fetchImpl),
        { status: 'fresh', schema: undefined },
      );
    }
  });

  it('reports a reason when the schema is unusable or the download fails', async () => {
    const reasonFor = async (files: Files) => {
      const result = await fetchConfigSchema(
        'example',
        '1.0.0',
        unpkg(files).fetchImpl,
      );
      return result.status === 'unavailable' ? result.reason : result.status;
    };

    assert.equal(
      await reasonFor({
        'package.json': declare('config.json'),
        'config.json': '{ not json',
      }),
      'config-schema-invalid',
    );
    assert.equal(
      await reasonFor({
        'package.json': declare('config.json'),
        'config.json': JSON.stringify({
          type: 'string',
          description: 'x'.repeat(70 * 1024),
        }),
      }),
      'config-schema-too-large',
    );
    assert.equal(
      await reasonFor({
        'package.json': declare('config.json'),
        'config.json': new Response('Server error', { status: 500 }),
      }),
      'config-schema-fetch-failed',
    );
    assert.equal(await reasonFor({}), 'config-schema-fetch-failed');
    assert.equal(
      await reasonFor({ 'package.json': '{ not json' }),
      'config-schema-fetch-failed',
    );
  });

  it('enforces the size limit while reading, not after', async () => {
    const oversizedBody = 'x'.repeat(2 * 1024 * 1024);
    const reasonFor = async (schemaResponse: Response) => {
      const result = await fetchConfigSchema(
        'example',
        '1.0.0',
        unpkg({
          'package.json': declare('config.json'),
          'config.json': schemaResponse,
        }).fetchImpl,
      );
      return result.status === 'unavailable' ? result.reason : result.status;
    };

    assert.equal(
      await reasonFor(
        new Response('{}', { headers: { 'content-length': '2097152' } }),
      ),
      'config-schema-too-large',
    );

    let pulled = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 64 * 1024;
        controller.enqueue(new Uint8Array(64 * 1024));
      },
    });
    assert.equal(
      await reasonFor(new Response(stream)),
      'config-schema-too-large',
    );
    assert.ok(pulled < 2 * 1024 * 1024, `read ${pulled} bytes`);
    assert.equal(
      await reasonFor(new Response(oversizedBody)),
      'config-schema-too-large',
    );
  });

  it('refuses declared paths that leave the package or the host', async () => {
    for (const path of [
      '../other/config.json',
      '/etc/config.json',
      'https://evil.example.com/config.json',
      'a/../../config.json',
      'config%2e%2e.json',
    ]) {
      const { fetchImpl, requested } = unpkg({
        'package.json': declare(path),
      });

      assert.deepEqual(await fetchConfigSchema('example', '1.0.0', fetchImpl), {
        status: 'unavailable',
        reason: 'config-schema-invalid',
      });
      assert.deepEqual(requested, [
        'https://unpkg.com/example@1.0.0/package.json',
      ]);
    }
  });

  it('refuses package names and versions that could change the URL', async () => {
    const requested: string[] = [];
    const fetchImpl = (async (input: string | URL) => {
      requested.push(String(input));
      return new Response('{}');
    }) as typeof fetch;

    for (const [name, version] of [
      ['example/../../admin', '1.0.0'],
      ['example', '1.0.0/../../x'],
      ['example', '1.0.0?x=1'],
    ]) {
      assert.deepEqual(await fetchConfigSchema(name, version, fetchImpl), {
        status: 'unavailable',
        reason: 'config-schema-fetch-failed',
      });
    }
    assert.deepEqual(requested, []);
  });

  it('refuses a response that was redirected away from unpkg.com', async () => {
    const response = new Response('{}');
    Object.defineProperty(response, 'url', {
      value: 'https://evil.example.com/package.json',
    });

    assert.deepEqual(
      await fetchConfigSchema(
        'example',
        '1.0.0',
        (async () => response) as typeof fetch,
      ),
      { status: 'unavailable', reason: 'config-schema-fetch-failed' },
    );
  });

  it('gives up on an unpkg request that never responds', async t => {
    t.mock.method(AbortSignal, 'timeout', () => AbortSignal.abort());

    assert.deepEqual(
      await fetchConfigSchema('example', '1.0.0', hangingFetch()),
      { status: 'unavailable', reason: 'config-schema-fetch-failed' },
    );
  });
});
