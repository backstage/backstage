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
import { readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createProviderRegistry } from './providers/registry';
import { createJournalHarness } from './testUtilsJournalHarness';

type KnexConfig = { client?: string; searchPath?: string[] };
type MockState = {
  failCreateSchema: boolean;
  failDropSchema: boolean;
  failDestroy: boolean;
  failConstructor: boolean;
  destroys: number;
  createAttempts: number;
  dropAttempts: number;
};

jest.mock('knex', () => {
  const actual = jest.requireActual('knex');
  // Lives inside the factory: the module is required before the test
  // body runs, so outer consts are not initialized yet.
  const mockState: MockState = {
    failCreateSchema: false,
    failDropSchema: false,
    failDestroy: false,
    failConstructor: false,
    destroys: 0,
    createAttempts: 0,
    dropAttempts: 0,
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
          return async () => {
            mockState.destroys += 1;
            if (mockState.failDestroy) {
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
  return entries.filter(name => name.startsWith('ai-journal-harness-')).length;
}

function resetState() {
  knexMock.failCreateSchema = false;
  knexMock.failDropSchema = false;
  knexMock.failDestroy = false;
  knexMock.failConstructor = false;
  knexMock.destroys = 0;
  knexMock.createAttempts = 0;
  knexMock.dropAttempts = 0;
}

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

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
      // The drop on the dead connection may fail; the destroy still ran.
      expect(knexMock.destroys).toBeGreaterThan(0);
    });

    it('destroys the admin connection when DROP SCHEMA fails during cleanup', async () => {
      resetState();
      const store = await createJournalHarness({
        providers: createProviderRegistry([]),
        dialect: 'pg',
      });
      expect(knexMock.dropAttempts).toBe(0);
      knexMock.failDropSchema = true;
      // The rejected drop must not surface: cleanup resolves and the
      // admin connection is still destroyed.
      await expect(store.cleanup()).resolves.toBeUndefined();
      expect(knexMock.dropAttempts).toBe(1);
      expect(knexMock.destroys).toBeGreaterThan(0);
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
    await expect(store.cleanup()).rejects.toThrow('injected destroy failure');
    expect(await harnessDirectories()).toBe(before);
  });
});
