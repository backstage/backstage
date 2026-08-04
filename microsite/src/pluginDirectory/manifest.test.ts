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

  it('accepts complete frontend setup and fresh source snapshots', () => {
    const manifest = pluginManifestSchema.parse({
      ...legacyManifest,
      capabilities: ['standalone-page', 'permissions'],
      setup: {
        packages: [
          {
            name: '@example/backstage-plugin-example',
            role: 'frontend',
          },
        ],
        frontend: {
          routes: [
            {
              name: 'ExamplePage',
              type: 'provided',
              description: 'Shows the example standalone page.',
            },
          ],
          extensions: [
            {
              id: 'example.page',
              kind: 'page',
              description: 'Adds the example page extension.',
              enabledByDefault: true,
            },
          ],
        },
        integration: [
          {
            title: 'Install the frontend plugin',
            explanation: 'Register the plugin with the frontend app.',
            language: 'ts',
            source: "import examplePlugin from '@example/backstage-plugin-example';",
          },
        ],
        config: {
          schema: {
            type: 'object',
            properties: {
              example: {
                type: 'object',
                properties: {
                  endpoint: {
                    type: 'string',
                    default: 'https://example.com/api',
                    description: 'Example service URL.',
                    'x-ui': { label: 'Service URL' },
                  },
                  retries: {
                    type: 'integer',
                    enum: [1, 3, 5],
                    default: 3,
                  },
                  token: {
                    type: 'string',
                    'x-ui': { secretEnv: 'EXAMPLE_TOKEN' },
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: ['primary', 'secondary'],
                    },
                  },
                },
                required: ['endpoint', 'token'],
              },
            },
            required: ['example'],
          },
        },
      },
      snapshot: {
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
        backstage: {
          status: 'fresh',
          lastAttemptAt: checkedAt,
          checkedAt,
          version: '1.42.0',
          sourceUrl:
            'https://github.com/example/backstage-plugin-example/blob/main/backstage.json',
          sourcePath: 'backstage.json',
        },
      },
    });

    assert.equal(manifest.setup?.frontend?.routes[0].type, 'provided');
    assert.equal(manifest.setup?.frontend?.extensions[0].id, 'example.page');
    assert.equal(manifest.setup?.integration[0].language, 'ts');
    assert.equal(manifest.snapshot?.npm.status, 'fresh');
    assert.equal(manifest.snapshot?.backstage.status, 'fresh');
  });

  it('accepts fresh and stale npm release snapshots without a repository', () => {
    const fresh = pluginManifestSchema.parse({
      ...legacyManifest,
      snapshot: {
        npm: {
          status: 'fresh',
          lastAttemptAt: checkedAt,
          checkedAt,
          latestVersion: '0.3.3',
          lastPublishedAt: '2023-05-07T14:51:25.719Z',
        },
        backstage: {
          status: 'unavailable',
          lastAttemptAt: checkedAt,
          reason: 'repository-unsupported',
        },
      },
    });
    const stale = pluginManifestSchema.parse({
      ...legacyManifest,
      snapshot: {
        npm: {
          status: 'stale',
          lastAttemptAt: checkedAt,
          reason: 'npm-invalid-response',
          checkedAt: '2026-08-01T08:30:00.000Z',
          latestVersion: '0.3.3',
          lastPublishedAt: '2023-05-07T14:51:25.719Z',
        },
        backstage: {
          status: 'unavailable',
          lastAttemptAt: checkedAt,
          reason: 'repository-unsupported',
        },
      },
    });

    assert.equal(fresh.snapshot?.npm.status, 'fresh');
    assert.equal(stale.snapshot?.npm.status, 'stale');
    assert.equal(
      Object.hasOwn(fresh.snapshot?.npm ?? {}, 'repository'),
      false,
    );
    assert.equal(
      Object.hasOwn(stale.snapshot?.npm ?? {}, 'repository'),
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

  it('rejects a secret default', () => {
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        setup: {
          config: {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  default: 'real-secret',
                  'x-ui': { secretEnv: 'EXAMPLE_TOKEN' },
                },
              },
            },
          },
        },
      }),
    );
  });

  it('rejects secret metadata on non-string fields', () => {
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        setup: {
          config: {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'number',
                  'x-ui': { secretEnv: 'EXAMPLE_TOKEN' },
                },
              },
            },
          },
        },
      }),
    );
  });

  it('rejects duplicate or undeclared required configuration fields', () => {
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        setup: {
          config: {
            schema: {
              type: 'object',
              properties: {
                endpoint: { type: 'string' },
              },
              required: ['endpoint', 'endpoint'],
            },
          },
        },
      }),
    );
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        setup: {
          config: {
            schema: {
              type: 'object',
              properties: {
                endpoint: { type: 'string' },
              },
              required: ['missing'],
            },
          },
        },
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

  it('rejects unsupported configuration keywords', () => {
    assert.throws(() =>
      pluginManifestSchema.parse({
        ...legacyManifest,
        setup: {
          config: {
            schema: {
              type: 'object',
              properties: {
                services: {
                  type: 'object',
                  patternProperties: {},
                },
              },
            },
          },
        },
      }),
    );
  });
});
