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
import { pluginManifestSchema } from './manifest';

const legacyManifest = {
  title: 'Example',
  author: 'Example Inc.',
  authorUrl: 'https://example.com',
  category: 'Monitoring',
  description: 'Shows service health.',
  documentation: 'https://example.com/docs',
  npmPackageName: '@example/backstage-plugin-example',
  addedDate: '2026-01-02',
  status: 'active',
};

const checkedAt = '2026-08-03T12:00:00.000Z';

describe('pluginManifestSchema', () => {
  it('accepts an existing manifest without optional detail metadata', () => {
    assert.equal(pluginManifestSchema.parse(legacyManifest).title, 'Example');
  });

  it('accepts capabilities and a fresh source snapshot', () => {
    const manifest = pluginManifestSchema.parse({
      ...legacyManifest,
      capabilities: ['standalone-page', 'permissions'],
      snapshot: {
        backstage: {
          status: 'fresh',
          lastAttemptAt: checkedAt,
          checkedAt,
          version: '1.42.0',
          sourceUrl:
            'https://github.com/example/backstage-plugin-example/blob/main/backstage.json',
          sourcePath: 'backstage.json',
        },
        packages: [
          {
            npmPackageName: '@example/plugin-example',
            npm: {
              status: 'fresh',
              lastAttemptAt: checkedAt,
              checkedAt,
              latestVersion: '1.2.3',
              lastPublishedAt: '2026-08-02T08:30:00.000Z',
              repository: {
                url: 'https://github.com/example/backstage-plugin-example',
                directory: 'plugins/example',
              },
            },
            configSchema: {
              status: 'unavailable',
              lastAttemptAt: checkedAt,
              reason: 'config-schema-not-declared',
            },
          },
        ],
      },
    });

    assert.deepEqual(manifest.capabilities, ['standalone-page', 'permissions']);
    assert.equal(manifest.snapshot?.packages[0].npm.status, 'fresh');
    assert.equal(manifest.snapshot?.backstage.status, 'fresh');
  });

  it('accepts fresh and stale npm release snapshots without a repository', () => {
    const fresh = pluginManifestSchema.parse({
      ...legacyManifest,
      snapshot: {
        backstage: {
          status: 'unavailable',
          lastAttemptAt: checkedAt,
          reason: 'repository-unsupported',
        },
        packages: [
          {
            npmPackageName: '@example/plugin-example',
            npm: {
              status: 'fresh',
              lastAttemptAt: checkedAt,
              checkedAt,
              latestVersion: '0.3.3',
              lastPublishedAt: '2023-05-07T14:51:25.719Z',
            },
            configSchema: {
              status: 'unavailable',
              lastAttemptAt: checkedAt,
              reason: 'config-schema-not-declared',
            },
          },
        ],
      },
    });
    const stale = pluginManifestSchema.parse({
      ...legacyManifest,
      snapshot: {
        backstage: {
          status: 'unavailable',
          lastAttemptAt: checkedAt,
          reason: 'repository-unsupported',
        },
        packages: [
          {
            npmPackageName: '@example/plugin-example',
            npm: {
              status: 'stale',
              lastAttemptAt: checkedAt,
              reason: 'npm-invalid-response',
              checkedAt: '2026-08-01T08:30:00.000Z',
              latestVersion: '0.3.3',
              lastPublishedAt: '2023-05-07T14:51:25.719Z',
            },
            configSchema: {
              status: 'unavailable',
              lastAttemptAt: checkedAt,
              reason: 'config-schema-not-declared',
            },
          },
        ],
      },
    });

    assert.equal(fresh.snapshot?.packages[0].npm.status, 'fresh');
    assert.equal(stale.snapshot?.packages[0].npm.status, 'stale');
    assert.equal(
      Object.hasOwn(fresh.snapshot?.packages[0].npm ?? {}, 'repository'),
      false,
    );
    assert.equal(
      Object.hasOwn(stale.snapshot?.packages[0].npm ?? {}, 'repository'),
      false,
    );
  });

  it('rejects an unknown capability', () => {
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        capabilities: ['unknown-surface'],
      }),
    );
  });

  it('rejects a manually authored setup field', () => {
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        setup: { packages: [] },
      }),
    );
  });

  it('rejects invalid calendar dates in legacy date fields', () => {
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        addedDate: '2026-99-02',
      }),
    );
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        staleSince: '2026-02-30',
      }),
    );
  });

  it('accepts dependencyNames on npm snapshots and internalDependencies on packages', () => {
    const manifest = pluginManifestSchema.parse({
      ...legacyManifest,
      snapshot: {
        backstage: {
          status: 'unavailable',
          lastAttemptAt: checkedAt,
          reason: 'repository-unsupported',
        },
        packages: [
          {
            npmPackageName: '@example/plugin-example-backend',
            functionality: 'backend',
            internalDependencies: ['@example/plugin-example-common'],
            npm: {
              status: 'fresh',
              lastAttemptAt: checkedAt,
              checkedAt,
              latestVersion: '1.2.3',
              lastPublishedAt: '2026-08-02T08:30:00.000Z',
              dependencyNames: ['@example/plugin-example-common', 'zod'],
            },
            configSchema: {
              status: 'unavailable',
              lastAttemptAt: checkedAt,
              reason: 'config-schema-not-declared',
            },
          },
        ],
      },
    });

    const [backendPackage] = manifest.snapshot!.packages;
    assert.deepEqual(backendPackage.internalDependencies, [
      '@example/plugin-example-common',
    ]);
    assert.deepEqual(
      backendPackage.npm.status === 'fresh' &&
        backendPackage.npm.dependencyNames,
      ['@example/plugin-example-common', 'zod'],
    );
  });
});
