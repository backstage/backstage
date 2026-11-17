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
import type { Namespace } from '../contracts';
import { createKnexNamespaceLease } from './KnexNamespaceLease';
import { liveCondition } from './sql';
import type { NamespaceLease } from './types';

const storageMigration = require('../../migrations/1000_storage');
const recoveryMigration = require('../../migrations/3000_ownership_recovery');

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

const namespace: Namespace = { pluginId: 'plugin', sessionId: 'session' };
const other: Namespace = { pluginId: 'plugin', sessionId: 'other' };
const ttlMs = 60_000;

type Fixture = {
  db: Knex;
  lease: NamespaceLease;
  /** Forces the row past its expiry using the database clock. */
  expire(namespace: Namespace): Promise<void>;
  cleanup(): Promise<void>;
};

async function sqliteFixture(
  options: { filename?: string; pageSize?: number; migrate?: boolean } = {},
): Promise<Fixture> {
  const { filename, pageSize, migrate = true } = options;
  const dir = filename ? undefined : await mkdtemp(join(tmpdir(), 'ai-lease-'));
  const file = filename ?? join(dir!, 'lease.sqlite');
  const db = knex({
    client: 'better-sqlite3',
    connection: { filename: file },
    useNullAsDefault: true,
    pool: { min: 1, max: 1 },
  });
  await db.raw('PRAGMA busy_timeout = 5000');
  if (migrate) {
    await storageMigration.up(db);
    await recoveryMigration.up(db);
  }
  return {
    db,
    lease: await createKnexNamespaceLease({ db, ttlMs, pageSize }),
    expire: async key =>
      void (await db('ai_namespace_leases')
        .where({ plugin_id: key.pluginId, session_id: key.sessionId })
        .update({
          expires_at: db.raw("(julianday('now') - 2440587.5) * 86400000"),
        })),
    cleanup: async () => {
      await db.destroy();
      if (dir) await rm(dir, { recursive: true, force: true });
    },
  };
}

async function pgFixture(pageSize?: number): Promise<Fixture> {
  const admin = knex({ client: 'pg', connection: pgUrl });
  const schema = `ai_lease_${randomUUID().replace(/-/g, '')}`;
  await admin.schema.createSchema(schema);
  const db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
  await storageMigration.up(db);
  await recoveryMigration.up(db);
  return {
    db,
    lease: await createKnexNamespaceLease({ db, ttlMs, pageSize }),
    expire: async key =>
      void (await db('ai_namespace_leases')
        .where({ plugin_id: key.pluginId, session_id: key.sessionId })
        .update({ expires_at: db.raw('statement_timestamp()') })),
    cleanup: async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    },
  };
}

const engines: [string, (pageSize?: number) => Promise<Fixture>][] = [
  ['sqlite', pageSize => sqliteFixture({ pageSize })],
];
if (pgUrl) engines.push(['postgres', pgFixture]);
else it.skip('PostgreSQL lease tests require AI_TEST_POSTGRES_URL', () => {});

async function rawLease(fixture: Fixture, key: Namespace = namespace) {
  return fixture
    .db('ai_namespace_leases')
    .where({ plugin_id: key.pluginId, session_id: key.sessionId })
    .first('owner_id', 'token', 'expires_at');
}

