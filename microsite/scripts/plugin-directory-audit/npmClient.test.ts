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
import { fetchNpmSnapshot } from './npmClient';

function registryFetch(body: unknown, status = 200): typeof fetch {
  return (async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    })) as typeof fetch;
}

describe('fetchNpmSnapshot', () => {
  it('uses the latest release timestamp and normalizes a string GitHub repository', async () => {
    let requestedUrl: string | URL | Request | undefined;
    const fetchImpl = (async (input: string | URL | Request) => {
      requestedUrl = input;
      return registryFetch({
        'dist-tags': { latest: '2.3.4' },
        time: {
          '2.3.4': '2026-07-01T12:00:00.000Z',
          modified: '2026-08-02T12:00:00.000Z',
        },
        repository: 'git+https://github.com/example/backstage-plugins.git',
      })('unused');
    }) as typeof fetch;

    const snapshot = await fetchNpmSnapshot(
      '@example/backstage-plugin-search',
      fetchImpl,
    );

    assert.equal(
      requestedUrl,
      'https://registry.npmjs.org/%40example%2Fbackstage-plugin-search',
    );
    assert.equal(snapshot.status, 'fresh');
    if (snapshot.status !== 'fresh') {
      return;
    }
    assert.equal(snapshot.latestVersion, '2.3.4');
    assert.equal(snapshot.lastPublishedAt, '2026-07-01T12:00:00.000Z');
    assert.deepEqual(snapshot.repository, {
      url: 'https://github.com/example/backstage-plugins',
    });
    assert.equal(snapshot.checkedAt, snapshot.lastAttemptAt);
  });

  it('preserves an object repository directory while normalizing its GitHub URL', async () => {
    const snapshot = await fetchNpmSnapshot(
      'backstage-plugin-example',
      registryFetch({
        'dist-tags': { latest: '1.0.0' },
        time: { '1.0.0': '2026-06-30T08:15:00Z' },
        repository: {
          type: 'git',
          url: 'git+ssh://git@github.com/example/backstage-monorepo.git',
          directory: 'plugins/example',
        },
      }),
    );

    assert.equal(snapshot.status, 'fresh');
    if (snapshot.status !== 'fresh') {
      return;
    }
    assert.deepEqual(snapshot.repository, {
      url: 'https://github.com/example/backstage-monorepo',
      directory: 'plugins/example',
    });
  });

  it('returns unavailable when the latest release has no timestamp', async () => {
    const snapshot = await fetchNpmSnapshot(
      'backstage-plugin-example',
      registryFetch({
        'dist-tags': { latest: '1.0.0' },
        time: { modified: '2026-07-02T08:15:00Z' },
        repository: 'https://github.com/example/backstage-plugin-example',
      }),
    );

    assert.equal(snapshot.status, 'unavailable');
    if (snapshot.status === 'unavailable') {
      assert.equal(snapshot.reason, 'npm-invalid-response');
    }
  });

  it('keeps valid release data when repository metadata is missing or unsupported', async () => {
    const packageWithoutRepository = await fetchNpmSnapshot(
      '@jquad-group/plugin-tekton-pipelines',
      registryFetch({
        'dist-tags': { latest: '0.3.3' },
        time: { '0.3.3': '2023-05-07T14:51:25.719Z' },
      }),
    );
    const packageWithNonGitHubRepository = await fetchNpmSnapshot(
      'gitlab-plugin',
      registryFetch({
        'dist-tags': { latest: '1.0.0' },
        time: { '1.0.0': '2026-06-30T08:15:00Z' },
        repository: 'https://gitlab.com/example/backstage-plugin-example',
      }),
    );

    assert.deepEqual(packageWithoutRepository, {
      status: 'fresh',
      lastAttemptAt: packageWithoutRepository.lastAttemptAt,
      checkedAt: packageWithoutRepository.lastAttemptAt,
      latestVersion: '0.3.3',
      lastPublishedAt: '2023-05-07T14:51:25.719Z',
    });
    assert.deepEqual(packageWithNonGitHubRepository, {
      status: 'fresh',
      lastAttemptAt: packageWithNonGitHubRepository.lastAttemptAt,
      checkedAt: packageWithNonGitHubRepository.lastAttemptAt,
      latestVersion: '1.0.0',
      lastPublishedAt: '2026-06-30T08:15:00Z',
    });
  });

  it('reports missing packages with a stable reason', async () => {
    const missing = await fetchNpmSnapshot(
      'missing-package',
      registryFetch({ error: 'Not found' }, 404),
    );

    assert.equal(missing.status, 'unavailable');
    if (missing.status === 'unavailable') {
      assert.equal(missing.reason, 'npm-not-found');
    }
  });
});
