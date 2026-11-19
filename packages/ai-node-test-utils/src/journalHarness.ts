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

/**
 * A real attempt journal over a leased namespace, for provider-package
 * behavior tests.
 *
 * @remarks
 *
 * The journal's write machinery stays internal to `@backstage/ai-node`;
 * this harness gives provider packages and hosts the same setup the
 * crash fixture uses internally — the storage and journal migrations, one
 * namespace lease, and the real journal with granted audit reads — so a
 * test can bind the real guard and drive a dispatch whose allow intent
 * must survive the durable route-template check.
 *
 * This is a test utility, not part of the service.
 *
 * @alpha
 */

import { randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import { mockCredentials } from '@backstage/backend-test-utils';
import knex, { type Knex } from 'knex';
import { createAttemptJournal } from '@backstage/ai-node/modules';
import type { AttemptJournal } from '@backstage/ai-node/modules';
import type { Fence, Namespace } from '@backstage/ai-node/modules';
import type { AiProviderRegistry } from '@backstage/ai-node/modules';
import { loadAiMigration } from './aiMigrations';

const storageMigration = loadAiMigration('1000_storage');
const journalMigration = loadAiMigration('4000_journal');

/** The harness a behavior test drives. @alpha */
export interface JournalHarness {
  /** The real journal: durable decisions and outcomes. */
  readonly journal: AttemptJournal;
  /** The harness database; SQLite file or PostgreSQL schema. */
  readonly db: Knex;
  /** The leased namespace the fence covers. */
  readonly namespace: Namespace;
  /** A live fence over the leased namespace. */
  readonly fence: Fence;
  /** User credentials matching the harness namespace's audit reads. */
  readonly credentials: BackstageCredentials;
  /** Drops the schema or file and destroys the connections. */
  cleanup(): Promise<void>;
}

/** Options for {@link createJournalHarness}. @alpha */
export interface JournalHarnessOptions {
  /** Provider registry the journal parses attempts against. */
  readonly providers: AiProviderRegistry;
  /**
   * `pg` uses a fresh schema in `AI_TEST_POSTGRES_URL`, `sqlite` a fresh
   * file-backed database. Default: `pg` when `AI_TEST_POSTGRES_URL` is
   * set, otherwise `sqlite`.
   */
  readonly dialect?: 'pg' | 'sqlite';
}

/**
 * Applies the storage and journal migrations, leases one namespace, and
 * returns the real journal over it. The journal's route-template check
 * runs for real: an allow intent whose destination no registered template
 * accepts is rejected, so catalog and template drift goes red.
 *
 * @alpha
 */
export async function createJournalHarness(
  options: JournalHarnessOptions,
): Promise<JournalHarness> {
  const namespace: Namespace = {
    pluginId: 'journal-harness',
    sessionId: randomUUID(),
  };
  const fence: Fence = { namespace, owner: 'owner', token: '1' };
  const credentials = mockCredentials.user('user:default/alice');
  const pgUrl = process.env.AI_TEST_POSTGRES_URL;
  const dialect = options.dialect ?? (pgUrl ? 'pg' : 'sqlite');

  if (dialect === 'pg') {
    if (!pgUrl) throw new Error('AI_TEST_POSTGRES_URL is not set');
    const schema = `journal_harness_${randomUUID().replace(/-/g, '')}`;
    const admin = knex({ client: 'pg', connection: pgUrl });
    let db: Knex | undefined;
    // Every failure path releases what the steps before it took: the
    // connections are destroyed and the schema dropped, so a failed
    // setup leaves nothing behind.
    const cleanup = async () => {
      // Each step is attempted independently, so one failure never
      // skips the rest; a successful setup's cleanup then surfaces the
      // first failure, so callers can detect a leaked schema. The
      // failed-setup unwind calls this with suppression, preserving the
      // original setup error.
      const failures: unknown[] = [];
      try {
        await db?.destroy();
      } catch (error) {
        failures.push(error);
      }
      try {
        await admin.raw(`drop schema if exists "${schema}" cascade`);
      } catch (error) {
        failures.push(error);
      }
      try {
        await admin.destroy();
      } catch (error) {
        failures.push(error);
      }
      if (failures.length > 0) {
        throw failures[0];
      }
    };
    try {
      await admin.raw(`create schema "${schema}"`);
      db = knex({
        client: 'pg',
        connection: pgUrl,
        searchPath: [schema],
      });
      await storageMigration.up(db);
      await journalMigration.up(db);
      await db('ai_namespace_leases').insert({
        plugin_id: namespace.pluginId,
        session_id: namespace.sessionId,
        owner_id: fence.owner,
        token: fence.token,
        expires_at: db.raw("statement_timestamp() + interval '60 seconds'"),
      });
      const journal = createAttemptJournal({
        db,
        providers: options.providers,
        authorizer: { authorizeAuditRead: async () => true },
      });
      return {
        journal,
        db,
        namespace,
        fence,
        credentials,
        cleanup,
      };
    } catch (error) {
      // Cleanup must not mask the setup failure it is reporting.
      await cleanup().catch(() => undefined);
      throw error;
    }
  }

  // The pid scope keeps concurrent Jest workers — separate processes —
  // from racing each other's directories in the shared tmpdir.
  const directory = await mkdtemp(
    join(tmpdir(), `ai-journal-harness-${process.pid}-`),
  );
  let db: Knex | undefined;
  try {
    // Inside the protected region: a synchronous constructor failure
    // must still remove the directory.
    const connection = knex({
      client: 'better-sqlite3',
      connection: { filename: join(directory, 'harness.sqlite') },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
    db = connection;
    await storageMigration.up(connection);
    await journalMigration.up(connection);
    await connection('ai_namespace_leases').insert({
      plugin_id: namespace.pluginId,
      session_id: namespace.sessionId,
      owner_id: fence.owner,
      token: fence.token,
      expires_at: connection.raw(
        "(julianday('now') - 2440587.5) * 86400000 + 60000",
      ),
    });
    const journal = createAttemptJournal({
      db: connection,
      providers: options.providers,
      authorizer: { authorizeAuditRead: async () => true },
    });
    return {
      journal,
      db: connection,
      namespace,
      fence,
      credentials,
      cleanup: async () => {
        // The same contract as the PostgreSQL branch: every step is
        // attempted independently and the first failure is reported
        // after all attempts, so a rejected destroy cannot skip the
        // directory removal — or hide behind it.
        const failures: unknown[] = [];
        try {
          await connection.destroy();
        } catch (error) {
          failures.push(error);
        }
        try {
          await rm(directory, { recursive: true, force: true });
        } catch (error) {
          failures.push(error);
        }
        if (failures.length > 0) {
          throw failures[0];
        }
      },
    };
  } catch (error) {
    await db?.destroy().catch(() => undefined);
    await rm(directory, { recursive: true, force: true }).catch(
      () => undefined,
    );
    throw error;
  }
}
