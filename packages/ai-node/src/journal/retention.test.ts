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
import { createAttemptJournal } from './knex';
import { pruneAiJournal } from './retention';
import type { AttemptDecision } from './types';

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

async function sqliteFixture() {
  const dir = await mkdtemp(join(tmpdir(), 'ai-journal-retention-'));
  const db = knex({
    client: 'better-sqlite3',
    connection: { filename: join(dir, 'journal.sqlite') },
    useNullAsDefault: true,
  });
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
  const journal = createAttemptJournal({
    db,
    authorizer: { authorizeAuditRead: async () => true },
  });
  return {
    db,
    journal,
    cleanup: async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    },
  };
}

function freshDecision(
  overrides: Partial<AttemptDecision> = {},
): AttemptDecision {
  return { ...decision, callId: `call-${randomUUID()}`, ...overrides };
}

async function ageEvent(db: Knex, id: string, hours: number) {
  await db('ai_journal_events')
    .where({ id })
    .update({ created_at: new Date(Date.now() - hours * HOUR_MS) });
}

if (!pgUrl) {
  it.skip('PostgreSQL retention tests require AI_TEST_POSTGRES_URL', () => {});
}

for (const dialect of ['sqlite', 'pg'] as const) {
  if (dialect === 'pg' && !pgUrl) continue;

  describe(`journal retention (${dialect})`, () => {
    it('prunes resolved events and preserves unresolved intents', async () => {
      const f =
        dialect === 'sqlite'
          ? await sqliteFixture()
          : await (async () => {
              const admin = knex({ client: 'pg', connection: pgUrl });
              const schema = `ai_test_${randomUUID().replace(/-/g, '')}`;
              await admin.schema.createSchema(schema);
              const db = knex({
                client: 'pg',
                connection: pgUrl,
                searchPath: [schema],
              });
              try {
                await storageMigration.up(db);
                await journalMigration.up(db);
                await db('ai_namespace_leases').insert({
                  ...key,
                  owner_id: fence.owner,
                  token: fence.token,
                  expires_at: db.raw(
                    "statement_timestamp() + (? * interval '1 second')",
                    [60],
                  ),
                });
              } catch (error) {
                await db.destroy();
                await admin.schema.dropSchema(schema, true);
                await admin.destroy();
                throw error;
              }
              return {
                db,
                journal: createAttemptJournal({
                  db,
                  authorizer: { authorizeAuditRead: async () => true },
                }),
                cleanup: async () => {
                  await db.destroy();
                  await admin.schema.dropSchema(schema, true);
                  await admin.destroy();
                },
              };
            })();

      try {
        const now = new Date();
        // Resolved attempt, old.
        const resolved = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await f.journal.recordOutcome(fence, resolved, { status: 'completed' });
        await ageEvent(f.db, resolved, 10);
        // Unresolved send intent, old: must never be deleted.
        const unresolved = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await ageEvent(f.db, unresolved, 10);
        // Denial, old: settled, prunable.
        const denied = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision({ decision: 'deny', reason: 'permission denied' }),
        );
        await ageEvent(f.db, denied, 10);
        // Recovery event, old: prunable.
        await f.journal.recordRecovery(fence, {
          actor: 'user:default/alice',
          kind: 'needs-reauth',
        });
        const recovery = String(
          (
            await f
              .db('ai_journal_events')
              .where({ kind: 'recovery' })
              .first('id')
          ).id,
        );
        await ageEvent(f.db, recovery, 10);
        // Fresh resolved attempt: within the window, untouched.
        const fresh = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await f.journal.recordOutcome(fence, fresh, { status: 'failed' });

        const result = await pruneAiJournal(f.db, {
          retentionMs: HOUR_MS,
          now,
        });
        expect(result.prunedEvents).toBe(4); // decision+outcome of resolved, denial, recovery
        expect(result.uncertaintyRecords).toBe(1);

        const remaining = await f.db('ai_journal_events').select('id', 'kind');
        expect(remaining).toHaveLength(3); // unresolved intent + fresh attempt with its outcome
        expect(remaining.some(row => String(row.id) === unresolved)).toBe(true);

        const uncertainty = await f.db('ai_journal_uncertainty').select();
        expect(uncertainty).toHaveLength(1);
        expect(String(uncertainty[0].attempt_id)).toBe(unresolved);
        expect(uncertainty[0].note).toContain('unknown');

        // A second pass writes no duplicate uncertainty record.
        const again = await pruneAiJournal(f.db, {
          retentionMs: HOUR_MS,
          now,
        });
        expect(again.uncertaintyRecords).toBe(0);
        expect(again.prunedEvents).toBe(0);
        expect(
          await f.db('ai_journal_uncertainty').select('attempt_id'),
        ).toHaveLength(1);
        expect(
          await f.db('ai_journal_events').where({ id: unresolved }),
        ).toHaveLength(1);
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
