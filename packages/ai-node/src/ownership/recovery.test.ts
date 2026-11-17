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

/*
 * Await × failure × cleanup matrix.
 *
 * This table is the specification of the single admission lifetime boundary
 * (`AdmissionLifetime` in ./recovery.ts). Every cell is the boundary handling
 * that interleaving, and is covered by the test named in the last column.
 *
 * | # | Await point / event | Failure mode | Required boundary behaviour (finalization) | Test |
 * |---|---------------------|--------------|-------------------------------------------|------|
 * | 1 | initial authority read | DB error | before the bracket: no admission open, error propagates | N/A: nothing to finalize |
 * | 2 | precheck outcome write | DB error | before the bracket: no admission open, error propagates | N/A: nothing to finalize |
 * | 3 | lease acquisition (`open`) | DB error / no row acquired | acquire is one conditional statement: nothing is held | N/A: by construction |
 * | 4 | lease acquisition (`open`) | live lease elsewhere | no credentials, no resolver, no write; report persisted status + skip | `skips a session whose lease another replica holds` |
 * | 5 | credentials | throws / not a service principal | persist blocked-credentials, then revoke (`session-closed`) | `blocks service work when fresh credentials are not service credentials` |
 * | 6 | admission snapshot | superseded before admission | revoke (`authority-superseded`), persist nothing, decide again | `does not admit a resume decided from a superseded origin record` |
 * | 7 | resolver | throws | persist failed, revoke (`session-closed`) | `records a resolver failure and an unknown resolution visibly` |
 * | 8 | resolver | declines (blocked/failed) | persist outcome, revoke (`session-closed`), fence released | `releases the lease of a resume that declined the session` |
 * | 9 | resolver | fence lost while it runs | persist failed (never recovered), revoke | `never reports a resume as recovered after its fence was lost mid-flight` |
 * | 10 | outcome write | DB error | revoke on the way out, then rethrow | `finalizes the admission when recording the outcome fails` |
 * | 11 | outcome write | CAS loss (superseded mid-resume) | revoke (`authority-superseded`), report the persisted status | `revokes a resume admitted from a snapshot superseded right after it was read`, `never overwrites a dispatch-unknown marker recorded while a resume was running` |
 * | 12 | outcome write → hand-off | fence lost while the CAS waits | dispose revokes (`fence-lost`), `recovered` is rewritten to failed | `re-validates the fence after the outcome write, so a CAS that lands after fence loss is not recovered` |
 * | 13 | hand-off | success | keepalive stops, fence stays live, resume keeps it | `resumes service-origin work under fresh same-plugin service credentials` |
 * | 14 | concurrent `recover()` on one instance | second pass competes | unique per-admission owner: second pass skips, winner's fence untouched | `gives every concurrent pass its own admission so a loser cannot release the winner` |
 * | 15 | post-hand-off fresh read | newer record landed | report the persisted status instead of `recovered` | N/A: same fresh-read code path as #12, no deterministic post-write seam |
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
import type { LeaseInvalidationReason } from './types';
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
  admissionSnapshotGate?: (namespace: Namespace) => void | Promise<void>;
  admissionKeepaliveMs?: number;
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
    admissionSnapshotGate: options.admissionSnapshotGate,
    admissionKeepaliveMs: options.admissionKeepaliveMs,
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
  const fence = await state.lease.acquire(key, 'replica-a');
  if (fence !== undefined) await state.lease.release(fence);
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

function deferred<T = void>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

/** Inserts a recovery record directly, as another writer or probe would. */
async function insertRawSession(
  state: Fixture,
  overrides: Record<string, unknown>,
) {
  await state.db('ai_recovery_sessions').insert({
    plugin_id: pluginId,
    session_id: namespace.sessionId,
    origin_kind: 'service',
    origin_user_id: null,
    origin_service_plugin_id: pluginId,
    definition_version: 'v1',
    dispatch_unknown: false,
    status: 'pending',
    detail: null,
    revision: 0,
    updated_at: state.db.fn.now(),
    ...overrides,
  });
}

