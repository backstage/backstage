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
import { createAttemptJournal, JOURNAL_EVENTS_TABLE } from './knex';
import { pruneAiJournal } from './retention';
import type { AttemptDecision, AttemptId } from './types';

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const namespace = { pluginId: 'plugin', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };
const key = { plugin_id: namespace.pluginId, session_id: namespace.sessionId };
const pgUrl = process.env.AI_TEST_POSTGRES_URL;

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

type Fixture = {
  db: Knex;
  record(overrides?: Partial<AttemptDecision>): Promise<AttemptId>;
  recordOutcome(attempt: AttemptId, status: string): Promise<void>;
  cleanup(): Promise<void>;
};

async function sqliteFixture(): Promise<Fixture> {
  const dir = await mkdtemp(join(tmpdir(), 'ai-journal-retention-'));
  const db = knex({
    client: 'better-sqlite3',
    connection: { filename: join(dir, 'journal.sqlite') },
    useNullAsDefault: true,
  });
  const journal = createAttemptJournal({
    db,
    authorizer: { authorizeAuditRead: async () => true },
  });
  try {
    await storageMigration.up(db);
    await journalMigration.up(db);
    await db('ai_namespace_leases').insert({
      ...key,
      owner_id: fence.owner,
      token: fence.token,
      expires_at: db.raw("(julianday('now') - 2440587.5) * 86400000 + ?", [
        60_000,
      ]),
    });
  } catch (error) {
    await db.destroy();
    await rm(dir, { recursive: true, force: true });
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
    cleanup: async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    },
  };
}

async function pgFixture(): Promise<Fixture> {
  const admin = knex({ client: 'pg', connection: pgUrl });
  const schema = `ai_test_${randomUUID().replace(/-/g, '')}`;
  await admin.schema.createSchema(schema);
  const db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
  const journal = createAttemptJournal({
    db,
    authorizer: { authorizeAuditRead: async () => true },
  });
  try {
    await storageMigration.up(db);
    await journalMigration.up(db);
    await db('ai_namespace_leases').insert({
      ...key,
      owner_id: fence.owner,
      token: fence.token,
      expires_at: db.raw("statement_timestamp() + (? * interval '1 second')", [
        60,
      ]),
    });
  } catch (error) {
    await db.destroy();
    await admin.schema.dropSchema(schema, true);
    await admin.destroy();
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
    cleanup: async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    },
  };
}

if (!pgUrl) {
  it.skip('PostgreSQL retention tests require AI_TEST_POSTGRES_URL', () => {});
}

for (const dialect of ['sqlite', 'pg'] as const) {
  if (dialect === 'pg' && !pgUrl) continue;

  describe(`journal retention (${dialect})`, () => {
    it('prunes settled attempts and preserves uncertain evidence', async () => {
      const f =
        dialect === 'sqlite' ? await sqliteFixture() : await pgFixture();
      try {
        // Everything below is appended normally and left untouched; the
        // injected future cutoff makes it all past the retention window.
        // Settled: allow with a settled outcome.
        const resolved = await f.record();
        await f.recordOutcome(resolved, 'completed');
        // Settled: denial.
        await f.record({ decision: 'deny', reason: 'permission denied' });
        // Uncertain: send intent with no outcome at all.
        const unresolved = await f.record();
        // Uncertain: send intent with an explicitly unknown outcome.
        const unknownOutcome = await f.record();
        await f.recordOutcome(unknownOutcome, 'unknown');
        // Recovery evidence: unknown-dispatch must survive; other kinds age.
        await createAttemptJournal({
          db: f.db,
          authorizer: { authorizeAuditRead: async () => true },
        }).recordRecovery(fence, {
          actor: 'user:default/alice',
          kind: 'unknown-dispatch',
        });
        await createAttemptJournal({
          db: f.db,
          authorizer: { authorizeAuditRead: async () => true },
        }).recordRecovery(fence, {
          actor: 'user:default/alice',
          kind: 'needs-reauth',
        });

        const result = await pruneAiJournal(f.db, {
          retentionMs: HOUR_MS,
          now: new Date(Date.now() + YEAR_MS),
        });
        // decision + outcome of the resolved attempt, the denial, and the
        // needs-reauth recovery. The unknown outcome row is NOT pruning
        // evidence: it stays with its intent.
        expect(result.prunedEvents).toBe(4);
        expect(result.uncertaintyRecords).toBe(2);

        const remaining = await f
          .db(JOURNAL_EVENTS_TABLE)
          .select(
            f.db.raw('*'),
            f.db.raw('CAST(id AS TEXT) AS id'),
            f.db.raw('CAST(attempt_id AS TEXT) AS attempt_id'),
          );
        const ids = remaining.map(row => String(row.id));
        expect(ids).toContain(unresolved);
        expect(ids).toContain(unknownOutcome);
        // The unknown outcome row survives next to its intent.
        expect(
          remaining.some(
            row => row.kind === 'outcome' && row.attempt_id === unknownOutcome,
          ),
        ).toBe(true);
        // The unknown-dispatch recovery evidence survives.
        expect(
          remaining.some(row => row.recovery_kind === 'unknown-dispatch'),
        ).toBe(true);
        expect(remaining).toHaveLength(4); // two uncertain intents, the unknown outcome, the unknown-dispatch recovery

        const uncertainty = await f.db('ai_journal_uncertainty').select();
        expect(uncertainty.map(row => String(row.attempt_id)).sort()).toEqual(
          [unresolved, unknownOutcome].sort(),
        );

        // A second pass is a no-op: no duplicate uncertainty, no more pruning.
        const again = await pruneAiJournal(f.db, {
          retentionMs: HOUR_MS,
          now: new Date(Date.now() + YEAR_MS),
        });
        expect(again.prunedEvents).toBe(0);
        expect(again.uncertaintyRecords).toBe(0);
        expect(await f.db('ai_journal_uncertainty')).toHaveLength(2);
        expect(await f.db(JOURNAL_EVENTS_TABLE)).toHaveLength(4);
      } finally {
        await f.cleanup();
      }
    });

    it('prunes untouched appended rows via an injected future cutoff', async () => {
      const f =
        dialect === 'sqlite' ? await sqliteFixture() : await pgFixture();
      try {
        const id = await f.record();
        await f.recordOutcome(id, 'completed');
        // The stored timestamp class must match what retention compares
        // against, without any test-side rewriting of created_at.
        const result = await pruneAiJournal(f.db, {
          retentionMs: HOUR_MS,
          now: new Date(Date.now() + YEAR_MS),
        });
        expect(result.prunedEvents).toBe(2);
        expect(await f.db(JOURNAL_EVENTS_TABLE)).toEqual([]);
      } finally {
        await f.cleanup();
      }
    });

    it('rejects invalid retention configuration', async () => {
      const f = await sqliteFixture();
      try {
        await expect(pruneAiJournal(f.db, { retentionMs: 0 })).rejects.toThrow(
          'retentionMs',
        );
      } finally {
        await f.cleanup();
      }
    });
  });
}
