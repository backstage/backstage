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
 */
import { readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import knex from 'knex';
import { createProviderRegistry } from './providers/registry';
import { createJournalHarness } from './testUtilsJournalHarness';

// The injected failure: the first setup step that touches the database.
jest.mock('../migrations/1000_storage', () => ({
  up: async () => {
    throw new Error('injected setup failure');
  },
}));

async function harnessDirectories(): Promise<number> {
  const entries = await readdir(tmpdir());
  return entries.filter(name => name.startsWith('ai-journal-harness-')).length;
}

async function harnessSchemas(): Promise<number> {
  const url = process.env.AI_TEST_POSTGRES_URL;
  if (!url) return 0;
  const admin = knex({ client: 'pg', connection: url });
  try {
    const rows = (await admin.raw(
      `select count(*)::int as n from information_schema.schemata where schema_name like 'journal_harness_%'`,
    )) as { rows: Array<{ n: number }> };
    return rows.rows[0]?.n ?? 0;
  } finally {
    await admin.destroy();
  }
}

describe('createJournalHarness setup failures', () => {
  it('leaves no directory or schema behind when a setup step fails', async () => {
    const dialect = process.env.AI_TEST_POSTGRES_URL ? 'pg' : 'sqlite';
    const directoriesBefore = await harnessDirectories();
    const schemasBefore = await harnessSchemas();
    // The mock must be in effect for the harness's require.
    await expect(
      createJournalHarness({
        providers: createProviderRegistry([]),
        dialect,
      }),
    ).rejects.toThrow('injected setup failure');
    expect(await harnessDirectories()).toBe(directoriesBefore);
    expect(await harnessSchemas()).toBe(schemasBefore);
  });
});