function gateCredentials(state: Fixture) {
  const requested = deferred();
  const release = deferred<BackstageCredentials>();
  state.getOwnServiceCredentials.mockImplementation(async () => {
    requested.resolve();
    return release.promise;
  });
  return { requested: requested.promise, release };
}

/** Makes the outcome write for `recovered` fail, as a real database error. */
async function failRecoveredOutcomeWrites(
  state: Fixture,
  engine: 'sqlite' | 'pg',
) {
  if (engine === 'sqlite') {
    await state.db.raw(
      `CREATE TRIGGER ai_recovery_fail BEFORE UPDATE ON ai_recovery_sessions
       WHEN NEW.status = 'recovered'
       BEGIN SELECT RAISE(ABORT, 'simulated outcome write failure'); END`,
    );
    return;
  }
  await state.db.raw(
    `CREATE FUNCTION ai_recovery_fail() RETURNS trigger AS $$
     BEGIN RAISE EXCEPTION 'simulated outcome write failure'; END;
     $$ LANGUAGE plpgsql`,
  );
  await state.db.raw(
    `CREATE TRIGGER ai_recovery_fail BEFORE UPDATE ON ai_recovery_sessions
     FOR EACH ROW WHEN (NEW.status = 'recovered')
     EXECUTE FUNCTION ai_recovery_fail()`,
  );
}