describe.each(engines)('%s namespace lease', (_engine, make) => {
  let fixture: Fixture;

  beforeEach(async () => {
    fixture = await make();
  });

  afterEach(async () => {
    await fixture.cleanup();
  });

  it('acquires once per namespace and stores an exact token', async () => {
    const first = await fixture.lease.acquire(namespace, 'replica-a');
    expect(first).toEqual({ namespace, owner: 'replica-a', token: '1' });

    // A competing replica cannot acquire a live lease.
    expect(await fixture.lease.acquire(namespace, 'replica-b')).toBeUndefined();

    const raw = await rawLease(fixture);
    expect(String(raw.token)).toBe('1');
    expect(raw.owner_id).toBe('replica-a');
  });

  it('extends a live lease re-acquired by the same owner without rotating it', async () => {
    const first = await fixture.lease.acquire(namespace, 'replica-a');
    const again = await fixture.lease.acquire(namespace, 'replica-a');

    expect(again).toEqual(first);
    expect(await fixture.lease.renew(first!)).toBe(true);
  });

  it('takes over an expired lease with the next token and invalidates the old fence', async () => {
    const first = await fixture.lease.acquire(namespace, 'replica-a');
    await fixture.expire(namespace);

    const second = await fixture.lease.acquire(namespace, 'replica-b');
    expect(second).toEqual({ namespace, owner: 'replica-b', token: '2' });

    // The old generation is stale in every direction.
    expect(await fixture.lease.renew(first!)).toBe(false);
    await fixture.lease.release(first!);
    expect(await fixture.lease.renew(second!)).toBe(true);
  });

  it('rejects renewal after database time passes the expiry', async () => {
    const fence = await fixture.lease.acquire(namespace, 'replica-a');
    expect(await fixture.lease.renew(fence!)).toBe(true);

    await fixture.expire(namespace);
    expect(await fixture.lease.renew(fence!)).toBe(false);
  });

  it('lets a stale release leave the successor lease untouched', async () => {
    const first = await fixture.lease.acquire(namespace, 'replica-a');
    await fixture.expire(namespace);
    const second = await fixture.lease.acquire(namespace, 'replica-b');

    await fixture.lease.release(first!);

    expect(await fixture.lease.renew(second!)).toBe(true);
    const raw = await rawLease(fixture);
    expect(String(raw.token)).toBe('2');
    expect(raw.owner_id).toBe('replica-b');
  });

  it('keeps tokens monotonically increasing across release and reacquisition', async () => {
    const first = await fixture.lease.acquire(namespace, 'replica-a');
    await fixture.lease.release(first!);
    const second = await fixture.lease.acquire(namespace, 'replica-b');
    await fixture.lease.release(second!);
    const third = await fixture.lease.acquire(namespace, 'replica-a');

    expect([first!.token, second!.token, third!.token]).toEqual([
      '1',
      '2',
      '3',
    ]);
    // Release expires the row instead of deleting it, so the counter cannot reset.
    const raw = await rawLease(fixture);
    expect(raw).toBeDefined();
    expect(String(raw.token)).toBe('3');
  });

  it('increments tokens past the safe JavaScript integer range', async () => {
    await fixture.db('ai_namespace_leases').insert({
      plugin_id: namespace.pluginId,
      session_id: namespace.sessionId,
      owner_id: 'replica-old',
      token: '9007199254740993',
      expires_at:
        _engine === 'sqlite'
          ? fixture.db.raw("(julianday('now') - 2440587.5) * 86400000 - 1000")
          : fixture.db.raw("statement_timestamp() - interval '1 second'"),
    });

    const fence = await fixture.lease.acquire(namespace, 'replica-a');

    expect(fence!.token).toBe('9007199254740994');
    const raw = await rawLease(fixture);
    expect(String(raw.token)).toBe('9007199254740994');
  });

  it('paginates enumeration over every namespace, including released ones', async () => {
    await fixture.cleanup();
    fixture = await make(2);
    const paged = await fixture.lease.acquire(other, 'replica-a');
    await fixture.lease.release(paged!);
    for (const sessionId of ['a', 'b', 'c']) {
      await fixture.lease.acquire(
        { pluginId: 'plugin', sessionId },
        'replica-a',
      );
    }
    await fixture.lease.acquire({ pluginId: 'other', sessionId: 'x' }, 'r');
    await fixture.lease.acquire(namespace, 'replica-a');

    const seen: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await fixture.lease.enumerate('plugin', cursor);
      expect(page.namespaces.every(item => item.pluginId === 'plugin')).toBe(
        true,
      );
      seen.push(...page.namespaces.map(item => item.sessionId));
      cursor = page.next;
    } while (cursor !== undefined);

    expect(seen).toEqual(['a', 'b', 'c', 'other', 'session']);
  });

  it('binds an enumeration cursor to its plugin and orders stably', async () => {
    await fixture.cleanup();
    fixture = await make(2);
    for (const sessionId of ['a', 'b', 'c']) {
      await fixture.lease.acquire({ pluginId: 'plugin', sessionId }, 'r');
    }
    const page = await fixture.lease.enumerate('plugin');
    expect(page.namespaces.map(item => item.sessionId)).toEqual(['a', 'b']);
    const rest = await fixture.lease.enumerate('plugin', page.next);
    expect(rest.namespaces.map(item => item.sessionId)).toEqual(['c']);
    expect(rest.next).toBeUndefined();

    await expect(
      fixture.lease.enumerate('plugin', 'not-a-cursor'),
    ).rejects.toThrow('Invalid namespace enumeration cursor');
  });

  it('rejects invalid owners, tokens and namespaces', async () => {
    await expect(fixture.lease.acquire(namespace, '')).rejects.toThrow(
      'Invalid lease owner',
    );
    await expect(
      fixture.lease.acquire({ pluginId: '', sessionId: 'x' }, 'owner'),
    ).rejects.toThrow('Invalid namespace pluginId');

    const fence = await fixture.lease.acquire(namespace, 'replica-a');
    await expect(
      fixture.lease.renew({ ...fence!, token: '1e3' }),
    ).rejects.toThrow('Invalid lease token');
    await expect(
      fixture.lease.release({ ...fence!, owner: '' }),
    ).rejects.toThrow('Invalid lease owner');
  });

  it('lets exactly one of two concurrent replicas acquire', async () => {
    const { db } = fixture;
    const otherLease = await createKnexNamespaceLease({ db, ttlMs });
    const results = await Promise.all([
      fixture.lease.acquire(namespace, 'replica-a'),
      otherLease.acquire(namespace, 'replica-b'),
    ]);

    expect(results.filter(result => result !== undefined)).toHaveLength(1);
    expect(await rawLease(fixture)).toBeDefined();
  });
});

