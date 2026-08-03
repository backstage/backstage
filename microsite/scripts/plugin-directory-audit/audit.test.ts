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
import { dump } from 'js-yaml';
import type {
  BackstageSnapshot,
  NpmSnapshot,
  PluginManifest,
} from '../../src/pluginDirectory/manifest';
import type { GitHubSnapshotClient } from './githubClient';
import { auditManifest, type AuditDependencies } from './audit';
import { runAuditCommand, type AuditOutput } from './index';
import { readManifestFiles } from './manifestStore';

const auditTime = new Date('2026-08-03T12:00:00.000Z');
const attemptAt = auditTime.toISOString();

function manifest(
  status: PluginManifest['status'],
  options: {
    staleSince?: string;
    snapshot?: PluginManifest['snapshot'];
    title?: string;
    npmPackageName?: string;
  } = {},
): PluginManifest {
  return {
    title: options.title ?? 'Example Plugin',
    author: 'Example Author',
    authorUrl: 'https://example.com',
    category: 'Development',
    description: 'An example plugin used to characterize the audit.',
    documentation: 'https://example.com/docs',
    npmPackageName: options.npmPackageName ?? '@example/plugin-example',
    addedDate: '2024-01-01',
    status,
    ...(options.staleSince ? { staleSince: options.staleSince } : {}),
    ...(options.snapshot ? { snapshot: options.snapshot } : {}),
  };
}

function freshNpm(lastPublishedAt: string): NpmSnapshot {
  return {
    status: 'fresh',
    lastAttemptAt: attemptAt,
    checkedAt: attemptAt,
    latestVersion: '1.2.3',
    lastPublishedAt,
    repository: { url: 'https://github.com/example/backstage-plugins' },
  };
}

function freshBackstage(): BackstageSnapshot {
  return {
    status: 'fresh',
    lastAttemptAt: attemptAt,
    checkedAt: attemptAt,
    version: '1.40.0',
    sourceUrl:
      'https://github.com/example/backstage-plugins/blob/main/backstage.json',
    sourcePath: 'backstage.json',
  };
}

function dependencies(
  npm: NpmSnapshot,
  backstage: BackstageSnapshot = freshBackstage(),
): AuditDependencies {
  return {
    fetchNpm: async () => npm,
    github: {
      fetchBackstageSnapshot: async () => backstage,
    } as GitHubSnapshotClient,
    now: () => auditTime,
  };
}

describe('auditManifest status transitions', () => {
  it('marks an active plugin inactive using the latest release timestamp', async () => {
    const result = await auditManifest(
      manifest('active'),
      dependencies(freshNpm('2025-07-01T00:00:00.000Z')),
    );

    assert.equal(result.manifest.status, 'inactive');
    assert.equal(result.manifest.staleSince, '2026-08-03');
    assert.equal(result.manifest.snapshot?.npm.status, 'fresh');
    assert.equal(result.changed, true);
  });

  it('archives an old inactive plugin without replacing its stale date', async () => {
    const result = await auditManifest(
      manifest('inactive', { staleSince: '2025-04-12' }),
      dependencies(freshNpm('2025-07-01T00:00:00.000Z')),
    );

    assert.equal(result.manifest.status, 'archived');
    assert.equal(result.manifest.staleSince, '2025-04-12');
  });

  for (const status of ['inactive', 'archived'] as const) {
    it(`reactivates a recently released ${status} plugin and clears staleSince`, async () => {
      const result = await auditManifest(
        manifest(status, { staleSince: '2025-04-12' }),
        dependencies(freshNpm('2026-07-01T00:00:00.000Z')),
      );

      assert.equal(result.manifest.status, 'active');
      assert.equal(result.manifest.staleSince, undefined);
    });
  }

  it('leaves status metadata unchanged when no transition applies', async () => {
    const input = manifest('active', { staleSince: '2025-04-12' });
    const result = await auditManifest(
      input,
      dependencies(freshNpm('2026-07-01T00:00:00.000Z')),
    );

    assert.equal(result.manifest.status, 'active');
    assert.equal(result.manifest.staleSince, '2025-04-12');
  });
});