async function waitForLockWait(
  db: Knex,
  table: string,
  timeoutMs = 5_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { rows } = await db.raw(
      `select count(*)::int as waiting from pg_stat_activity
       where wait_event_type = 'Lock' and query ilike ?
         and pid <> pg_backend_pid()`,
      [`%${table}%`],
    );
    if (rows[0].waiting > 0) return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('Timed out waiting for the outcome write to block');
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
    // The admission was finalized: the fence is free for the next replica.
    expect(await current.lease.acquire(namespace, 'replica-b')).toBeDefined();
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
    expect(await current.lease.acquire(namespace, 'replica-b')).toBeDefined();

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

  it('blocks a foreign service-plugin origin without consulting credentials or resuming', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await current.lease.acquire(namespace, 'replica-a');
    await insertRawSession(current, {
      origin_service_plugin_id: 'someone-else',
    });

    const report = await current.recovery.recover();

    expect(report.outcomes[0]).toEqual({
      namespace,
      status: 'blocked-credentials',
      detail:
        "The session originated as service work for the 'someone-else' plugin and cannot be resumed as the 'consumer' plugin",
    });
    expect(current.getOwnServiceCredentials).not.toHaveBeenCalled();
    expect(resume).not.toHaveBeenCalled();
    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.origin_service_plugin_id).toBe('someone-else');
    expect(raw.status).toBe('blocked-credentials');
  });

  it('never overwrites a dispatch-unknown marker recorded while a resume was running', async () => {
    const started = deferred();
    const release = deferred();
    current.recovery.registerResolver(
      resolver({
        resume: async (_input: RecoveryResumeInput) => {
          started.resolve();
          await release.promise;
          return { kind: 'resumed' as const };
        },
      }),
    );
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });

    const pass = current.recovery.recover();
    await started.promise;
    // A send attempt whose outcome is unknown lands mid-resume.
    await current.recovery.markDispatchUnknown(namespace);
    release.resolve();

    const report = await pass;
    expect(report.outcomes[0].status).toBe('unknown-dispatch-outcome');

    const raw = await current.db('ai_recovery_sessions').first();
    expect(Boolean(raw.dispatch_unknown)).toBe(true);
    expect(raw.status).toBe('unknown-dispatch-outcome');

    // The durable uncertainty still wins on the next pass.
    const again = await current.recovery.recover();
    expect(again.outcomes[0].status).toBe('unknown-dispatch-outcome');
  });

  it('refuses to relabel a service-origin session while its resume is admitted', async () => {
    current.recovery.registerResolver(resolver());
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });
    const gate = gateCredentials(current);

    const pass = current.recovery.recover();
    await gate.requested;

    await expect(
      current.recovery.recordSession({
        namespace,
        origin: { kind: 'user', userId: 'user:default/alice' },
        definitionVersion: 'v1',
      }),
    ).rejects.toThrow('immutable for its execution generation');

    gate.release.resolve(serviceCredentials());
    const report = await pass;

    expect(report.outcomes[0].status).toBe('recovered');
    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.origin_kind).toBe('service');
    expect(raw.origin_service_plugin_id).toBe(pluginId);
    expect(raw.status).toBe('recovered');
  });

  it('does not admit a resume decided from a superseded origin record', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });
    const gate = gateCredentials(current);

    const pass = current.recovery.recover();
    await gate.requested;

    // Another writer replaces the authority record after enumeration started.
    await current
      .db('ai_recovery_sessions')
      .where({ plugin_id: pluginId, session_id: namespace.sessionId })
      .update({
        origin_kind: 'user',
        origin_user_id: 'user:default/alice',
        origin_service_plugin_id: null,
        revision: current.db.raw('revision + 1'),
      });

    gate.release.resolve(serviceCredentials());
    const report = await pass;

    expect(report.outcomes[0].status).toBe('needs-reauth');
    expect(resume).not.toHaveBeenCalled();
    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.origin_kind).toBe('user');
    expect(raw.status).toBe('needs-reauth');
  });

  it('does not admit a resume for a definition version that changed after enumeration', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });
    const gate = gateCredentials(current);

    const pass = current.recovery.recover();
    await gate.requested;

    await current
      .db('ai_recovery_sessions')
      .where({ plugin_id: pluginId, session_id: namespace.sessionId })
      .update({ definition_version: 'v2' });

    gate.release.resolve(serviceCredentials());
    const report = await pass;

    expect(report.outcomes[0].status).toBe('blocked-definition');
    expect(report.outcomes[0].detail).toContain("definition version 'v2'");
    expect(resume).not.toHaveBeenCalled();
  });

  it('skips a session whose lease another replica holds', async () => {
    const resume = jest.fn(async (_input: RecoveryResumeInput) => ({
      kind: 'resumed' as const,
    }));
    current.recovery.registerResolver(resolver({ resume }));
    current.recovery.completeStartup();
    await current.lease.acquire(namespace, 'replica-a');
    await current.recovery.recordSession({
      namespace,
      origin: { kind: 'service', pluginId },
      definitionVersion: 'v1',
    });

    const report = await current.recovery.recover();

    expect(report.outcomes[0]).toEqual({
      namespace,
      status: 'pending',
      detail: 'Skipped: another replica holds the session lease',
    });
    expect(resume).not.toHaveBeenCalled();
    expect(current.getOwnServiceCredentials).not.toHaveBeenCalled();
  });

  it('revokes a resume admitted from a snapshot superseded right after it was read', async () => {
    const snapshotRead = deferred();
    const snapshotReleased = deferred();
    const resumeStarted = deferred();
    const resumeRelease = deferred();
    const invalidations: LeaseInvalidationReason[] = [];
    let harnessClosed = false;
    let acquiredFence: { owner: string; token: string } | undefined;

    await current.cleanup();
    current = await fixture(engine, {
      admissionSnapshotGate: async () => {
        snapshotRead.resolve();
        await snapshotReleased.promise;
      },
    });
    current.recovery.registerResolver(
      resolver({
        resume: async (input: RecoveryResumeInput) => {
          // The resume opens work under the lease recovery acquired for it.
          acquiredFence = {
            owner: input.admission.fence.owner,
            token: input.admission.fence.token,
          };
          input.admission.onInvalidated(reason => {
            invalidations.push(reason);
          });
          input.admission.registerCleanup(async () => {
            harnessClosed = true;
          });
          resumeStarted.resolve();
          await resumeRelease.promise;
          return { kind: 'resumed' as const };
        },
      }),
    );
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });

    const pass = current.recovery.recover();
    // The admission snapshot was read; its delivery is paused here.
    await snapshotRead.promise;

    // Meanwhile another connection supersedes the authority record: user
    // origin plus an unknown dispatch outcome, on a newer revision.
    await current.recovery.markDispatchUnknown(namespace);
    await current
      .db('ai_recovery_sessions')
      .where({ plugin_id: pluginId, session_id: namespace.sessionId })
      .update({
        origin_kind: 'user',
        origin_user_id: 'user:default/alice',
        origin_service_plugin_id: null,
        revision: current.db.raw('revision + 1'),
      });

    // Deliver the saved snapshot: the stale admission is taken and the resume
    // runs with service credentials under a lease it now holds.
    snapshotReleased.resolve();
    await resumeStarted.promise;
    expect(acquiredFence).toBeDefined();

    resumeRelease.resolve();
    const report = await pass;

    // The persisted record wins, and the superseded resume is torn down.
    expect(report.outcomes[0].status).toBe('unknown-dispatch-outcome');
    expect(invalidations).toEqual(['authority-superseded']);
    expect(harnessClosed).toBe(true);

    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.status).toBe('unknown-dispatch-outcome');
    expect(Boolean(raw.dispatch_unknown)).toBe(true);
    expect(raw.origin_kind).toBe('user');

    // The fence the invalidated resume held is released, conditionally, so a
    // successor takes over with the next token instead of blocking forever.
    const takeover = await current.lease.acquire(namespace, 'replica-b');
    expect(takeover).toBeDefined();
    expect(Number(takeover!.token)).toBe(Number(acquiredFence!.token) + 1);

    // And the next pass never resumes under the superseded authority.
    const again = await current.recovery.recover();
    expect(again.outcomes[0].status).toBe('unknown-dispatch-outcome');
    expect(invalidations).toEqual(['authority-superseded']);
  }, 20_000);

  it('releases the lease of a resume that declined the session', async () => {
    let closed = false;
    current.recovery.registerResolver(
      resolver({
        resume: async (input: RecoveryResumeInput) => {
          input.admission.registerCleanup(async () => {
            closed = true;
          });
          return {
            kind: 'blocked-definition' as const,
            reason: 'the stored definitions no longer load',
          };
        },
      }),
    );
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });

    const report = await current.recovery.recover();

    expect(report.outcomes[0].status).toBe('blocked-definition');
    expect(closed).toBe(true);
    // persist() acquired token 1, recovery acquired and released token 2.
    expect(await current.lease.acquire(namespace, 'replica-b')).toEqual({
      namespace,
      owner: 'replica-b',
      token: '3',
    });
  });

  it('never reports a resume as recovered after its fence was lost mid-flight', async () => {
    await current.cleanup();
    current = await fixture(engine, { admissionKeepaliveMs: 10 });
    const invalidated = deferred<LeaseInvalidationReason>();
    current.recovery.registerResolver(
      resolver({
        resume: async (input: RecoveryResumeInput) => {
          input.admission.onInvalidated(reason => invalidated.resolve(reason));
          // A successor takes the lease while the resume is still working.
          current.clock.advance(60_001);
          await current.lease.acquire(namespace, 'replica-b');
          await invalidated.promise;
          return { kind: 'resumed' as const };
        },
      }),
    );
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });

    const report = await current.recovery.recover();

    expect(report.outcomes[0].status).toBe('failed');
    expect(report.outcomes[0].detail).toContain('lease was lost');
    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.status).toBe('failed');
  });

  it('gives every concurrent pass its own admission so a loser cannot release the winner', async () => {
    const resumeStarted = deferred();
    const resumeRelease = deferred();
    let winner: { owner: string; token: string } | undefined;
    current.recovery.registerResolver(
      resolver({
        resume: async (input: RecoveryResumeInput) => {
          winner = {
            owner: input.admission.fence.owner,
            token: input.admission.fence.token,
          };
          resumeStarted.resolve();
          await resumeRelease.promise;
          return { kind: 'resumed' as const };
        },
      }),
    );
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });

    const first = current.recovery.recover();
    await resumeStarted.promise;

    // A second pass on the SAME instance while the first holds the lease.
    const second = await current.recovery.recover();
    expect(second.outcomes[0]).toEqual({
      namespace,
      status: 'pending',
      detail: 'Skipped: another replica holds the session lease',
    });

    resumeRelease.resolve();
    const firstReport = await first;
    expect(firstReport.outcomes[0].status).toBe('recovered');

    // The winner's admission was not invalidated and its fence is still live,
    // because the loser never shared or released it.
    expect(winner!.owner).toContain('recovery:consumer:');
    expect(
      await current.lease.renew({
        namespace,
        owner: winner!.owner,
        token: winner!.token,
      }),
    ).toBe(true);
    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.status).toBe('recovered');
  });

  it('finalizes the admission when recording the outcome fails', async () => {
    let cleanedUp = false;
    let invalidatedWith: LeaseInvalidationReason | undefined;
    current.recovery.registerResolver(
      resolver({
        resume: async (input: RecoveryResumeInput) => {
          input.admission.onInvalidated(reason => {
            invalidatedWith = reason;
          });
          input.admission.registerCleanup(async () => {
            cleanedUp = true;
          });
          return { kind: 'resumed' as const };
        },
      }),
    );
    current.recovery.completeStartup();
    await persist(current, namespace, { kind: 'service', pluginId });
    await failRecoveredOutcomeWrites(current, engine);

    await expect(current.recovery.recover()).rejects.toThrow(
      'simulated outcome write failure',
    );

    // The boundary finalized on the error path: cleanup ran, the resume was
    // told to stop, and the fence was released for the next replica.
    expect(cleanedUp).toBe(true);
    expect(invalidatedWith).toBe('session-closed');
    expect(await current.lease.acquire(namespace, 'replica-b')).toBeDefined();
    const raw = await current.db('ai_recovery_sessions').first();
    expect(raw.status).toBe('pending');
  });
});

