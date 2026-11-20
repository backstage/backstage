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
import { mockCredentials } from '@backstage/backend-test-utils';
import { createAttemptJournal } from '../journal/knex';
import { createKnexNamespaceLease } from '../ownership/KnexNamespaceLease';
import { createUsageAccounting } from './aggregate';
import type { UsageReport } from './types';

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const pgUrl = process.env.AI_TEST_POSTGRES_URL;
const dialects = pgUrl ? (['sqlite', 'pg'] as const) : (['sqlite'] as const);

interface Fixture {
  db: Knex;
  journal: ReturnType<typeof createAttemptJournal>;
  lease: Awaited<ReturnType<typeof createKnexNamespaceLease>>;
  dialect: 'sqlite' | 'pg';
  reopen(options?: { authorizeAuditRead?: boolean }): Promise<void>;
  close(): Promise<void>;
}

async function open(
  dialect: 'sqlite' | 'pg',
  options: {
    dir?: string;
    schema?: string;
    admin?: Knex;
    authorizeAuditRead?: boolean;
  } = {},
): Promise<Knex> {
  if (dialect === 'sqlite') {
    return knex({
      client: 'better-sqlite3',
      connection: { filename: join(options.dir!, 'accounting.sqlite') },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
  }
  return knex({
    client: 'pg',
    connection: pgUrl,
    searchPath: [options.schema!],
  });
}

async function fixture(dialect: 'sqlite' | 'pg'): Promise<Fixture> {
  const dir =
    dialect === 'sqlite' ? await mkdtemp(join(tmpdir(), 'ai-acc-')) : undefined;
  const schema =
    dialect === 'pg' ? `ai_acc_${randomUUID().replace(/-/g, '')}` : undefined;
  let admin: Knex | undefined;
  if (dialect === 'pg') {
    admin = knex({ client: 'pg', connection: pgUrl });
    await admin.schema.createSchema(schema!);
  }
  let db = await open(dialect, { dir, schema });
  await storageMigration.up(db);
  await journalMigration.up(db);

  const build = (client: Knex) =>
    createAttemptJournal({
      db: client,
      authorizer: { authorizeAuditRead: async () => true },
    });

  const f: Fixture = {
    dialect,
    db,
    journal: build(db),
    lease: await createKnexNamespaceLease({ db }),
    async reopen() {
      await db.destroy();
      db = await open(dialect, { dir, schema });
      f.db = db;
      f.journal = build(db);
      f.lease = await createKnexNamespaceLease({ db });
    },
    async close() {
      await db.destroy();
      if (admin) {
        await admin.schema.dropSchema(schema!, true);
        await admin.destroy();
      }
      if (dir) await rm(dir, { recursive: true, force: true });
    },
  };
  return f;
}

const alice = mockCredentials.user('user:default/alice');
const bob = mockCredentials.user('user:default/bob');

async function seed(
  f: Fixture,
  sessionId: string,
  actor: string,
  attempts: ReadonlyArray<{
    provider?: string;
    model?: string;
    operation?: string;
    decision?: 'allow' | 'deny';
    outcome?:
      | 'completed'
      | 'failed'
      | 'cancelled'
      | 'unknown'
      | 'stream-failed';
    skipOutcome?: boolean;
  }>,
): Promise<void> {
  const fence = (await f.lease.acquire(
    { pluginId: 'plugin', sessionId },
    `owner-${sessionId}`,
  ))!;
  for (const [index, attempt] of attempts.entries()) {
    const id = await f.journal.recordDecisionAndIntent(fence, {
      actor,
      conversationId: `plugin/${sessionId}`,
      taskId: `plugin/${sessionId}`,
      callId: `plugin/${sessionId}#${index}`,
      definitionVersion: 'v1',
      configVersion: 'v1',
      provider: attempt.provider ?? 'openai',
      model: attempt.model ?? 'gpt-review',
      operation: attempt.operation ?? 'models.completeSimple',
      attempt: 1,
      decision: attempt.decision ?? 'allow',
      ...(attempt.decision === 'deny'
        ? { reason: 'model operation denied' }
        : {}),
    } as never);
    if (attempt.decision !== 'deny' && !attempt.skipOutcome) {
      await f.journal.recordOutcome(fence, id, {
        status: attempt.outcome ?? 'completed',
        httpStatus: 200,
      });
    }
  }
}

function rowsByKey(report: UsageReport) {
  return new Map(report.rows.map(row => [JSON.stringify(row.key), row]));
}

describe('usage accounting', () => {
  it.each(dialects)(
    'aggregates decisions and outcomes from the durable journal (%s)',
    async dialect => {
      const f = await fixture(dialect);
      try {
        await seed(f, 'one', 'user:default/alice', [
          { outcome: 'completed' },
          { outcome: 'completed' },
          { outcome: 'failed' },
          { decision: 'deny' },
        ]);
        await seed(f, 'two', 'user:default/alice', [
          {
            provider: 'anthropic',
            model: 'claude',
            operation: 'models.stream',
          },
          {
            provider: 'anthropic',
            model: 'claude',
            operation: 'models.stream',
            outcome: 'cancelled',
          },
          { skipOutcome: true },
        ]);

        const accounting = createUsageAccounting({
          journal: f.journal,
          listNamespaces: (pluginId, cursor) =>
            f.lease.enumerate(pluginId, cursor),
        });
        const report = await accounting.aggregate(alice, {
          pluginId: 'plugin',
        });

        expect(report.truncated).toBe(false);
        expect(report.sessionsRead).toBe(2);
        // 7 decisions and 5 outcomes across the two sessions.
        expect(report.eventsRead).toBe(12);

        const rows = rowsByKey(report);
        expect(
          rows.get(
            JSON.stringify({
              pluginId: 'plugin',
              sessionId: 'one',
              provider: 'openai',
              model: 'gpt-review',
              operation: 'models.completeSimple',
            }),
          ),
        ).toMatchObject({
          attempts: 4,
          decisions: { allow: 3, deny: 1 },
          outcomes: {
            completed: 2,
            failed: 1,
            cancelled: 0,
            unknown: 0,
            'stream-failed': 0,
          },
        });
        // An allowed attempt whose outcome never reached the journal is unknown.
        const two = [...rows.values()].filter(
          row => row.key.sessionId === 'two',
        );
        expect(two.map(row => row.outcomes.unknown).sort()).toEqual([0, 1]);
        expect(two.map(row => row.outcomes.cancelled).sort()).toEqual([0, 1]);

        // Roll-up: grouping by provider and operation collapses the sessions.
        const rolled = await accounting.aggregate(alice, {
          pluginId: 'plugin',
          groupBy: ['provider', 'operation'],
        });
        expect(rolled.rows).toEqual([
          expect.objectContaining({
            key: { provider: 'anthropic', operation: 'models.stream' },
            attempts: 2,
          }),
          expect.objectContaining({
            key: { provider: 'openai', operation: 'models.completeSimple' },
            attempts: 5,
          }),
        ]);
      } finally {
        await f.close();
      }
    },
    30000,
  );

  it.each(dialects)(
    'reconstructs identical aggregates after a restart (%s)',
    async dialect => {
      const f = await fixture(dialect);
      try {
        await seed(f, 'replay', 'user:default/alice', [
          { outcome: 'completed' },
          { outcome: 'failed' },
          { decision: 'deny' },
        ]);
        const before = await createUsageAccounting({
          journal: f.journal,
        }).aggregate(alice, { pluginId: 'plugin', sessionIds: ['replay'] });

        // A crash between intent and send leaves an unresolved attempt that a
        // later aggregate must still report as unknown.
        await seed(f, 'replay', 'user:default/alice', [{ skipOutcome: true }]);

        await f.reopen();
        const after = await createUsageAccounting({
          journal: f.journal,
        }).aggregate(alice, { pluginId: 'plugin', sessionIds: ['replay'] });

        expect(before.rows).toHaveLength(1);
        expect(after.rows).toHaveLength(1);
        expect(after.rows[0]).toMatchObject({
          attempts: 4,
          decisions: { allow: 3, deny: 1 },
          outcomes: { completed: 1, failed: 1, unknown: 1 },
        });
        expect(after.eventsRead).toBe(6);
      } finally {
        await f.close();
      }
    },
    30000,
  );

  it.each(dialects)(
    'refuses sessions and principals the journal refuses (%s)',
    async dialect => {
      const f = await fixture(dialect);
      try {
        await seed(f, 'alice-session', 'user:default/alice', [
          { outcome: 'completed' },
        ]);
        await seed(f, 'bob-session', 'user:default/bob', [
          { outcome: 'completed' },
        ]);
        const accounting = createUsageAccounting({ journal: f.journal });

        // Foreign session: ownership is enforced by the journal, not by us.
        await expect(
          accounting.aggregate(alice, {
            pluginId: 'plugin',
            sessionIds: ['bob-session'],
          }),
        ).rejects.toThrow(/ownership of the session/);

        // Missing ai.audit.read: same enforcement, different reason.
        const unauthorized = createUsageAccounting({
          journal: createAttemptJournal({
            db: f.db,
            authorizer: { authorizeAuditRead: async () => false },
          }),
        });
        await expect(
          unauthorized.aggregate(alice, {
            pluginId: 'plugin',
            sessionIds: ['alice-session'],
          }),
        ).rejects.toThrow(/ai\.audit\.read/);

        // The permitted path still works for the owner.
        const report = await accounting.aggregate(alice, {
          pluginId: 'plugin',
          sessionIds: ['alice-session'],
        });
        expect(report.rows[0].attempts).toBe(1);
        void bob;
      } finally {
        await f.close();
      }
    },
    30000,
  );

  it.each(dialects)(
    'bounds the scan and the result size (%s)',
    async dialect => {
      const f = await fixture(dialect);
      try {
        await seed(
          f,
          'bounded',
          'user:default/alice',
          (
            ['models.stream', 'models.complete', 'models.classify'] as const
          ).flatMap(operation => [
            { operation, outcome: 'completed' as const },
            { operation, outcome: 'failed' as const },
          ]),
        );
        const accounting = createUsageAccounting({ journal: f.journal });

        const capped = await accounting.aggregate(alice, {
          pluginId: 'plugin',
          sessionIds: ['bounded'],
          maxRows: 2,
        });
        expect(capped.truncated).toBe(true);
        expect(capped.rows).toHaveLength(2);

        const scanned = await accounting.aggregate(alice, {
          pluginId: 'plugin',
          sessionIds: ['bounded'],
          maxEvents: 3,
          pageSize: 2,
        });
        expect(scanned.truncated).toBe(true);
        expect(scanned.eventsRead).toBe(3);

        // Window filtering: everything before now is excluded by `from`.
        const future = await accounting.aggregate(alice, {
          pluginId: 'plugin',
          sessionIds: ['bounded'],
          from: new Date(Date.now() + 60_000).toISOString(),
        });
        expect(future.rows).toEqual([]);
        expect(future.eventsRead).toBe(0);

        const past = await accounting.aggregate(alice, {
          pluginId: 'plugin',
          sessionIds: ['bounded'],
          until: new Date(Date.now() - 60_000).toISOString(),
        });
        expect(past.rows).toEqual([]);

        await expect(
          accounting.aggregate(alice, { pluginId: 'plugin', maxRows: 0 }),
        ).rejects.toThrow(/maxRows/);
        await expect(
          accounting.aggregate(alice, {
            pluginId: 'plugin',
            groupBy: ['payload' as never],
          }),
        ).rejects.toThrow(/not a usage dimension/);
        await expect(
          accounting.aggregate(alice, { pluginId: 'plugin' }),
        ).rejects.toThrow(/sessionIds or configure a namespace enumerator/);
      } finally {
        await f.close();
      }
    },
    30000,
  );
});
