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

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import knex, { type Knex } from 'knex';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { Namespace } from '../contracts';
import {
  createAiRecovery,
  type AiRecovery,
  type RecoveryResolver,
  type RecoveryResumeInput,
} from './recovery';
import { createManualClock, createMemoryNamespaceLease } from './testing';
import type { MemoryNamespaceLease } from './testing';
import type { NamespaceLease } from './types';

const storageMigration = require('../../migrations/1000_storage');
const recoveryMigration = require('../../migrations/3000_ownership_recovery');

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

const pluginId = 'consumer';
const namespace: Namespace = { pluginId, sessionId: 'session-a' };

const serviceCredentials = (subject = 'plugin:consumer') =>
  ({
    $$type: '@backstage/BackstageCredentials',
    principal: { type: 'service', subject },
  } as BackstageCredentials);

const userCredentials = () =>
  ({
    $$type: '@backstage/BackstageCredentials',
    principal: { type: 'user', userEntityRef: 'user:default/someone' },
  } as BackstageCredentials);

type Fixture = {
  db: Knex;
  lease: MemoryNamespaceLease;
  clock: ReturnType<typeof createManualClock>;
  recovery: AiRecovery;
  getOwnServiceCredentials: jest.Mock<Promise<BackstageCredentials>>;
  cleanup(): Promise<void>;
};

type FixtureOptions = {
  pageSize?: number;
  credentials?: () => Promise<BackstageCredentials>;
};