if (pgUrl) {
  it('re-validates the fence after the outcome write, so a CAS that lands after fence loss is not recovered', async () => {
    const state = await fixture('pg', { admissionKeepaliveMs: 10 });
    const invalidated = deferred<LeaseInvalidationReason>();
    const cleanup = deferred();
    try {
      state.recovery.registerResolver(
        resolver({
          resume: async (input: RecoveryResumeInput) => {
            input.admission.onInvalidated(reason =>
              invalidated.resolve(reason),
            );
            input.admission.registerCleanup(async () => cleanup.resolve());
            return { kind: 'resumed' as const };
          },
        }),
      );
      state.recovery.completeStartup();
      await persist(state, namespace, { kind: 'service', pluginId });

      // Hold the recovery row so the outcome write waits behind the lock.
      const blocker = await state.db.transaction();
      await blocker('ai_recovery_sessions')
        .where({ plugin_id: pluginId, session_id: namespace.sessionId })
        .forUpdate()
        .select('session_id')
        .first();

      const pass = state.recovery.recover();
      await waitForLockWait(state.db, 'ai_recovery_sessions');

      // The fence is lost while the outcome CAS is still waiting, and the
      // keepalive notices before the write lands.
      state.clock.advance(60_001);
      await expect(invalidated.promise).resolves.toBe('renewal-rejected');
      await expect(cleanup.promise).resolves.toBeUndefined();

      await blocker.rollback();
      const report = await pass;

      // The write landed after invalidation, so the freshest state decides:
      // never 'recovered', and the persisted row says so too.
      expect(report.outcomes[0].status).toBe('failed');
      expect(report.outcomes[0].detail).toContain(
        'lease was lost while the outcome was recorded',
      );
      const raw = await state.db('ai_recovery_sessions').first();
      expect(raw.status).toBe('failed');
      expect(await state.lease.acquire(namespace, 'replica-b')).toBeDefined();
    } finally {
      await state.cleanup();
    }
  }, 20_000);
}
