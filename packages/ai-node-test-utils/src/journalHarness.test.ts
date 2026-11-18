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
 * A failed harness setup must leave nothing behind: no leaked database
 * connections, no leftover SQLite directory, no leftover PostgreSQL
 * schema. The storage migration is mocked to fail so the whole setup
 * sequence after it unwinds; the same finally discipline covers failures
 * at any earlier step. Both dialects; PostgreSQL when
 * AI_TEST_POSTGRES_URL is set.
 *
 * The assertions count only what THIS test owns: the SQLite directories
 * of this process (concurrent Jest workers run in other processes) and
 * the PostgreSQL schemas this test's harness created, captured from the
 * intercepted CREATE SCHEMA statements — never global totals, which
 * concurrently running suites legitimately move.
 */
import { readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createProviderRegistry } from '@backstage/ai-node/modules';
import { createJournalHarness } from './journalHarness';

// The injected failure: the first setup step that touches the database.
jest.mock('@backstage/ai-node/migrations/1000_storage', () => ({
  up: async () => {
    throw new Error('injected setup failure');
  },
}));

// knex is wrapped only to record the schema names this test's harness
// creates; everything delegates to the real knex.
jest.mock('knex', () => {
  const actual = jest.requireActual('knex');
  const createdSchemas: string[] = [];
  const wrap = (config: unknown) => {
    const instance = actual(config) as ((...args: unknown[]) => unknown) & {
      raw(sql: string): Promise<unknown>;
    };
    return new Proxy(instance, {
      apply(target, thisArg, args) {
        return (target as (...a: unknown[]) => unknown).apply(thisArg, args);
      },
      get(target, prop) {
        const value = Reflect.get(target, prop, target);
        if (prop === 'raw') {
          const raw = (value as (sql: string) => Promise<unknown>).bind(target);
          // Synchronous: knex raw results double as insert values.
          return (sql: string) => {
            if (sql.includes('create schema')) {
              const name = /"([^"]+)"/.exec(sql)?.[1];
              if (name) createdSchemas.push(name);
            }
            return raw(sql);
          };
        }
        return typeof value === 'function'
          ? (value as (...a: unknown[]) => unknown).bind(target)
          : value;
      },
    });
  };
  (wrap as unknown as { createdSchemas: string[] }).createdSchemas =
    createdSchemas;
  return wrap;
});

const knexMock = (
  jest.requireMock('knex') as unknown as {
    createdSchemas: string[];
  }
).createdSchemas;

async function harnessDirectories(): Promise<number> {
  const entries = await readdir(tmpdir());
  return entries.filter(name =>
    name.startsWith(`ai-journal-harness-${process.pid}-`),
  ).length;
}

async function schemaExists(name: string): Promise<boolean> {
  const url = process.env.AI_TEST_POSTGRES_URL;
  if (!url) return false;
  const actual = jest.requireActual('knex') as typeof import('knex');
  const admin = actual({ client: 'pg', connection: url });
  try {
    const rows = (await admin.raw(
      `select 1 from information_schema.schemata where schema_name = ?`,
      [name],
    )) as { rows: unknown[] };
    return rows.rows.length > 0;
  } finally {
    await admin.destroy();
  }
}

describe('createJournalHarness setup failures', () => {
  it('leaves no directory or schema behind when a setup step fails', async () => {
    const dialect = process.env.AI_TEST_POSTGRES_URL ? 'pg' : 'sqlite';
    const directoriesBefore = await harnessDirectories();
    const createdBefore = [...knexMock];
    await expect(
      createJournalHarness({
        providers: createProviderRegistry([]),
        dialect,
      }),
    ).rejects.toThrow('injected setup failure');
    expect(await harnessDirectories()).toBe(directoriesBefore);
    // Every schema this test's harness created is gone; concurrently
    // running suites' schemas are not this test's to count.
    const created = knexMock.filter(name => !createdBefore.includes(name));
    for (const name of created) {
      await expect(schemaExists(name)).resolves.toBe(false);
    }
  });
});
