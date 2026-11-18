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
import type { SchedulerService } from '@backstage/backend-plugin-api';
import { createAttemptJournal, JOURNAL_EVENTS_TABLE } from './knex';
import { JOURNAL_UNCERTAINTY_TABLE, pruneAiJournal } from './retention';
import { scheduleAiJournalPrune } from './pruneRunner';
import type { AttemptDecision, AttemptId } from './types';
import type { AiObservabilityEvent } from '../observability/types';

type ScheduledTask = {
  id: string;
  frequency: { milliseconds: number };
  timeout: { milliseconds: number };
  fn: () => Promise<unknown>;
  signal: AbortSignal;
};

/**
 * A scheduler double: scheduleTask records the invocation and resolves;
 * the test fires the captured task function to stand in for the
 * scheduler's cadence, awaiting the pass result exactly as the real
 * scheduler awaits its task runs.
 */
function mockScheduler() {
  const tasks: ScheduledTask[] = [];
  return {
    tasks,
    service: {
      scheduleTask: async (task: ScheduledTask) => {
        tasks.push(task);
      },
    } as unknown as Pick<SchedulerService, 'scheduleTask'>,
  };
}

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const namespace = { pluginId: 'plugin', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };

const decision: AttemptDecision = {
  actor: 'user:default/alice',
  definitionVersion: 'registry-v1',
  configVersion: 'config-v1',
  operation: 'models.stream',
  attempt: 1,
  decision: 'allow',
};

const HOUR_MS = 60 * 60 * 1000;
const YEAR_MS = 365 * 24 * HOUR_MS;

/** A clock the test advances past the retention window on demand. */
class TestClock {
  #now = new Date();
  advance(ms: number): void {
    this.#now = new Date(this.#now.getTime() + ms);
  }
  now = (): Date => this.#now;
}

type Fixture = {
  db: Knex;
  record(overrides?: Partial<AttemptDecision>): Promise<AttemptId>;
  recordOutcome(attempt: AttemptId, status: string): Promise<void>;
  cleanup(): Promise<void>;
};

