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
import knex, { type Knex } from 'knex';
import { mockCredentials } from '@backstage/backend-test-utils';
import { createModelOperationGuard } from '../guard/createModelOperationGuard';
import type { TrustedOperation } from '../guard/types';
import { createAttemptJournal } from '../journal/knex';
import { pruneAiJournal } from '../journal/retention';
import { createKnexNamespaceLease } from '../ownership/KnexNamespaceLease';
import { createMetricsSubscriber } from './metrics';
import { emitSafe, assertObservableEvent } from './types';

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const fence = {
  namespace: { pluginId: 'plugin', sessionId: 'session' },
  owner: 'owner',
  token: '1',
};

async function memoryDb(): Promise<{ db: Knex; cleanup(): Promise<void> }> {
  const dir = await mkdtemp(join(tmpdir(), 'ai-observability-'));
  const db = knex({
    client: 'better-sqlite3',
    connection: { filename: join(dir, 'obs.sqlite') },
    useNullAsDefault: true,
    pool: { min: 1, max: 1 },
  });
  await storageMigration.up(db);
  await journalMigration.up(db);
  return {
    db,
    cleanup: async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    },
  };
}

function decision(overrides: Record<string, unknown> = {}) {
  return {
    actor: 'user:default/alice',
    conversationId: 'plugin/session',
    taskId: 'plugin/session',
    callId: `plugin/session#${Math.random()}`,
    definitionVersion: 'v1',
    configVersion: 'v1',
    provider: 'openai',
    model: 'gpt-review',
    operation: 'models.stream',
    attempt: 1,
    decision: 'allow' as const,
    ...overrides,
  };
}

