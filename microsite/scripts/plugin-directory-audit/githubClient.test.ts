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
import {
  GitHubSnapshotClient,
  selectBackstageJsonPath,
} from './githubClient';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('selectBackstageJsonPath', () => {
  it('selects the nearest ancestor, falls back to root, and ignores unrelated workspaces', () => {
    assert.equal(
      selectBackstageJsonPath(
        [
          'backstage.json',
          'workspaces/kubernetes/backstage.json',
          'workspaces/kubernetes/plugins/frontend/package.json',
        ],
        'workspaces/kubernetes/plugins/frontend',
      ),
      'workspaces/kubernetes/backstage.json',
    );
    assert.equal(selectBackstageJsonPath(['backstage.json']), 'backstage.json');
    assert.equal(
      selectBackstageJsonPath(
        ['workspaces/other/backstage.json'],
        'workspaces/kubernetes/plugins/frontend',
      ),
      undefined,
    );
  });
});

describe('GitHubSnapshotClient', () => {
  it('caches in-flight repository and tree requests across packages in one repository', async () => {
    const requests: Array<{ url: string; authorization: string | null }> = [];
    const fetchImpl = (async (
      input: string | URL | Request,
      init?: RequestInit,
    ) => {
      const url = input.toString();
      requests.push({
        url,
        authorization: new Headers(init?.headers).get('authorization'),
      });

      if (url === 'https://api.github.com/repos/example/plugins') {
        return jsonResponse({ default_branch: 'main' });
      }
      if (
        url ===
        'https://api.github.com/repos/example/plugins/git/trees/main?recursive=1'
      ) {
        return jsonResponse({
          tree: [
            { path: 'backstage.json', type: 'blob' },
            { path: 'packages/search/backstage.json', type: 'blob' },
          ],
        });
      }
      if (
        url ===
        'https://api.github.com/repos/example/plugins/contents/packages/search/backstage.json?ref=main'
      ) {
        return jsonResponse({ version: '1.42.0' });
      }
      if (
        url ===
        'https://api.github.com/repos/example/plugins/contents/backstage.json?ref=main'
      ) {
        return jsonResponse({ version: '1.40.0' });
      }

      return jsonResponse({ message: 'Not found' }, 404);
    }) as typeof fetch;
    const client = new GitHubSnapshotClient({
      fetchImpl,
      token: 'github-token',
    });

    const [search, catalog] = await Promise.all([
      client.fetchBackstageSnapshot({
        owner: 'example',
        repository: 'plugins',
        directory: 'packages/search/plugin',
      }),
      client.fetchBackstageSnapshot({
        owner: 'example',
        repository: 'plugins',
        directory: 'packages/catalog/plugin',
      }),
    ]);

    assert.equal(search.status, 'fresh');
    assert.equal(catalog.status, 'fresh');
    if (search.status === 'fresh') {
      assert.equal(search.version, '1.42.0');
      assert.equal(search.sourcePath, 'packages/search/backstage.json');
      assert.equal(
        search.sourceUrl,
        'https://github.com/example/plugins/blob/main/packages/search/backstage.json',
      );
      assert.equal(search.checkedAt, search.lastAttemptAt);
    }
    if (catalog.status === 'fresh') {
      assert.equal(catalog.version, '1.40.0');
      assert.equal(catalog.sourcePath, 'backstage.json');
    }

    assert.equal(
      requests.filter(request => request.url.endsWith('/example/plugins'))
        .length,
      1,
    );
    assert.equal(
      requests.filter(request => request.url.includes('/git/trees/')).length,
      1,
    );
    assert.ok(
      requests.every(request => request.authorization === 'Bearer github-token'),
    );
    assert.ok(requests.every(request => !request.url.includes('github-token')));
  });

  it('uses the canonical Backstage workspace version for Backstage packages', async () => {
    const fetchImpl = (async (input: string | URL | Request) => {
      const url = input.toString();
      if (url === 'https://api.github.com/repos/backstage/backstage') {
        return jsonResponse({ default_branch: 'master' });
      }
      if (url.includes('/git/trees/master')) {
        return jsonResponse({
          tree: [{ path: 'workspaces/ui/backstage.json', type: 'blob' }],
        });
      }
      if (url.includes('/contents/workspaces/ui/backstage.json')) {
        return jsonResponse({ version: '1.50.0' });
      }
      return jsonResponse({}, 404);
    }) as typeof fetch;

    const snapshot = await new GitHubSnapshotClient({
      fetchImpl,
    }).fetchBackstageSnapshot({
      owner: 'backstage',
      repository: 'backstage',
      directory: 'plugins/kubernetes',
    });

    assert.equal(snapshot.status, 'fresh');
    if (snapshot.status === 'fresh') {
      assert.equal(snapshot.version, '1.50.0');
      assert.equal(snapshot.sourcePath, 'workspaces/ui/backstage.json');
    }
  });

  it('normalizes leading dot segments and rejects parent directory segments', async () => {
    let requestCount = 0;
    const fetchImpl = (async (input: string | URL | Request) => {
      requestCount += 1;
      const url = input.toString();
      if (url === 'https://api.github.com/repos/example/plugins') {
        return jsonResponse({ default_branch: 'develop' });
      }
      if (url.includes('/git/trees/develop')) {
        return jsonResponse({
          tree: [{ path: 'workspaces/team/backstage.json', type: 'blob' }],
        });
      }
      if (url.includes('/contents/workspaces/team/backstage.json')) {
        return jsonResponse({ version: '1.41.2' });
      }
      return jsonResponse({}, 404);
    }) as typeof fetch;
    const client = new GitHubSnapshotClient({ fetchImpl });

    const normalized = await client.fetchBackstageSnapshot({
      owner: 'example',
      repository: 'plugins',
      directory: './workspaces/team/plugins/frontend',
    });
    const invalid = await client.fetchBackstageSnapshot({
      owner: 'example',
      repository: 'plugins',
      directory: 'workspaces/team/../other',
    });

    assert.equal(normalized.status, 'fresh');
    if (normalized.status === 'fresh') {
      assert.equal(normalized.sourcePath, 'workspaces/team/backstage.json');
    }
    assert.equal(invalid.status, 'unavailable');
    if (invalid.status === 'unavailable') {
      assert.equal(invalid.reason, 'repository-directory-invalid');
    }
    assert.equal(requestCount, 3);
  });

  it('requires a string version in the selected backstage.json', async () => {
    const fetchImpl = (async (input: string | URL | Request) => {
      const url = input.toString();
      if (url === 'https://api.github.com/repos/example/plugins') {
        return jsonResponse({ default_branch: 'main' });
      }
      if (url.includes('/git/trees/main')) {
        return jsonResponse({ tree: [{ path: 'backstage.json', type: 'blob' }] });
      }
      return jsonResponse({ version: 142 });
    }) as typeof fetch;

    const snapshot = await new GitHubSnapshotClient({
      fetchImpl,
    }).fetchBackstageSnapshot({ owner: 'example', repository: 'plugins' });

    assert.equal(snapshot.status, 'unavailable');
    if (snapshot.status === 'unavailable') {
      assert.equal(snapshot.reason, 'backstage-json-invalid');
    }
  });
});