async function fixture(
  engine: 'sqlite' | 'pg',
  options: FixtureOptions = {},
): Promise<Fixture> {
  let db: Knex;
  let cleanup: () => Promise<void>;
  if (engine === 'sqlite') {
    const dir = await mkdtemp(join(tmpdir(), 'ai-recovery-'));
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: join(dir, 'recovery.sqlite') },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
    await db.raw('PRAGMA busy_timeout = 5000');
    cleanup = async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    };
  } else {
    const admin = knex({ client: 'pg', connection: pgUrl });
    const schema = `ai_recovery_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    cleanup = async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    };
  }
  await storageMigration.up(db);
  await recoveryMigration.up(db);

  const clock = createManualClock();
  const lease = createMemoryNamespaceLease({ clock, ttlMs: 60_000 });
  const getOwnServiceCredentials = jest.fn(
    options.credentials ?? (async () => serviceCredentials()),
  );
  const recovery = await createAiRecovery({
    db,
    pluginId,
    leases: lease as NamespaceLease,
    getOwnServiceCredentials,
    pageSize: options.pageSize,
  });
  return {
    db,
    lease,
    clock,
    recovery,
    getOwnServiceCredentials,
    cleanup,
  };
}

/** Acquires the lease row so recovery enumeration sees the namespace. */
async function persist(
  state: Fixture,
  key: Namespace,
  origin:
    | { kind: 'user'; userId: string }
    | { kind: 'service'; pluginId: string },
  definitionVersion = 'v1',
) {
  await state.lease.acquire(key, 'replica-a');
  await state.recovery.recordSession({
    namespace: key,
    origin,
    definitionVersion,
  });
}

function resolver(overrides: Partial<RecoveryResolver> = {}): RecoveryResolver {
  return {
    pluginId,
    versions: ['v1'],
    resume: async () => ({ kind: 'resumed' }),
    ...overrides,
  };
}

const engines: [string, 'sqlite' | 'pg'][] = [['sqlite', 'sqlite']];
if (pgUrl) engines.push(['postgres', 'pg']);
else
  it.skip('PostgreSQL recovery tests require AI_TEST_POSTGRES_URL', () => {});

describe.each(engines)('%s startup recovery', (_name, engine) => {
  let current: Fixture;

  beforeEach(async () => {
    current = await fixture(engine);
  });

  afterEach(async () => {
    await current.cleanup();
  });

  it('refuses to enumerate before startup completes and to register afterwards', async () => {
    await expect(current.recovery.recover()).rejects.toThrow(
      'before startup recovery resolvers are registered',
    );

    current.recovery.registerResolver(resolver());
    current.recovery.completeStartup();

    expect(() => current.recovery.registerResolver(resolver())).toThrow(
      'must be registered during startup, before enumeration',
    );
    await expect(current.recovery.recover()).resolves.toEqual({
      examined: 0,
      outcomes: [],
      next: undefined,
    });
  });

  it('rejects conflicting and foreign resolver registrations without partial registration', async () => {
    current.recovery.registerResolver(resolver({ versions: ['v1', 'v2'] }));

    expect(() =>
      current.recovery.registerResolver(resolver({ versions: ['v2'] })),
    ).toThrow(
      "Conflicting recovery resolver for the 'consumer' plugin definition version 'v2'",
    );

    expect(() =>
      current.recovery.registerResolver(resolver({ versions: ['v3', 'v2'] })),
    ).toThrow("definition version 'v2'");

    // The rejected resolver's non-conflicting version was never registered.
    current.recovery.completeStartup();
    await persist(
      current,
      { pluginId, sessionId: 'session-v3' },
      { kind: 'service', pluginId },
      'v3',
    );
    const report = await current.recovery.recover();
    expect(report.outcomes).toEqual([
      expect.objectContaining({ status: 'blocked-definition' }),
    ]);

    expect(() =>
      current.recovery.registerResolver(resolver({ pluginId: 'someone-else' })),
    ).toThrow('must be registered during startup');
  });

  it('rejects a resolver without versions, a duplicate version, an empty version and a foreign plugin', async () => {
    expect(() =>
      current.recovery.registerResolver(resolver({ pluginId: 'someone-else' })),
    ).toThrow("cannot be registered with the 'consumer' plugin");
    expect(() =>
      current.recovery.registerResolver(resolver({ versions: [] })),
    ).toThrow('must declare at least one definition version');
    expect(() =>
      current.recovery.registerResolver(resolver({ versions: ['v1', 'v1'] })),
    ).toThrow('declares a duplicate definition version');
    expect(() =>
      current.recovery.registerResolver(resolver({ versions: [''] })),
    ).toThrow('declares an empty definition version');
  });

  it('resumes service-origin work under fresh same-plugin service credentials', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });

    const report = await current.recovery.recover();

    expect(report.outcomes).toEqual([
      { namespace, status: 'recovered', detail: undefined },
    ]);
    expect(current.getOwnServiceCredentials).toHaveBeenCalledTimes(1);
    const input = resume.mock.calls[0][0];
    expect(input.namespace).toEqual(namespace);
    expect(input.definitionVersion).toBe('v1');
    expect(input.origin).toEqual({ kind: 'service', pluginId });
    expect(input.credentials).toEqual(serviceCredentials());

    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.status).toBe('recovered');
    expect(raw.origin_kind).toBe('service');
    expect(raw.origin_service_plugin_id).toBe(pluginId);
    // No credential material is persisted with the recovery record.
    expect(JSON.stringify(raw)).not.toContain('BackstageCredentials');
  });

  it('keeps user-origin work paused instead of resuming it as a service identity', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await persist(current, namespace, {
      kind: 'user',
      userId: 'user:default/someone',
    });

    const report = await current.recovery.recover();

    expect(report.outcomes[0].status).toBe('needs-reauth');
    expect(resume).not.toHaveBeenCalled();
    expect(current.getOwnServiceCredentials).not.toHaveBeenCalled();
    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.origin_kind).toBe('user');
    expect(raw.origin_user_id).toBe('user:default/someone');
    expect(raw.origin_service_plugin_id).toBeNull();
  });

  it('blocks a session whose definition version has no resolver instead of substituting one', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ versions: ['v2'], resume }));
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId }, 'v1');

    const report = await current.recovery.recover();

    expect(report.outcomes[0].status).toBe('blocked-definition');
    expect(report.outcomes[0].detail).toContain("definition version 'v1'");
    expect(resume).not.toHaveBeenCalled();
    expect(current.getOwnServiceCredentials).not.toHaveBeenCalled();
  });

  it('blocks service work when fresh credentials are not service credentials', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });
    current.getOwnServiceCredentials.mockResolvedValueOnce(userCredentials());

    const report = await current.recovery.recover();

    expect(report.outcomes[0].status).toBe('blocked-credentials');
    expect(resume).not.toHaveBeenCalled();
  });

  it('blocks service work when its own credentials cannot be obtained', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });
    current.getOwnServiceCredentials.mockRejectedValueOnce(
      new Error('token source unavailable'),
    );

    const report = await current.recovery.recover();

    expect(report.outcomes[0].status).toBe('blocked-credentials');
    expect(report.outcomes[0].detail).toContain('token source unavailable');
    expect(resume).not.toHaveBeenCalled();
  });

  it('keeps an unknown dispatch outcome distinct and durably recorded', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });
    await current.recovery.markDispatchUnknown(namespace);

    const report = await current.recovery.recover();

    expect(report.outcomes[0].status).toBe('unknown-dispatch-outcome');
    expect(resume).not.toHaveBeenCalled();
    // Recording the session again never clears the durable uncertainty.
    await current.recovery.recordSession({
      namespace,
      origin: { kind: 'service', pluginId },
      definitionVersion: 'v1',
    });
    const raw = await current.db('ai_recovery_sessions').first();
    expect(Boolean(raw.dispatch_unknown)).toBe(true);
    expect(raw.status).toBe('unknown-dispatch-outcome');
  });

  it('records a resolver failure and an unknown resolution visibly', async () => {
    current.recovery.registerResolver(
      resolver({
        resume: async () => {
          throw new Error('registry reconstruction failed');
        },
      }),
    );
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });

    let report = await current.recovery.recover();
    expect(report.outcomes[0]).toEqual({
      namespace,
      status: 'failed',
      detail: 'registry reconstruction failed',
    });

    const second = await fixture(engine);
    try {
      second.recovery.registerResolver(
        resolver({
          resume: async () => ({ kind: 'unexpected' } as never),
        }),
      );
      second.recovery.completeStartup();
      await persist(second, namespace, { kind: 'service', pluginId });

      report = await second.recovery.recover();
      expect(report.outcomes[0].status).toBe('failed');
      expect(report.outcomes[0].detail).toContain('unknown resolution');
    } finally {
      await second.cleanup();
    }
  });

  it('examines every namespace across pages and reports resolver decisions', async () => {
    await current.cleanup();
    current = await fixture(engine, { pageSize: 2 });
    current.recovery.registerResolver(resolver());
    current.recovery.completeStartup();

    const sessions = ['s1', 's2', 's3', 's4', 's5'];
    for (const [index, sessionId] of sessions.entries()) {
      const key = { pluginId, sessionId };
      if (index === 0) {
        await persist(current, key, { kind: 'user', userId: 'user:default/x' });
      } else if (index === 1) {
        await persist(current, key, { kind: 'service', pluginId }, 'v9');
      } else {
        await persist(current, key, { kind: 'service', pluginId });
      }
    }
    // A namespace with no persisted session has no work and is not reported.
    await current.lease.acquire(
      { pluginId, sessionId: 's0-empty' },
      'replica-a',
    );

    const outcomes: Record<string, string> = {};
    let cursor: string | undefined;
    do {
      const report = await current.recovery.recover({ cursor, limit: 2 });
      for (const outcome of report.outcomes) {
        outcomes[outcome.namespace.sessionId] = outcome.status;
      }
      cursor = report.next;
    } while (cursor !== undefined);

    expect(outcomes).toEqual({
      s1: 'needs-reauth',
      s2: 'blocked-definition',
      s3: 'recovered',
      s4: 'recovered',
      s5: 'recovered',
    });

    const rows = await current.db('ai_recovery_sessions').count({ count: '*' });
    expect(Number(rows[0].count)).toBe(5);
    expect(await current.recovery.statusOf(namespace)).toBeUndefined();
    expect(
      await current.recovery.statusOf({ pluginId, sessionId: 's1' }),
    ).toEqual({
      status: 'needs-reauth',
      detail:
        'User user:default/x must reauthorize this session before its work resumes',
    });
  });

  it('rejects sessions and dispatch markers of another plugin', async () => {
    await expect(
      current.recovery.recordSession({
        namespace: { pluginId: 'other', sessionId: 'x' },
        origin: { kind: 'service', pluginId },
        definitionVersion: 'v1',
      }),
    ).rejects.toThrow("cannot handle sessions of the 'other' plugin");
    await expect(
      current.recovery.markDispatchUnknown({ pluginId, sessionId: 'missing' }),
    ).rejects.toThrow('unknown AI session');
  });
});
