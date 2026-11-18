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
 * Cleanup-discipline cells for {@link createJournalHarness}, beyond the
 * migration-failure cell in testUtilsJournalHarness.test.ts: every step
 * of the setup and cleanup sequences is independently guarded, so one
 * failure never skips the release of what the steps before it took.
 * knex is wrapped to inject and count: a failed CREATE SCHEMA must still
 * destroy the admin connection; a failed DROP SCHEMA during cleanup must
 * still destroy it too; a synchronous knex constructor failure must
 * still remove the SQLite directory; and a rejected destroy must still
 * run the directory removal.
 *
 * The PostgreSQL cells run when AI_TEST_POSTGRES_URL is set; the SQLite
 * cells always run.
 */
import { randomUUID } from 'node:crypto';
import { readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createProviderRegistry } from './providers/registry';
import { createJournalHarness } from './testUtilsJournalHarness';

type KnexConfig = { client?: string; searchPath?: string[] };
type MockState = {
  failCreateSchema: boolean;
  failDropSchema: boolean;
  failDestroy: boolean;
  failDbDestroy: boolean;
  failConstructor: boolean;
  /** Destroys of admin connections (PostgreSQL, no searchPath). */
  adminDestroys: number;
  /** Destroys of everything else, including the schema connection. */
  dbDestroys: number;
  createAttempts: number;
  dropAttempts: number;
  /** The exact schema names the intercepted CREATE SCHEMA statements made. */
  createdSchemas: string[];
};

jest.mock('knex', () => {
  const actual = jest.requireActual('knex');
  // Lives inside the factory: the module is required before the test
  // body runs, so outer consts are not initialized yet.
  const mockState: MockState = {
    failCreateSchema: false,
    failDropSchema: false,
    failDestroy: false,
    failDbDestroy: false,
    failConstructor: false,
    adminDestroys: 0,
    dbDestroys: 0,
    createAttempts: 0,
    dropAttempts: 0,
    createdSchemas: [],
  };
  const wrap = (config: KnexConfig) => {
    if (mockState.failConstructor && config.client === 'better-sqlite3') {
      throw new Error('injected constructor failure');
    }
    const instance = actual(config) as ((...args: unknown[]) => unknown) & {
      raw(sql: string): Promise<unknown>;
      destroy(): Promise<void>;
    };
    return new Proxy(instance, {
      apply(target, thisArg, args) {
        return (target as (...a: unknown[]) => unknown).apply(thisArg, args);
      },
      get(target, prop) {
        const value = Reflect.get(target, prop, target);
        if (prop === 'raw') {
          const raw = (value as (sql: string) => Promise<unknown>).bind(target);
          // Synchronous: knex raw results double as insert values, so
          // the wrapper must not turn them into promises.
          return (sql: string) => {
            if (sql.includes('create schema')) {
              mockState.createAttempts += 1;
              const name = /"([^"]+)"/.exec(sql)?.[1];
              if (name) {
                mockState.createdSchemas.push(name);
              }
              if (mockState.failCreateSchema) {
                throw new Error('injected create-schema failure');
              }
            }
            if (sql.includes('drop schema')) {
              mockState.dropAttempts += 1;
              if (mockState.failDropSchema) {
                throw new Error('injected drop-schema failure');
              }
            }
            return raw(sql);
          };
        }
        if (prop === 'destroy') {
          const destroy = (value as () => Promise<void>).bind(target);
          const isAdmin =
            config.client === 'pg' && config.searchPath === undefined;
          return async () => {
            if (isAdmin) {
              mockState.adminDestroys += 1;
            } else {
              mockState.dbDestroys += 1;
            }
            if (
              mockState.failDestroy ||
              (mockState.failDbDestroy && !isAdmin)
            ) {
              throw new Error('injected destroy failure');
            }
            return destroy();
          };
        }
        return typeof value === 'function'
          ? (value as (...a: unknown[]) => unknown).bind(target)
          : value;
      },
    });
  };
  (wrap as unknown as { mockState: MockState }).mockState = mockState;
  return wrap;
});

const knexMock = (
  jest.requireMock('knex') as unknown as {
    mockState: MockState;
  }
).mockState;

async function harnessDirectories(): Promise<number> {
  const entries = await readdir(tmpdir());
  return entries.filter(name =>
    name.startsWith(`ai-journal-harness-${process.pid}-`),
  ).length;
}

function resetState() {
  knexMock.failCreateSchema = false;
  knexMock.failDropSchema = false;
  knexMock.failDestroy = false;
  knexMock.failDbDestroy = false;
  knexMock.failConstructor = false;
  knexMock.adminDestroys = 0;
  knexMock.dbDestroys = 0;
  knexMock.createAttempts = 0;
  knexMock.dropAttempts = 0;
  knexMock.createdSchemas = [];
}

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

/**
 * Drops only the schemas THIS test's harness created, captured from the
 * intercepted CREATE SCHEMA statements: the shared AI_TEST_POSTGRES_URL
 * may carry live schemas of concurrent tests, which a wildcard drop
 * would destroy.
 */
async function dropCreatedSchemas(): Promise<void> {
  if (!pgUrl || knexMock.createdSchemas.length === 0) return;
  const actual = jest.requireActual('knex') as typeof import('knex');
  const admin = actual({ client: 'pg', connection: pgUrl });
  try {
    for (const name of knexMock.createdSchemas) {
      await admin.raw(`drop schema if exists "${name}" cascade`);
    }
  } finally {
    await admin.destroy();
  }
}

