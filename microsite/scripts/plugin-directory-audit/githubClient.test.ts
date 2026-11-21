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
  selectCanonicalPackages,
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

describe('selectCanonicalPackages', () => {
  it('groups sibling frontend/backend/common/module packages and excludes unrelated ones', () => {
    const treePaths = [
      'plugins/catalog/package.json',
      'plugins/catalog-backend/package.json',
      'plugins/catalog-common/package.json',
      'plugins/catalog-node/package.json',
      'plugins/catalog-react/package.json',
      'plugins/catalog-backend-module-logs/package.json',
      'plugins/catalog-import/package.json',
      'plugins/kubernetes/package.json',
    ];

    assert.deepEqual(selectCanonicalPackages(treePaths, 'plugins/catalog'), [
      {
        functionality: 'frontend',
        npmPackageName: '@backstage/plugin-catalog',
        sourcePath: 'plugins/catalog/package.json',
      },
      {
        functionality: 'backend-module',
        npmPackageName: '@backstage/plugin-catalog-backend-module-logs',
        sourcePath: 'plugins/catalog-backend-module-logs/package.json',
      },
      {
        functionality: 'backend',
        npmPackageName: '@backstage/plugin-catalog-backend',
        sourcePath: 'plugins/catalog-backend/package.json',
      },
      {
        functionality: 'common',
        npmPackageName: '@backstage/plugin-catalog-common',
        sourcePath: 'plugins/catalog-common/package.json',
      },
      {
        functionality: 'node',
        npmPackageName: '@backstage/plugin-catalog-node',
        sourcePath: 'plugins/catalog-node/package.json',
      },
      {
        functionality: 'react',
        npmPackageName: '@backstage/plugin-catalog-react',
        sourcePath: 'plugins/catalog-react/package.json',
      },
    ]);
  });

  it('resolves a backend-only plugin to its own single-entry family', () => {
    assert.deepEqual(
      selectCanonicalPackages(
        ['plugins/kubernetes-backend/package.json'],
        'plugins/kubernetes-backend',
      ),
      [
        {
          functionality: 'backend',
          npmPackageName: '@backstage/plugin-kubernetes-backend',
          sourcePath: 'plugins/kubernetes-backend/package.json',
        },
      ],
    );
  });

  it('returns nothing outside the plugins/ folder', () => {
    assert.deepEqual(
      selectCanonicalPackages(
        ['packages/core-plugin-api/package.json'],
        'packages/core-plugin-api',
      ),
      [],
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
      requests.every(
        request => request.authorization === 'Bearer github-token',
      ),
    );
    assert.ok(requests.every(request => !request.url.includes('github-token')));
  });

  it('uses the latest stable git tag as the canonical Backstage version', async () => {
    const requestedUrls: string[] = [];
    const fetchImpl = (async (input: string | URL | Request) => {
      const url = input.toString();
      requestedUrls.push(url);
      if (
        url ===
        'https://api.github.com/repos/backstage/backstage/tags?per_page=100&page=1'
      ) {
        return jsonResponse([
          { name: 'v1.54.0-next.1' },
          { name: 'v1.54.0-next.0' },
          { name: 'v1.53.1' },
          { name: 'v1.53.0' },
        ]);
      }
      if (url.includes('/git/trees/v1.53.1')) {
        return jsonResponse({
          tree: [{ path: 'plugins/kubernetes/package.json', type: 'blob' }],
        });
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
      assert.equal(snapshot.version, '1.53.1');
      assert.equal(snapshot.sourcePath, 'plugins/kubernetes/package.json');
      assert.equal(
        snapshot.sourceUrl,
        'https://github.com/backstage/backstage/releases/tag/v1.53.1',
      );
    }
    assert.ok(requestedUrls.every(url => !url.includes('/contents/')));
  });

  it('fetches the latest stable Backstage release version', async () => {
    const fetchImpl = (async (input: string | URL | Request) => {
      const url = input.toString();
      if (
        url ===
        'https://api.github.com/repos/backstage/backstage/tags?per_page=100&page=1'
      ) {
        return jsonResponse([
          { name: 'v1.54.0-next.1' },
          { name: 'v1.53.1' },
          { name: 'v1.53.0' },
        ]);
      }
      return jsonResponse({}, 404);
    }) as typeof fetch;

    const version = await new GitHubSnapshotClient({
      fetchImpl,
    }).fetchLatestBackstageVersion();

    assert.equal(version, '1.53.1');
  });

  it('discovers the sibling package family for a backstage/backstage plugin', async () => {
    const fetchImpl = (async (input: string | URL | Request) => {
      const url = input.toString();
      if (url.includes('/tags')) {
        return jsonResponse([{ name: 'v1.53.1' }]);
      }
      if (url.includes('/git/trees/v1.53.1')) {
        return jsonResponse({
          tree: [
            { path: 'plugins/catalog/package.json', type: 'blob' },
            { path: 'plugins/catalog-backend/package.json', type: 'blob' },
            { path: 'plugins/catalog-import/package.json', type: 'blob' },
          ],
        });
      }
      return jsonResponse({}, 404);
    }) as typeof fetch;

    const siblings = await new GitHubSnapshotClient({
      fetchImpl,
    }).discoverCanonicalPackages({
      owner: 'backstage',
      repository: 'backstage',
      directory: 'plugins/catalog',
    });

    assert.deepEqual(siblings, [
      {
        functionality: 'frontend',
        npmPackageName: '@backstage/plugin-catalog',
        sourcePath: 'plugins/catalog/package.json',
      },
      {
        functionality: 'backend',
        npmPackageName: '@backstage/plugin-catalog-backend',
        sourcePath: 'plugins/catalog-backend/package.json',
      },
    ]);
  });

  it('returns undefined when discovering packages for a non-canonical repository', async () => {
    const fetchImpl = (async () => jsonResponse({}, 404)) as typeof fetch;
    const siblings = await new GitHubSnapshotClient({
      fetchImpl,
    }).discoverCanonicalPackages({
      owner: 'example',
      repository: 'plugins',
      directory: 'packages/search',
    });

    assert.equal(siblings, undefined);
  });

  it('pages through tags and reports unavailable when no stable tag exists', async () => {
    const requestedUrls: string[] = [];
    const fetchImpl = (async (input: string | URL | Request) => {
      const url = input.toString();
      requestedUrls.push(url);
      if (
        url.startsWith('https://api.github.com/repos/backstage/backstage/tags')
      ) {
        const page = new URL(url).searchParams.get('page');
        if (page === '1') {
          return jsonResponse(
            Array.from({ length: 100 }, (_, index) => ({
              name: `v1.${100 - index}.0-next.0`,
            })),
          );
        }
        return jsonResponse([{ name: 'v1.0.0-next.0' }]);
      }
      return jsonResponse({}, 404);
    }) as typeof fetch;

    const snapshot = await new GitHubSnapshotClient({
      fetchImpl,
    }).fetchBackstageSnapshot({ owner: 'backstage', repository: 'backstage' });

    assert.equal(snapshot.status, 'unavailable');
    if (snapshot.status === 'unavailable') {
      assert.equal(snapshot.reason, 'backstage-tag-not-found');
    }
    assert.equal(requestedUrls.filter(url => url.includes('/tags')).length, 2);
  });

  it('reports unavailable when the plugin package.json is missing at the resolved tag', async () => {
    const fetchImpl = (async (input: string | URL | Request) => {
      const url = input.toString();
      if (url.includes('/tags')) {
        return jsonResponse([{ name: 'v1.53.1' }]);
      }
      if (url.includes('/git/trees/v1.53.1')) {
        return jsonResponse({ tree: [] });
      }
      return jsonResponse({}, 404);
    }) as typeof fetch;

    const snapshot = await new GitHubSnapshotClient({
      fetchImpl,
    }).fetchBackstageSnapshot({
      owner: 'backstage',
      repository: 'backstage',
      directory: 'plugins/missing',
    });

    assert.equal(snapshot.status, 'unavailable');
    if (snapshot.status === 'unavailable') {
      assert.equal(snapshot.reason, 'backstage-tag-not-found');
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
        return jsonResponse({
          tree: [{ path: 'backstage.json', type: 'blob' }],
        });
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