describe('observability seam', () => {
  it('aggregates every event type without unbounded labels', () => {
    const metrics = createMetricsSubscriber();
    metrics.emit({
      kind: 'denial',
      at: 1,
      provider: 'openai',
      operation: 'models.stream',
      reason: 'model operation denied',
      attempt: 1,
    });
    metrics.emit({
      kind: 'denial',
      at: 2,
      provider: 'openai',
      operation: 'models.stream',
      reason: 'credential expired; re-authentication required',
      attempt: 2,
    });
    metrics.emit({
      kind: 'dispatch',
      at: 3,
      provider: 'openai',
      operation: 'models.stream',
      outcome: 'sent',
      httpStatus: 200,
      durationMs: 12,
    });
    metrics.emit({
      kind: 'dispatch',
      at: 4,
      operation: 'auth.token',
      outcome: 'failed',
      httpStatus: 401,
      durationMs: 8,
    });
    metrics.emit({
      kind: 'lease',
      at: 5,
      pluginId: 'plugin',
      sessionId: 'session',
      action: 'acquire',
      durationMs: 3,
    });
    metrics.emit({
      kind: 'lease',
      at: 6,
      pluginId: 'plugin',
      sessionId: 'session',
      action: 'contention',
    });
    metrics.emit({
      kind: 'journal',
      at: 7,
      action: 'decision',
      decision: 'allow',
      durationMs: 2,
    });
    metrics.emit({
      kind: 'journal',
      at: 8,
      action: 'prune',
      durationMs: 4,
      pruned: 9,
    });

    const snapshot = metrics.snapshot();
    expect(snapshot.events).toBe(8);
    expect(snapshot.failures).toBe(3);
    expect(snapshot.activeLeases).toBe(1);
    expect(snapshot.durations).toEqual({ dispatch: 20, lease: 3, journal: 6 });
    // Two denials collapse into one series: the reason is never a label.
    expect(
      snapshot.counters.find(series => series.labels.kind === 'denial'),
    ).toMatchObject({
      count: 2,
      labels: {
        kind: 'denial',
        operation: 'models.stream',
        provider: 'openai',
      },
    });
    expect(
      snapshot.counters.filter(series => series.labels.kind === 'dispatch'),
    ).toHaveLength(2);
    expect(JSON.stringify(snapshot)).not.toContain('credential expired');

    metrics.emit({
      kind: 'lease',
      at: 9,
      pluginId: 'plugin',
      sessionId: 'session',
      action: 'release',
    });
    expect(metrics.snapshot().activeLeases).toBe(0);
    metrics.reset();
    expect(metrics.snapshot()).toMatchObject({
      events: 0,
      failures: 0,
      activeLeases: 0,
      counters: [],
      durations: {},
    });
  });

  it('rejects secret-shaped and unbounded events before any subscriber', () => {
    const metrics = createMetricsSubscriber();
    const rejected: unknown[] = [
      {
        kind: 'denial',
        at: 1,
        operation: 'models.stream',
        reason: 'Authorization: Bearer abcdef1234567890',
        attempt: 1,
      },
      {
        kind: 'denial',
        at: 1,
        operation: 'models.stream',
        reason: 'sk-proj-abcdefghijklmnopqrstuvwxyz012345',
        attempt: 1,
      },
      {
        kind: 'dispatch',
        at: 1,
        operation: 'models.stream',
        outcome: 'sent',
        durationMs: 1,
        prompt: 'what is the secret',
      },
      { kind: 'nope', at: 1 },
    ];
    for (const event of rejected) {
      expect(() => assertObservableEvent(event)).toThrow();
      // The helper drops it instead of breaking the observed operation.
      expect(() => emitSafe(metrics, event as never)).not.toThrow();
    }
    expect(metrics.snapshot().events).toBe(0);

    // A throwing subscriber cannot break the caller either.
    expect(() =>
      emitSafe(
        {
          emit() {
            throw new Error('subscriber down');
          },
        },
        {
          kind: 'lease',
          at: 1,
          pluginId: 'p',
          sessionId: 's',
          action: 'acquire',
        },
      ),
    ).not.toThrow();
  });

  it('emits at journal, lease and guard boundaries', async () => {
    const { db, cleanup } = await memoryDb();
    const metrics = createMetricsSubscriber();
    try {
      const lease = await createKnexNamespaceLease({ db, events: metrics });
      const fenceValue = await lease.acquire(fence.namespace, fence.owner);
      expect(fenceValue).toBeDefined();
      // A competing owner contends for the same namespace.
      await expect(
        lease.acquire(fence.namespace, 'other-owner'),
      ).resolves.toBeUndefined();
      await lease.renew(fenceValue!);

      const journal = createAttemptJournal({
        db,
        authorizer: { authorizeAuditRead: async () => true },
        events: metrics,
      });
      const id = await journal.recordDecisionAndIntent(
        fenceValue!,
        decision() as never,
      );
      await journal.recordOutcome(fenceValue!, id, {
        status: 'completed',
        httpStatus: 200,
      });
      await journal.recordRecovery(fenceValue!, {
        actor: 'user:default/alice',
        kind: 'other',
        detail: 'recovered',
      });

      const guard = createModelOperationGuard({
        journal,
        recheck: async () => true,
        transport: (async () =>
          new Response('ok', { status: 200 })) as unknown as typeof fetch,
        events: metrics,
      }).bind({
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified',
          conversationId: 'plugin/session',
          taskId: 'plugin/session',
          callId: 'plugin/session#1',
        },
        fence: fenceValue!,
        definitionVersion: 'v1',
        configVersion: 'v1',
        provider: 'openai',
        modelId: 'gpt-review',
        resolvedModel: 'gpt-review',
        operation: 'stream',
        api: 'openai-responses',
        destination: 'https://provider.example/v1/responses',
        credentialScope: { kind: 'org' },
        credentialGeneration: 'gen-1',
        controller: new AbortController(),
      } as TrustedOperation);
      await (
        await guard.fetch('https://provider.example/v1/responses', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ model: 'gpt-review', input: [] }),
        })
      ).text();
      await guard.finish('completed');
      const denied = createModelOperationGuard({
        journal,
        recheck: async () => false,
        transport: (async () =>
          new Response('nope')) as unknown as typeof fetch,
        events: metrics,
      }).bind({
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified',
          conversationId: 'plugin/session',
          taskId: 'plugin/session',
          callId: 'plugin/session#2',
        },
        fence: fenceValue!,
        definitionVersion: 'v1',
        configVersion: 'v1',
        provider: 'openai',
        modelId: 'gpt-review',
        resolvedModel: 'gpt-review',
        operation: 'stream',
        api: 'openai-responses',
        destination: 'https://provider.example/v1/responses',
        credentialScope: { kind: 'org' },
        credentialGeneration: 'gen-1',
        controller: new AbortController(),
      } as TrustedOperation);
      await expect(
        denied.fetch('https://provider.example/v1/responses', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ model: 'gpt-review', input: [] }),
        }),
      ).rejects.toThrow();

      // Release last: the journal writes above need a live fence.
      await lease.release(fenceValue!);
      // Renewing a released lease reports the loss.
      await lease.renew(fenceValue!);

      expect(metrics.snapshot().counters.length).toBeGreaterThan(0);
      const paths = metrics
        .snapshot()
        .counters.flatMap(series => [
          series.labels.kind,
          series.labels.action ?? '',
          series.labels.outcome ?? '',
          series.labels.decision ?? '',
        ]);
      for (const expected of [
        'lease',
        'acquire',
        'contention',
        'release',
        'lost',
        'journal',
        'decision',
        'outcome',
        'recovery',
        'dispatch',
        'sent',
        'denial',
      ]) {
        expect(paths).toContain(expected);
      }
    } finally {
      await cleanup();
    }
  }, 20000);

  it('prunes through the seam and stays behavior-identical without a subscriber', async () => {
    const withEvents = await memoryDb();
    const withoutEvents = await memoryDb();
    try {
      const metrics = createMetricsSubscriber();
      const journalFor = (db: Knex, events?: typeof metrics) =>
        createAttemptJournal({
          db,
          authorizer: { authorizeAuditRead: async () => true },
          ...(events ? { events } : {}),
        });
      const leaseA = await createKnexNamespaceLease({ db: withEvents.db });
      const leaseB = await createKnexNamespaceLease({ db: withoutEvents.db });
      const fenceA = (await leaseA.acquire(fence.namespace, fence.owner))!;
      const fenceB = (await leaseB.acquire(fence.namespace, fence.owner))!;
      const a = journalFor(withEvents.db, metrics);
      const b = journalFor(withoutEvents.db);
      for (const [journal, leaseFence] of [
        [a, fenceA],
        [b, fenceB],
      ] as const) {
        const id = await journal.recordDecisionAndIntent(
          leaseFence,
          decision({ callId: 'plugin/session#same' }) as never,
        );
        await journal.recordOutcome(leaseFence, id, {
          status: 'completed',
          httpStatus: 200,
        });
      }

      const pruneA = await pruneAiJournal(withEvents.db, {
        retentionMs: 1,
        now: new Date(Date.now() + 60_000),
        events: metrics,
      });
      const pruneB = await pruneAiJournal(withoutEvents.db, {
        retentionMs: 1,
        now: new Date(Date.now() + 60_000),
      });
      expect(pruneA).toEqual(pruneB);
      expect(metrics.snapshot().counters.map(s => s.labels.action)).toContain(
        'prune',
      );

      // Same durable rows with and without a subscriber.
      const rowsA = await withEvents
        .db('ai_journal_events')
        .orderBy('id')
        .select('kind', 'decision', 'status');
      const rowsB = await withoutEvents
        .db('ai_journal_events')
        .orderBy('id')
        .select('kind', 'decision', 'status');
      expect(rowsA).toEqual(rowsB);
    } finally {
      await withEvents.cleanup();
      await withoutEvents.cleanup();
    }
  }, 20000);
});