if (pgUrl) {
  it('serializes concurrent acquisition across separate PostgreSQL connections', async () => {
    const admin = knex({ client: 'pg', connection: pgUrl });
    const schema = `ai_lease_race_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    const config = {
      client: 'pg' as const,
      connection: pgUrl,
      searchPath: [schema],
    };
    const first = knex(config);
    const second = knex(config);
    try {
      await storageMigration.up(first);
      await recoveryMigration.up(first);
      const [firstLease, secondLease] = await Promise.all([
        createKnexNamespaceLease({ db: first, ttlMs }),
        createKnexNamespaceLease({ db: second, ttlMs }),
      ]);

      const results = await Promise.all([
        firstLease.acquire(namespace, 'replica-a'),
        secondLease.acquire(namespace, 'replica-b'),
        firstLease.acquire(other, 'replica-a'),
        secondLease.acquire(other, 'replica-b'),
      ]);

      for (const sessionId of ['session', 'other']) {
        expect(
          results.filter(fence => fence?.namespace.sessionId === sessionId),
        ).toHaveLength(1);
      }
      const rows = await first('ai_namespace_leases').orderBy('session_id');
      expect(rows.map(row => String(row.token))).toEqual(['1', '1']);
    } finally {
      await first.destroy();
      await second.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    }
  });
}

async function waitUntil(
  check: () => Promise<boolean>,
  timeoutMs = 5_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await check()) return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('Timed out waiting for the expected database state');
}

if (pgUrl) {
  it('does not revive a fence that expired while renew waited for the row lock', async () => {
    const admin = knex({ client: 'pg', connection: pgUrl });
    const schema = `ai_lease_lockwait_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    const config = {
      client: 'pg' as const,
      connection: pgUrl,
      searchPath: [schema],
    };
    const db = knex(config);
    const blockerDb = knex(config);
    try {
      await storageMigration.up(db);
      const lease = await createKnexNamespaceLease({ db, ttlMs });
      const fence = await lease.acquire(namespace, 'replica-a');

      // This generation expires 700ms from now, by database time.
      await db('ai_namespace_leases')
        .where({
          plugin_id: namespace.pluginId,
          session_id: namespace.sessionId,
        })
        .update({
          expires_at: db.raw(
            "statement_timestamp() + interval '700 milliseconds'",
          ),
        });

      // A competing transaction holds the row, so the renewal waits.
      const blocker = await blockerDb.transaction();
      await blocker('ai_namespace_leases')
        .where({
          plugin_id: namespace.pluginId,
          session_id: namespace.sessionId,
        })
        .forUpdate()
        .select('token')
        .first();

      const renewal = lease.renew(fence!);
      let settled = false;
      renewal.then(
        () => {
          settled = true;
        },
        () => {
          settled = true;
        },
      );

      // The renewal is genuinely blocked on the row lock, not merely slow.
      await waitUntil(async () => {
        const { rows } = await db.raw(
          `select count(*)::int as waiting from pg_stat_activity
             where wait_event_type = 'Lock' and query ilike '%ai_namespace_leases%'
               and pid <> pg_backend_pid()`,
        );
        return rows[0].waiting > 0;
      });
      expect(settled).toBe(false);

      // Let the lease expire while the renewal is still waiting, and confirm
      // the expiry with a fresh statement on another connection.
      await new Promise(resolve => setTimeout(resolve, 900));
      const expired = await db('ai_namespace_leases')
        .where({
          plugin_id: namespace.pluginId,
          session_id: namespace.sessionId,
        })
        .select(db.raw(`${liveCondition('pg')} as live`))
        .first();
      expect(expired.live).toBe(false);

      await blocker.rollback();

      // The clock must be read after the lock wait: this renewal fails.
      await expect(renewal).resolves.toBe(false);
      const after = await db('ai_namespace_leases')
        .where({
          plugin_id: namespace.pluginId,
          session_id: namespace.sessionId,
        })
        .select('token', db.raw(`${liveCondition('pg')} as live`))
        .first();
      expect(after.live).toBe(false);
      expect(String(after.token)).toBe('1');
    } finally {
      await db.destroy();
      await blockerDb.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    }
  }, 20_000);
}
