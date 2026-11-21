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

import { mock } from 'node:test';

type ReadmeResult = string | undefined | Error;

/**
 * Replaces `fetch` with a fake unpkg.com that serves the README returned by
 * `readme(name, version)`. Return `undefined` for a package without a README
 * and an `Error` to make the request fail. Call `mock.restoreAll()` to undo.
 */
export function mockUnpkgReadmes(
  readme: (name: string, version: string) => ReadmeResult,
) {
  return mock.method(globalThis, 'fetch', async (input: URL | string) => {
    const url = new URL(String(input));
    const match = /^\/((?:@[^/]+\/)?[^/@]+)@([^/]+)\/(.*)$/.exec(url.pathname);
    if (url.hostname !== 'unpkg.com' || !match) {
      return new Response('Not found', { status: 404 });
    }
    const [, name, version, file] = match;
    const result = readme(name, version);
    if (result instanceof Error) {
      throw result;
    }
    if (file === '') {
      const files =
        result === undefined
          ? []
          : [{ path: '/README.md', size: result.length }];
      return new Response(JSON.stringify({ files }));
    }
    return new Response(result ?? '');
  });
}