/** A foreign journal_harness_% schema standing in for a concurrent test. */
async function createDecoySchema(): Promise<string> {
  const name = `journal_harness_decoy_${randomUUID().replace(/-/g, '')}`;
  const actual = jest.requireActual('knex') as typeof import('knex');
  const admin = actual({ client: 'pg', connection: pgUrl! });
  try {
    await admin.raw(`create schema "${name}"`);
  } finally {
    await admin.destroy();
  }
  return name;
}

async function schemaExists(name: string): Promise<boolean> {
  const actual = jest.requireActual('knex') as typeof import('knex');
  const admin = actual({ client: 'pg', connection: pgUrl! });
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

async function dropSchema(name: string): Promise<void> {
  const actual = jest.requireActual('knex') as typeof import('knex');
  const admin = actual({ client: 'pg', connection: pgUrl! });
  try {
    await admin.raw(`drop schema if exists "${name}" cascade`);
  } finally {
    await admin.destroy();
  }
}

describe('createJournalHarness cleanup discipline', () => {
  // The PostgreSQL cells need a real server; the literal it() callbacks
  // keep the expect calls recognized as test bodies.
  (pgUrl ? describe : describe.skip)('PostgreSQL cleanup discipline', () => {
    it('destroys the admin connection when CREATE SCHEMA fails', async () => {
      resetState();
      knexMock.failCreateSchema = true;
      await expect(
        createJournalHarness({
          providers: createProviderRegistry([]),
          dialect: 'pg',
        }),
      ).rejects.toThrow('injected create-schema failure');
      expect(knexMock.createAttempts).toBe(1);
      // The drop on the failed connection may itself fail; the admin
      // connection is still destroyed.
      expect(knexMock.adminDestroys).toBe(1);
    });

    it('reports a failed DROP SCHEMA after still destroying both connections', async () => {
      resetState();
      const store = await createJournalHarness({
        providers: createProviderRegistry([]),
        dialect: 'pg',
      });
      expect(knexMock.dropAttempts).toBe(0);
      // A decoy stands in for a concurrent test's live schema: this
      // cell must never touch anything but its own.
      const decoy = await createDecoySchema();
      try {
        try {
          knexMock.failDropSchema = true;
          // A successful setup's cleanup surfaces the drop failure —
          // the caller can detect the leaked schema — after attempting
          // every step: both connections are still destroyed.
          await expect(store.cleanup()).rejects.toThrow(
            'injected drop-schema failure',
          );
          expect(knexMock.dropAttempts).toBe(1);
          expect(knexMock.dbDestroys).toBe(1);
          expect(knexMock.adminDestroys).toBe(1);
          // The decoy survived the cleanup: only this cell's own schema
          // is ever touched, on the shared test server.
          await expect(schemaExists(decoy)).resolves.toBe(true);
        } finally {
          // The injected drop never ran, so this store's own schema is
          // really still there; remove exactly it — never a wildcard —
          // even when an assertion above failed.
          await dropCreatedSchemas();
        }
        // The decoy survived the removal helper too: it dropped only
        // the schema this cell created, nothing matching a wildcard.
        await expect(schemaExists(decoy)).resolves.toBe(true);
      } finally {
        await dropSchema(decoy);
      }
    });

    it('reports a rejected db destroy after still dropping the schema and destroying the admin connection', async () => {
      resetState();
      const store = await createJournalHarness({
        providers: createProviderRegistry([]),
        dialect: 'pg',
      });
      knexMock.failDbDestroy = true;
      try {
        // The db destroy failure surfaces after every other step ran:
        // the schema was dropped and the admin connection destroyed.
        await expect(store.cleanup()).rejects.toThrow(
          'injected destroy failure',
        );
        expect(knexMock.dropAttempts).toBe(1);
        expect(knexMock.adminDestroys).toBe(1);
      } finally {
        // The injected destroy threw before the real one ran, so the
        // schema connection's pool is still alive; close it for real.
        knexMock.failDbDestroy = false;
        await store.db.destroy();
      }
    });
  });

  it('removes the directory when the knex constructor throws', async () => {
    resetState();
    knexMock.failConstructor = true;
    const before = await harnessDirectories();
    await expect(
      createJournalHarness({
        providers: createProviderRegistry([]),
        dialect: 'sqlite',
      }),
    ).rejects.toThrow('injected constructor failure');
    expect(await harnessDirectories()).toBe(before);
  });

  it('removes the directory when destroy rejects during cleanup', async () => {
    resetState();
    // Baseline before the setup, so unrelated leftovers in the shared
    // tmpdir cannot skew the count.
    const before = await harnessDirectories();
    const store = await createJournalHarness({
      providers: createProviderRegistry([]),
      dialect: 'sqlite',
    });
    expect(await harnessDirectories()).toBe(before + 1);
    knexMock.failDestroy = true;
    try {
      await expect(store.cleanup()).rejects.toThrow('injected destroy failure');
      expect(await harnessDirectories()).toBe(before);
    } finally {
      // The injected destroy threw before the real one ran, so the
      // SQLite pool is still alive; close it for real.
      knexMock.failDestroy = false;
      await store.db.destroy();
    }
  });
});