describe('auditManifest snapshot failures', () => {
  it('marks previous npm values stale without changing status or Backstage data', async () => {
    const previousNpm = {
      ...freshNpm('2025-07-01T00:00:00.000Z'),
      lastAttemptAt: '2026-07-01T00:00:00.000Z',
      checkedAt: '2026-07-01T00:00:00.000Z',
    } satisfies NpmSnapshot;
    const previousBackstage = {
      ...freshBackstage(),
      lastAttemptAt: '2026-07-01T00:00:00.000Z',
      checkedAt: '2026-07-01T00:00:00.000Z',
    } satisfies BackstageSnapshot;
    let githubCalled = false;
    const input = manifest('active', {
      snapshot: { npm: previousNpm, backstage: previousBackstage },
    });

    const result = await auditManifest(input, {
      fetchNpm: async () => ({
        status: 'unavailable',
        lastAttemptAt: attemptAt,
        reason: 'npm-invalid-response',
      }),
      github: {
        fetchBackstageSnapshot: async () => {
          githubCalled = true;
          return freshBackstage();
        },
      } as GitHubSnapshotClient,
      now: () => auditTime,
    });

    assert.deepEqual(result.manifest.snapshot?.npm, {
      status: 'stale',
      lastAttemptAt: attemptAt,
      reason: 'npm-invalid-response',
      checkedAt: '2026-07-01T00:00:00.000Z',
      latestVersion: '1.2.3',
      lastPublishedAt: '2025-07-01T00:00:00.000Z',
      repository: { url: 'https://github.com/example/backstage-plugins' },
    });
    assert.deepEqual(result.manifest.snapshot?.backstage, previousBackstage);
    assert.equal(result.manifest.status, 'active');
    assert.equal(githubCalled, false);
    assert.match(result.warnings.join('\n'), /npm-invalid-response/);
  });

  it('keeps fresh npm data when the first GitHub lookup is unavailable', async () => {
    const result = await auditManifest(
      manifest('active'),
      dependencies(freshNpm('2026-07-01T00:00:00.000Z'), {
        status: 'unavailable',
        lastAttemptAt: attemptAt,
        reason: 'backstage-json-not-found',
      }),
    );

    assert.equal(result.manifest.snapshot?.npm.status, 'fresh');
    assert.deepEqual(result.manifest.snapshot?.backstage, {
      status: 'unavailable',
      lastAttemptAt: attemptAt,
      reason: 'backstage-json-not-found',
    });
    assert.match(result.warnings.join('\n'), /backstage-json-not-found/);
  });

  it('turns thrown source failures into stable unavailable snapshot state', async () => {
    const result = await auditManifest(manifest('active'), {
      fetchNpm: async () => {
        throw new Error('registry unavailable');
      },
      github: {
        fetchBackstageSnapshot: async () => freshBackstage(),
      } as GitHubSnapshotClient,
      now: () => auditTime,
    });

    assert.deepEqual(result.manifest.snapshot?.npm, {
      status: 'unavailable',
      lastAttemptAt: attemptAt,
      reason: 'npm-request-failed',
    });
    assert.equal(result.manifest.status, 'active');
  });
});

interface OutputEvent {
  method: 'log' | 'warn' | 'table';
  value: unknown;
}

function captureOutput(events: OutputEvent[]): AuditOutput {
  return {
    log: message => events.push({ method: 'log', value: message }),
    warn: message => events.push({ method: 'warn', value: message }),
    table: rows => events.push({ method: 'table', value: rows }),
  };
}