async function fixture(pgUrl?: string): Promise<Fixture> {
  let db: Knex;
  let cleanupDb: () => Promise<void>;
  if (pgUrl) {
    const admin = knex({ client: 'pg', connection: pgUrl });
    const schema = `ai_test_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    cleanupDb = async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    };
  } else {
    const dir = await mkdtemp(join(tmpdir(), 'ai-prune-runner-'));
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: join(dir, 'journal.sqlite') },
      useNullAsDefault: true,
    });
    cleanupDb = async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    };
  }
  const journal = createAttemptJournal({
    db,
    authorizer: { authorizeAuditRead: async () => true },
  });
  try {
    await storageMigration.up(db);
    await journalMigration.up(db);
    await db('ai_namespace_leases').insert({
      plugin_id: namespace.pluginId,
      session_id: namespace.sessionId,
      owner_id: fence.owner,
      token: fence.token,
      expires_at: db.raw(
        pgUrl
          ? "statement_timestamp() + (? * interval '1 second')"
          : "(julianday('now') - 2440587.5) * 86400000 + ?",
        [60],
      ),
    });
  } catch (error) {
    await cleanupDb();
    throw error;
  }
  return {
    db,
    record: (overrides = {}) =>
      journal.recordDecisionAndIntent(fence, {
        ...decision,
        callId: `call-${randomUUID()}`,
        ...overrides,
      }),
    recordOutcome: (attempt, status) =>
      journal.recordOutcome(fence, attempt, { status } as never),
    cleanup: cleanupDb,
  };
}

const wait = async (probe: () => Promise<boolean> | boolean) => {
  for (let i = 0; i < 600; i += 1) {
    if (await probe()) return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  throw new Error('probe timeout');
};

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

if (!pgUrl) {
  it.skip('PostgreSQL prune runner tests require AI_TEST_POSTGRES_URL', () => {});
}

for (const dialect of ['sqlite', 'pg'] as const) {
  if (dialect === 'pg' && !pgUrl) continue;

  describe(`journal prune runner (${dialect})`, () => {
    it('runs one pass at start and keeps the retention contract', async () => {
      const f = await fixture(dialect === 'pg' ? pgUrl : undefined);
      try {
        // Settled denial (prunable) and an unresolved send intent (never
        // pruned without its uncertainty record).
        await f.record({ decision: 'deny', reason: 'permission denied' });
        const unresolved = await f.record();
        const clock = new TestClock();

        const events: AiObservabilityEvent[] = [];
        const { tasks, service } = mockScheduler();
        const controller = new AbortController();
        await scheduleAiJournalPrune({
          scheduler: service,
          db: f.db,
          retentionMs: HOUR_MS,
          frequency: { milliseconds: 10_000 },
          emit: event => void events.push(event),
          now: clock.now,
          signal: controller.signal,
        });
        try {
          // The schedule is registered with the catalog maintenance
          // shape: the given frequency, its timeout at 80%, and the
          // caller's abort signal.
          expect(tasks).toHaveLength(1);
          expect(tasks[0].id).toBe('ai_journal_prune');
          expect(tasks[0].frequency).toEqual({ milliseconds: 10_000 });
          expect(tasks[0].timeout).toEqual({ milliseconds: 8_000 });
          expect(tasks[0].signal).toBe(controller.signal);

          // The start pass runs before the window has passed: nothing is
          // pruned yet.
          await wait(() => events.length > 0);
          expect(
            Number((await f.db(JOURNAL_EVENTS_TABLE).count('id as n'))[0].n),
          ).toBe(2);

          // Past the window, the next scheduled pass prunes the settled
          // denial and documents the unresolved intent, exactly as
          // pruneAiJournal would — the schedule adds no retention
          // semantics of its own.
          clock.advance(YEAR_MS);
          await tasks[0].fn();
          const remaining = await f
            .db(JOURNAL_EVENTS_TABLE)
            .select(f.db.raw('CAST(id AS TEXT) AS id'));
          // The settled denial was pruned; only the unresolved intent
          // remains, with its uncertainty record documented.
          expect(remaining).toHaveLength(1);
          expect(remaining.map(row => String(row.id))).toContain(
            String(unresolved),
          );
          expect(await f.db(JOURNAL_UNCERTAINTY_TABLE).select()).not.toEqual(
            [],
          );
        } finally {
          controller.abort();
        }
      } finally {
        await f.cleanup();
      }
    }, 20000);

    it('schedules further passes and stops cleanly', async () => {
      const f = await fixture(dialect === 'pg' ? pgUrl : undefined);
      try {
        await f.record({ decision: 'deny', reason: 'permission denied' });
        const clock = new TestClock();
        clock.advance(YEAR_MS);
        let passes = 0;
        const { tasks, service } = mockScheduler();
        const controller = new AbortController();
        await scheduleAiJournalPrune({
          scheduler: service,
          db: f.db,
          retentionMs: HOUR_MS,
          frequency: { milliseconds: 50 },
          now: clock.now,
          signal: controller.signal,
        });
        try {
          // The scheduled cadence fires repeatedly while the window
          // stays open: each task run is one serialized pass.
          await wait(async () => {
            await tasks[0].fn();
            passes += 1;
            const rows = await f.db(JOURNAL_EVENTS_TABLE).count('id as n');
            return Number(rows[0].n) === 0;
          });
          expect(passes).toBeGreaterThan(0);
        } finally {
          controller.abort();
        }
        // After the abort, a task run is a no-op that resolves without
        // touching the database — the real scheduler stops invoking the
        // task, and a straggler run never rejects.
        await tasks[0].fn();
        expect(
          Number((await f.db(JOURNAL_EVENTS_TABLE).count('id as n'))[0].n),
        ).toBe(0);
      } finally {
        await f.cleanup();
      }
    }, 20000);

    it('a throwing logger never breaks the runner or rejects unhandled', async () => {
      const f = await fixture(dialect === 'pg' ? pgUrl : undefined);
      try {
        await f.record({ decision: 'deny', reason: 'permission denied' });
        const clock = new TestClock();
        clock.advance(YEAR_MS);
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => void unhandled.push(reason);
        process.on('unhandledRejection', onUnhandled);
        const broken = knex({
          client: dialect === 'pg' ? 'pg' : 'better-sqlite3',
          connection:
            dialect === 'pg'
              ? { host: '127.0.0.1', port: 9, database: 'x', user: 'x' }
              : { filename: '/nonexistent-dir/journal.sqlite' },
        });
        const { tasks: syncTasks, service: syncService } = mockScheduler();
        const syncController = new AbortController();
        await scheduleAiJournalPrune({
          scheduler: syncService,
          db: broken,
          retentionMs: HOUR_MS,
          frequency: { milliseconds: 30 },
          // The logger throws on every warn: a broken observation channel
          // must not turn a failed pass into a rejection.
          logger: {
            info: () => {},
            warn: () => {
              throw new Error('logger exploded');
            },
          },
          now: clock.now,
          signal: syncController.signal,
        });
        try {
          // The start pass fails against the broken database, the logger
          // throws while reporting it, and a task run still settles
          // without rejecting.
          await syncTasks[0].fn();
          // Further scheduled passes keep running with the throwing
          // logger and leave no unhandled rejection behind.
          await syncTasks[0].fn();
          await new Promise(resolve => setTimeout(resolve, 120));
          expect(unhandled).toEqual([]);
        } finally {
          syncController.abort();
          await broken.destroy().catch(() => {});
          process.off('unhandledRejection', onUnhandled);
        }
        expect(unhandled).toEqual([]);

        // A callable thenable — a function whose .then is bound to a
        // rejecting promise, and which returns itself from the callback —
        // satisfies the callback type while being neither typeof 'object'
        // nor caught by the sync try/catch. The isolation wrapper must
        // adopt and swallow its rejection. The pass fails synchronously
        // (invalid retention window on the valid database) so the warn
        // call, and with it the adoption, happen in the same microtask
        // drain as the source promise's rejection.
        const onUnhandledCallable = (reason: unknown) =>
          void unhandled.push(reason);
        process.on('unhandledRejection', onUnhandledCallable);
        const callableWarn = (() => {
          const rejecting = Promise.reject(
            new Error('callable thenable rejected'),
          );
          const fn = () => fn;
          fn.then = rejecting.then.bind(rejecting);
          return fn as unknown as () => unknown;
        })();
        const { tasks: callableTasks, service: callableService } =
          mockScheduler();
        const callableController = new AbortController();
        await scheduleAiJournalPrune({
          scheduler: callableService,
          db: f.db,
          retentionMs: 0,
          frequency: { milliseconds: 30 },
          logger: { info: () => {}, warn: callableWarn },
          now: clock.now,
          signal: callableController.signal,
        });
        try {
          await callableTasks[0].fn();
          await new Promise(resolve => setTimeout(resolve, 120));
          expect(unhandled).toEqual([]);
        } finally {
          callableController.abort();
          process.off('unhandledRejection', onUnhandledCallable);
        }
        expect(unhandled).toEqual([]);

        // An async warn that rejects also satisfies the sync callback
        // type structurally; its rejected promise must be swallowed the
        // same way, never surfacing as an unhandled rejection.
        const asyncBroken = knex({
          client: dialect === 'pg' ? 'pg' : 'better-sqlite3',
          connection:
            dialect === 'pg'
              ? { host: '127.0.0.1', port: 9, database: 'x', user: 'x' }
              : { filename: '/nonexistent-dir/journal.sqlite' },
        });
        const onUnhandledAsync = (reason: unknown) =>
          void unhandled.push(reason);
        process.on('unhandledRejection', onUnhandledAsync);
        const { tasks: asyncTasks, service: asyncService } = mockScheduler();
        const asyncController = new AbortController();
        await scheduleAiJournalPrune({
          scheduler: asyncService,
          db: asyncBroken,
          retentionMs: HOUR_MS,
          frequency: { milliseconds: 30 },
          logger: {
            info: () => {},
            warn: async () => {
              throw new Error('async logger rejected');
            },
          },
          now: clock.now,
          signal: asyncController.signal,
        });
        try {
          await asyncTasks[0].fn();
          await new Promise(resolve => setTimeout(resolve, 120));
          expect(unhandled).toEqual([]);
        } finally {
          asyncController.abort();
          await asyncBroken.destroy().catch(() => {});
          process.off('unhandledRejection', onUnhandledAsync);
        }
        expect(unhandled).toEqual([]);
        // The real journal is untouched.
        expect(
          Number((await f.db(JOURNAL_EVENTS_TABLE).count('id as n'))[0].n),
        ).toBe(1);
      } finally {
        await f.cleanup();
      }
    }, 20000);

    it('fails open: a failing pass is warned, not thrown, and the schedule continues', async () => {
      const f = await fixture(dialect === 'pg' ? pgUrl : undefined);
      try {
        await f.record({ decision: 'deny', reason: 'permission denied' });
        const clock = new TestClock();
        clock.advance(YEAR_MS);
        const warnings: string[] = [];
        let failures = 0;
        // A database whose queries reject: every prune pass fails.
        const broken = knex({
          client: dialect === 'pg' ? 'pg' : 'better-sqlite3',
          connection:
            dialect === 'pg'
              ? { host: '127.0.0.1', port: 9, database: 'x', user: 'x' }
              : { filename: '/nonexistent-dir/journal.sqlite' },
        });
        const { tasks, service } = mockScheduler();
        const controller = new AbortController();
        await scheduleAiJournalPrune({
          scheduler: service,
          db: broken,
          retentionMs: HOUR_MS,
          frequency: { milliseconds: 30 },
          logger: {
            info: () => {},
            warn: message => void warnings.push(message),
          },
          now: clock.now,
          signal: controller.signal,
        });
        try {
          // A task run settles with zeros instead of rejecting: two
          // failed passes, two warnings, nothing thrown.
          await tasks[0].fn();
          await tasks[0].fn();
          await wait(() => warnings.length >= 2);
          failures = warnings.length;
          expect(failures).toBeGreaterThan(0);
          expect(warnings[0]).toContain('prune pass failed');
        } finally {
          controller.abort();
          await broken.destroy().catch(() => {});
        }
        // The real database was untouched by the failing runner.
        expect(
          Number((await f.db(JOURNAL_EVENTS_TABLE).count('id as n'))[0].n),
        ).toBe(1);
        // And pruneAiJournal itself still works on it.
        const result = await pruneAiJournal(f.db, {
          retentionMs: HOUR_MS,
          now: clock.now(),
        });
        expect(result.prunedEvents).toBe(1);
      } finally {
        await f.cleanup();
      }
    }, 20000);
  });
}