async function withManifestDirectory(
  manifests: Record<string, PluginManifest>,
  run: (directory: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'plugin-audit-cli-'));
  try {
    for (const [filename, value] of Object.entries(manifests)) {
      await writeFile(
        join(directory, filename),
        `---\n${dump(value, { lineWidth: -1, quotingType: "'" })}`,
        'utf8',
      );
    }
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

describe('runAuditCommand', () => {
  it('checks every manifest without writing and prints aggregated warnings last', async () => {
    const failed = manifest('active', {
      title: 'Failed Plugin',
      npmPackageName: '@example/plugin-failed',
    });
    const later = manifest('active', {
      title: 'Later Plugin',
      npmPackageName: '@example/plugin-later',
    });

    await withManifestDirectory(
      { 'failed.yaml': failed, 'later.yaml': later },
      async directory => {
        const paths = [join(directory, 'failed.yaml'), join(directory, 'later.yaml')];
        const before = await Promise.all(paths.map(path => readFile(path, 'utf8')));
        const fetched: string[] = [];
        const events: OutputEvent[] = [];

        const result = await runAuditCommand([], {
          directory,
          dependencies: {
            fetchNpm: async packageName => {
              fetched.push(packageName);
              if (packageName === '@example/plugin-failed') {
                throw new Error('registry unavailable');
              }
              return freshNpm('2025-07-01T00:00:00.000Z');
            },
            github: {
              fetchBackstageSnapshot: async () => freshBackstage(),
            } as GitHubSnapshotClient,
            now: () => auditTime,
          },
          output: captureOutput(events),
        });

        assert.deepEqual(fetched, [
          '@example/plugin-failed',
          '@example/plugin-later',
        ]);
        assert.deepEqual(
          await Promise.all(paths.map(path => readFile(path, 'utf8'))),
          before,
        );
        assert.equal(result.changedFiles, 2);
        assert.equal(result.writtenFiles, 0);
        const tableIndex = events.findIndex(event => event.method === 'table');
        const warningIndex = events.findIndex(event => event.method === 'warn');
        assert.ok(tableIndex >= 0);
        assert.ok(warningIndex > tableIndex);
        assert.match(String(events[warningIndex].value), /Failed Plugin/);
      },
    );
  });

  it('writes every changed fixture with corrected staleSince transitions', async () => {
    await withManifestDirectory(
      {
        'active-old.yaml': manifest('active', {
          title: 'Active Old',
          npmPackageName: '@example/plugin-active-old',
        }),
        'inactive-old.yaml': manifest('inactive', {
          title: 'Inactive Old',
          npmPackageName: '@example/plugin-inactive-old',
          staleSince: '2025-04-12',
        }),
        'archived-new.yaml': manifest('archived', {
          title: 'Archived New',
          npmPackageName: '@example/plugin-archived-new',
          staleSince: '2024-02-20',
        }),
      },
      async directory => {
        const events: OutputEvent[] = [];
        const result = await runAuditCommand(['--audit'], {
          directory,
          dependencies: {
            fetchNpm: async packageName =>
              freshNpm(
                packageName === '@example/plugin-archived-new'
                  ? '2026-07-01T00:00:00.000Z'
                  : '2025-07-01T00:00:00.000Z',
              ),
            github: {
              fetchBackstageSnapshot: async () => freshBackstage(),
            } as GitHubSnapshotClient,
            now: () => auditTime,
          },
          output: captureOutput(events),
        });

        const files = await readManifestFiles(directory);
        const byFilename = new Map(
          files.map(file => [file.filename, file.manifest]),
        );
        assert.deepEqual(
          {
            status: byFilename.get('active-old.yaml')?.status,
            staleSince: byFilename.get('active-old.yaml')?.staleSince,
          },
          { status: 'inactive', staleSince: '2026-08-03' },
        );
        assert.deepEqual(
          {
            status: byFilename.get('inactive-old.yaml')?.status,
            staleSince: byFilename.get('inactive-old.yaml')?.staleSince,
          },
          { status: 'archived', staleSince: '2025-04-12' },
        );
        assert.deepEqual(
          {
            status: byFilename.get('archived-new.yaml')?.status,
            staleSince: byFilename.get('archived-new.yaml')?.staleSince,
          },
          { status: 'active', staleSince: undefined },
        );
        assert.equal(result.changedFiles, 3);
        assert.equal(result.writtenFiles, 3);
        assert.ok(
          events.some(
            event =>
              event.method === 'log' &&
              event.value === 'Total plugins updated: 3',
          ),
        );
        const statusTables = events.filter(event => event.method === 'table');
        assert.equal(statusTables.length, 2);
        const statusRows = statusTables[1].value as Array<{
          oldStatus: PluginManifest['status'];
          newStatus: PluginManifest['status'];
          oldStaleSince?: string;
          newStaleSince?: string;
        }>;
        assert.deepEqual(
          statusRows.map(
            ({
              oldStatus,
              newStatus,
              oldStaleSince,
              newStaleSince,
            }) => ({
              oldStatus,
              newStatus,
              oldStaleSince,
              newStaleSince,
            }),
          ),
          [
            {
              oldStatus: 'active',
              newStatus: 'inactive',
              oldStaleSince: undefined,
              newStaleSince: '2026-08-03',
            },
            {
              oldStatus: 'archived',
              newStatus: 'active',
              oldStaleSince: '2024-02-20',
              newStaleSince: undefined,
            },
            {
              oldStatus: 'inactive',
              newStatus: 'archived',
              oldStaleSince: '2025-04-12',
              newStaleSince: '2025-04-12',
            },
          ],
        );
      },
    );
  });

  it('reports when audit mode has no semantic updates', async () => {
    const unchanged = manifest('active', {
      snapshot: {
        npm: freshNpm('2026-07-01T00:00:00.000Z'),
        backstage: freshBackstage(),
      },
    });

    await withManifestDirectory({ 'unchanged.yaml': unchanged }, async directory => {
      const path = join(directory, 'unchanged.yaml');
      const before = await readFile(path, 'utf8');
      const events: OutputEvent[] = [];
      const result = await runAuditCommand(['--audit'], {
        directory,
        dependencies: dependencies(
          freshNpm('2026-07-01T00:00:00.000Z'),
        ),
        output: captureOutput(events),
      });

      assert.equal(result.changedFiles, 0);
      assert.equal(result.writtenFiles, 0);
      assert.equal(await readFile(path, 'utf8'), before);
      assert.ok(
        events.some(
          event =>
            event.method === 'log' &&
            event.value === 'No plugins required updates.',
        ),
      );
    });
  });

  it('writes refreshed snapshots without reporting a status transition', async () => {
    const previousAttemptAt = '2026-08-01T12:00:00.000Z';
    const refreshed = manifest('active', {
      snapshot: {
        npm: {
          ...freshNpm('2026-07-01T00:00:00.000Z'),
          lastAttemptAt: previousAttemptAt,
          checkedAt: previousAttemptAt,
        },
        backstage: {
          ...freshBackstage(),
          lastAttemptAt: previousAttemptAt,
          checkedAt: previousAttemptAt,
        },
      },
    });

    await withManifestDirectory({ 'refreshed.yaml': refreshed }, async directory => {
      const events: OutputEvent[] = [];
      const result = await runAuditCommand(['--audit'], {
        directory,
        dependencies: dependencies(
          freshNpm('2026-07-01T00:00:00.000Z'),
        ),
        output: captureOutput(events),
      });

      const [written] = await readManifestFiles(directory);
      assert.equal(result.changedFiles, 1);
      assert.equal(result.writtenFiles, 1);
      assert.equal(written.manifest.snapshot?.npm.checkedAt, attemptAt);
      assert.equal(written.manifest.snapshot?.backstage.checkedAt, attemptAt);
      assert.equal(
        events.filter(event => event.method === 'table').length,
        1,
      );
      assert.ok(
        events.some(
          event =>
            event.method === 'log' &&
            event.value === 'No plugins required updates.',
        ),
      );
    });
  });

  it('finishes auditing and reporting before aggregating write failures', async () => {
    const first = manifest('active', {
      title: 'Write Failure',
      npmPackageName: '@example/plugin-write-failure',
    });
    const later = manifest('active', {
      title: 'Later Warning',
      npmPackageName: '@example/plugin-later-warning',
    });

    await withManifestDirectory(
      {
        'a-write-failure.yaml': first,
        'b-later-warning.yaml': later,
      },
      async directory => {
        const failedPath = join(directory, 'a-write-failure.yaml');
        const laterPath = join(directory, 'b-later-warning.yaml');
        const fetched: string[] = [];
        const events: OutputEvent[] = [];

        const rejection = await runAuditCommand(['--audit'], {
          directory,
          dependencies: {
            fetchNpm: async packageName => {
              fetched.push(packageName);
              if (packageName === '@example/plugin-later-warning') {
                throw new Error('registry unavailable');
              }
              await rm(failedPath);
              await mkdir(failedPath);
              return freshNpm('2025-07-01T00:00:00.000Z');
            },
            github: {
              fetchBackstageSnapshot: async () => freshBackstage(),
            } as GitHubSnapshotClient,
            now: () => auditTime,
          },
          output: captureOutput(events),
        }).then(
          () => undefined,
          error => error,
        );

        assert.deepEqual(fetched, [
          '@example/plugin-write-failure',
          '@example/plugin-later-warning',
        ]);
        assert.ok(
          events.some(
            event =>
              event.method === 'warn' &&
              String(event.value).includes('Later Warning'),
          ),
        );
        assert.ok(events.some(event => event.method === 'table'));
        assert.match(
          await readFile(laterPath, 'utf8'),
          /npm:\n\s+status: unavailable/,
        );
        assert.ok(rejection instanceof AggregateError);
        assert.equal(rejection.errors.length, 1);
        assert.match(rejection.message, /1 plugin manifest/);
        assert.match(String(rejection.errors[0]), /a-write-failure\.yaml/);
      },
    );
  });
});
