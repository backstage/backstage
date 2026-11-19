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
import { createModelOperationGuard as createModelOperationGuardBase } from '../guard/createModelOperationGuard';
import type { TrustedOperation } from '../guard/types';
import { createAttemptJournal as createAttemptJournalBase } from '../journal/knex';
import { pruneAiJournal } from '../journal/retention';
import { createKnexNamespaceLease } from '../ownership/KnexNamespaceLease';
import { createMetricsSubscriber } from './metrics';
import {
  GuardedResolutionError,
  createGuardedModelOperations as createGuardedModelOperationsBase,
} from '../guard/modelOperations';
import { assertObservableEvent, createAiEventSink } from './types';
import type { AiObservabilityEvent } from './types';
import { builtinProviderRegistry } from '@backstage/ai-node-test-utils/alpha';

const createModelOperationGuard = (
  options: Parameters<typeof createModelOperationGuardBase>[0],
) =>
  createModelOperationGuardBase({
    providers: builtinProviderRegistry,
    ...options,
  });
const createAttemptJournal = (
  options: Parameters<typeof createAttemptJournalBase>[0],
) =>
  createAttemptJournalBase({ providers: builtinProviderRegistry, ...options });
const createGuardedModelOperations = (
  options: Parameters<typeof createGuardedModelOperationsBase>[0],
) =>
  createGuardedModelOperationsBase({
    providers: builtinProviderRegistry,
    ...options,
  });

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const fence_namespace = { pluginId: 'plugin', sessionId: 'session' };

const fence = {
  namespace: fence_namespace,
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

/**
 * A synchronous bus double wired to a metrics subscriber: the sink
 * publishes, the subscriber aggregates, all in the same call stack —
 * the real service's delivery discipline without its asynchronous hops.
 */
async function subscriberHarness(): Promise<{
  subscriber: ReturnType<typeof createMetricsSubscriber>;
  emit: (event: AiObservabilityEvent) => void;
  publishForeign: (eventPayload: unknown) => void;
}> {
  const subscriber = createMetricsSubscriber();
  const handlers: Array<(params: unknown) => void> = [];
  const bus = {
    publish(params: unknown) {
      for (const handler of handlers) handler(params);
      return Promise.resolve();
    },
    async subscribe(options: { onEvent: (params: never) => Promise<void> }) {
      handlers.push(options.onEvent as unknown as (params: unknown) => void);
    },
  };
  await subscriber.subscribe(bus);
  return {
    subscriber,
    emit: createAiEventSink(bus),
    // A foreign publisher on the same topics: no validation, no sink.
    publishForeign: (eventPayload: unknown) => bus.publish({ eventPayload }),
  };
}

describe('observability seam', () => {
  it('aggregates every event type without unbounded labels', async () => {
    const harness = await subscriberHarness();
    const metrics = harness.subscriber;
    harness.emit({
      kind: 'denial',
      at: 1,
      provider: 'openai',
      operation: 'models.stream',
      reason: 'model operation denied',
      attempt: 1,
    });
    harness.emit({
      kind: 'denial',
      at: 2,
      provider: 'openai',
      operation: 'models.stream',
      reason: 'credential expired; re-authentication required',
      attempt: 2,
    });
    harness.emit({
      kind: 'dispatch',
      at: 3,
      provider: 'openai',
      operation: 'models.stream',
      outcome: 'sent',
      httpStatus: 200,
      durationMs: 12,
    });
    harness.emit({
      kind: 'dispatch',
      at: 4,
      operation: 'auth.token',
      outcome: 'failed',
      httpStatus: 401,
      durationMs: 8,
    });
    harness.emit({
      kind: 'lease',
      at: 5,
      pluginId: 'plugin',
      sessionId: 'session',
      action: 'acquire',
      durationMs: 3,
    });
    harness.emit({
      kind: 'lease',
      at: 6,
      pluginId: 'plugin',
      sessionId: 'session',
      action: 'contention',
    });
    harness.emit({
      kind: 'journal',
      at: 7,
      action: 'decision',
      decision: 'allow',
      durationMs: 2,
    });
    harness.emit({
      kind: 'journal',
      at: 8,
      action: 'prune',
      durationMs: 4,
      pruned: 9,
    });

    const snapshot = metrics.snapshot();
    expect(snapshot.events).toBe(8);
    // 2 denials + 1 failed dispatch. The journal allow is not a failure.
    expect(snapshot.failures).toBe(3);
    expect(snapshot.journalDecisions).toEqual({ allow: 1, deny: 0 });
    expect(snapshot.activeLeases).toBe(1);
    expect(snapshot.durations).toEqual({
      dispatch: 20,
      dispatchTerminal: 8,
      lease: 3,
      journal: 6,
    });
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

    harness.emit({
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

  it('rejects secret-shaped and unbounded events before any subscriber', async () => {
    const harness = await subscriberHarness();
    const metrics = harness.subscriber;
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
      // Closed sets: an unknown union member would mint a new series.
      {
        kind: 'dispatch',
        at: 1,
        operation: 'models.stream',
        outcome: 'exploded',
        durationMs: 1,
      },
      { kind: 'lease', at: 1, pluginId: 'p', sessionId: 's', action: 'steal' },
      {
        kind: 'journal',
        at: 1,
        action: 'append',
        durationMs: 1,
      },
      // Free-text and oversized label values are refused.
      {
        kind: 'denial',
        at: 1,
        provider: 'provider with spaces and a free form sentence',
        operation: 'models.stream',
        reason: 'denied',
        attempt: 1,
      },
      {
        kind: 'denial',
        at: 1,
        operation: 'models.stream',
        reason: 'x'.repeat(400),
        attempt: 1,
      },
      // Per-kind field sets: a journal field on a dispatch is refused.
      {
        kind: 'dispatch',
        at: 1,
        operation: 'anything',
        outcome: 'completed',
        durationMs: 1,
        action: 'unexpected',
      },
      // Ranges and required fields.
      {
        kind: 'dispatch',
        at: 1,
        operation: 'models.stream',
        outcome: 'completed',
        durationMs: -1,
      },
      {
        kind: 'dispatch',
        at: 1,
        operation: 'models.stream',
        outcome: 'completed',
        httpStatus: 99,
        durationMs: 1,
      },
      {
        kind: 'denial',
        at: 1,
        operation: 'models.stream',
        attempt: 1,
      },
      { kind: 'lease', at: 1, action: 'acquire' },
      // Credential-shaped identifiers, using the journal's own vocabulary.
      {
        kind: 'lease',
        at: 1,
        pluginId: 'ghp_abcdefghijklmnopqrstuvwxyz0123',
        sessionId: 'session',
        action: 'acquire',
      },
      {
        kind: 'lease',
        at: 1,
        pluginId: 'plugin',
        sessionId: 'sk-proj-abcdefghijklmnopqrstuvwxyz012345',
        action: 'acquire',
      },
      {
        kind: 'denial',
        at: 1,
        provider: 'AIzaSyA1234567890abcdefghijklmnopqrstuv',
        operation: 'models.stream',
        reason: 'denied',
        attempt: 1,
      },
      {
        kind: 'denial',
        at: 1,
        operation: 'models.stream',
        reason: 'api_key=abcdefghijkl',
        attempt: 1,
      },
      // Untyped content in a field declared as a string.
      {
        kind: 'lease',
        at: 1,
        pluginId: 7,
        sessionId: 'session',
        action: 'acquire',
      },
      {
        kind: 'dispatch',
        at: 1,
        operation: true,
        outcome: 'sent',
        durationMs: 1,
      },
      {
        kind: 'journal',
        at: 1,
        action: 'decision',
        decision: { toString: () => 'allow' },
        durationMs: 1,
      },
    ];
    for (const event of rejected) {
      expect(() => assertObservableEvent(event)).toThrow();
      // The sink drops it instead of breaking the observed operation.
      expect(() => harness.emit(event as never)).not.toThrow();
    }
    expect(metrics.snapshot().events).toBe(0);

    // The topics are shared: a foreign publisher can put any shape on
    // them without passing the sink. The subscriber validates on its
    // side too — a malformed payload must neither corrupt the
    // aggregation nor throw out of the events service.
    expect(() =>
      harness.publishForeign({
        kind: 'journal',
        at: 1,
        action: 'decision',
        decision: 'allow',
        durationMs: 'not-a-number',
      }),
    ).not.toThrow();
    harness.publishForeign({ kind: 'unknown' });
    harness.publishForeign(null);
    expect(metrics.snapshot().events).toBe(0);
    expect(metrics.snapshot().journalDecisions).toEqual({ allow: 0, deny: 0 });

    // A well-formed foreign payload still aggregates normally.
    harness.publishForeign({
      kind: 'journal',
      at: 2,
      action: 'decision',
      decision: 'allow',
      durationMs: 1,
    });
    expect(metrics.snapshot().journalDecisions).toEqual({ allow: 1, deny: 0 });

    // A rejecting publish cannot surface an unhandled rejection: the
    // events service is fire-and-forget from the sink's perspective.
    const rejections: unknown[] = [];
    const onRejection = (reason: unknown) => rejections.push(reason);
    process.on('unhandledRejection', onRejection);
    try {
      const rejectingSink = createAiEventSink({
        publish: async () => {
          throw new Error('publish down');
        },
      });
      expect(() =>
        rejectingSink({
          kind: 'lease',
          at: 1,
          pluginId: 'p',
          sessionId: 's',
          action: 'acquire',
        }),
      ).not.toThrow();
      await new Promise(resolve => setImmediate(resolve));
      await new Promise(resolve => setImmediate(resolve));
      expect(rejections).toEqual([]);
    } finally {
      process.off('unhandledRejection', onRejection);
    }

    // A callable thenable — a publish returning a function with a .then
    // method bound to a rejecting promise — is neither typeof 'object'
    // nor caught by the sync try/catch; the sink must swallow its
    // rejection too, keeping the same discipline as the prune runner's
    // logger isolation.
    {
      const callableRejections: unknown[] = [];
      const onCallable = (reason: unknown) => callableRejections.push(reason);
      process.on('unhandledRejection', onCallable);
      try {
        const rejecting = Promise.reject(new Error('callable publish down'));
        // The publish returns the callable thenable itself; the sink
        // decides on that return value.
        const callablePublish = (() => {
          const fn = () => fn;
          fn.then = rejecting.then.bind(rejecting);
          return fn as unknown as () => unknown;
        })();
        const callableSink = createAiEventSink({
          publish: callablePublish,
        });
        expect(() =>
          callableSink({
            kind: 'lease',
            at: 2,
            pluginId: 'p',
            sessionId: 's',
            action: 'acquire',
          }),
        ).not.toThrow();
        await new Promise(resolve => setImmediate(resolve));
        await new Promise(resolve => setImmediate(resolve));
        expect(callableRejections).toEqual([]);
      } finally {
        process.off('unhandledRejection', onCallable);
      }
    }

    // A throwing publish cannot break the caller either.
    expect(() =>
      createAiEventSink({
        publish: () => {
          throw new Error('publish threw');
        },
      })({
        kind: 'lease',
        at: 1,
        pluginId: 'p',
        sessionId: 's',
        action: 'acquire',
      }),
    ).not.toThrow();
  });

  it('bounds the label space regardless of the values it is fed', async () => {
    const harness = await subscriberHarness();
    const metrics = harness.subscriber;
    for (let i = 0; i < 10_000; i++) {
      harness.emit({
        kind: 'denial',
        at: i,
        provider: `provider-${i}`,
        operation: 'models.stream',
        reason: `denied reason ${i}`,
        attempt: 1,
      });
    }
    const snapshot = metrics.snapshot();
    // 256 distinct series plus one overflow bucket for this kind alone, not
    // 10 000. The budget is per kind, so four kinds can reach 260.
    expect(snapshot.counters.length).toBeLessThanOrEqual(257);
    expect(
      snapshot.counters.some(series => series.labels.kind === 'overflow'),
    ).toBe(true);
    expect(snapshot.events).toBe(10_000);
    expect(snapshot.failures).toBe(10_000);
    // Structurally reason-free: no series label can carry the reason text.
    expect(JSON.stringify(snapshot)).not.toContain('denied reason');
  });

  it('emits at journal, lease and guard boundaries', async () => {
    const harness = await subscriberHarness();
    const { db, cleanup } = await memoryDb();
    const metrics = harness.subscriber;
    try {
      const lease = await createKnexNamespaceLease({ db, emit: harness.emit });
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
        emit: harness.emit,
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
        emit: harness.emit,
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
        emit: harness.emit,
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

  it('tells the truth about idempotent acquires and hostile tenant text', async () => {
    const harness = await subscriberHarness();
    const { db, cleanup } = await memoryDb();
    const metrics = harness.subscriber;
    try {
      const lease = await createKnexNamespaceLease({ db, emit: harness.emit });

      // Re-acquiring a live lease with the same owner returns the same
      // generation: one hold, so one release must zero the gauge.
      const first = await lease.acquire(fence_namespace, 'owner');
      const second = await lease.acquire(fence_namespace, 'owner');
      expect(second).toEqual(first);
      expect(metrics.snapshot().activeLeases).toBe(1);
      const leaseSeries = () =>
        metrics.snapshot().counters.filter(s => s.labels.kind === 'lease');
      expect(
        leaseSeries().find(s => s.labels.action === 'acquire')?.count,
      ).toBe(1);
      expect(leaseSeries().some(s => s.labels.action === 'renew')).toBe(true);

      await lease.release(first!);
      expect(metrics.snapshot().activeLeases).toBe(0);

      // Producer-side free text and credential-shaped identifiers never reach
      // the subscriber: the lease still works, the observation is dropped.
      const hostile = { pluginId: 'P@ssw0rd!', sessionId: 'patient diagnosis' };
      const before = metrics.snapshot().events;
      const held = await lease.acquire(hostile, 'owner');
      expect(held).toBeDefined();
      await lease.release(held!);
      expect(metrics.snapshot().events).toBe(before);
      expect(JSON.stringify(metrics.snapshot())).not.toContain('P@ssw0rd');
      expect(JSON.stringify(metrics.snapshot())).not.toContain('diagnosis');
    } finally {
      await cleanup();
    }
  }, 20000);

  it('emits internal reason codes only, never caller text', async () => {
    const { db, cleanup } = await memoryDb();
    const seen: string[] = [];
    const harness = await subscriberHarness();
    const recorder = (event: AiObservabilityEvent) => {
      if (event.kind === 'denial') seen.push(event.reason);
      harness.emit(event);
    };
    // The closed vocabulary every reason path may draw from.
    const INTERNAL_REASONS = new Set([
      'model operation denied',
      'credential expired; re-authentication required',
      'unverified auth operation',
    ]);
    try {
      const lease = await createKnexNamespaceLease({ db, emit: recorder });
      const held = (await lease.acquire(fence_namespace, 'owner'))!;
      const journal = createAttemptJournal({
        db,
        authorizer: { authorizeAuditRead: async () => true },
        emit: recorder,
      });
      const operation = (callId: string) =>
        ({
          actor: 'user:default/alice',
          credentials: mockCredentials.user('user:default/alice'),
          provenance: {
            origin: 'verified',
            conversationId: 'plugin/session',
            taskId: 'plugin/session',
            callId,
          },
          fence: held,
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
        } as never);
      const request = () => ({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-review', input: [] }),
      });

      // A revoked authority denial and an expired-credential denial.
      const revoked = createModelOperationGuard({
        journal,
        recheck: async () => false,
        transport: (async () => new Response('no')) as never,
        emit: recorder,
      }).bind(operation('plugin/session#revoked'));
      await expect(
        revoked.fetch('https://provider.example/v1/responses', request()),
      ).rejects.toThrow();

      const expired = createModelOperationGuard({
        journal,
        recheck: async () => true,
        transport: (async () => new Response('no')) as never,
        emit: recorder,
      }).bind({
        ...(operation('plugin/session#expired') as object),
        credentialScope: { kind: 'user', id: 'user:default/alice' },
        providerCredentialExpiresAt: Date.now() - 1_000,
      } as never);
      await expect(
        expired.fetch('https://provider.example/v1/responses', request()),
      ).rejects.toThrow();

      await lease.release(held);

      expect(seen.length).toBeGreaterThanOrEqual(2);
      for (const reason of seen) {
        expect(INTERNAL_REASONS.has(reason)).toBe(true);
        // No caller-supplied text can reach a reason.
        expect(reason).not.toContain('plugin/session#');
        expect(reason).not.toContain('alice');
        expect(reason).not.toContain('provider.example');
      }
    } finally {
      await cleanup();
    }
  }, 20000);

  it('keeps the gauge with the current lease holder across a takeover', async () => {
    const harness = await subscriberHarness();
    const { db, cleanup } = await memoryDb();
    const metrics = harness.subscriber;
    try {
      const lease = await createKnexNamespaceLease({ db, emit: harness.emit });
      const oldHolder = (await lease.acquire(fence_namespace, 'old'))!;
      expect(metrics.snapshot().activeLeases).toBe(1);

      // Expire the row in the database, then let a new owner take over.
      await db('ai_namespace_leases')
        .where({ plugin_id: 'plugin', session_id: 'session' })
        .update({ expires_at: db.raw('0') });
      const newHolder = (await lease.acquire(fence_namespace, 'new'))!;
      expect(newHolder.token).not.toBe(oldHolder.token);
      expect(metrics.snapshot().activeLeases).toBe(1);

      // The stale holder's renewal fails: its lost event must not evict the
      // holder that superseded it.
      await expect(lease.renew(oldHolder)).resolves.toBe(false);
      expect(metrics.snapshot().activeLeases).toBe(1);

      await lease.release(newHolder);
      expect(metrics.snapshot().activeLeases).toBe(0);
    } finally {
      await cleanup();
    }
  }, 20000);

  it('drops wrongly typed identifiers from the real lease producer', async () => {
    const harness = await subscriberHarness();
    const { db, cleanup } = await memoryDb();
    const metrics = harness.subscriber;
    try {
      const lease = await createKnexNamespaceLease({ db, emit: harness.emit });
      const before = metrics.snapshot();
      // The producer refuses an untyped namespace outright, so nothing can be
      // forwarded, and no event is emitted for the rejected attempt.
      await expect(
        lease.acquire({ pluginId: 7, sessionId: true } as never, 'owner'),
      ).rejects.toThrow(/Invalid namespace/);
      expect(metrics.snapshot()).toEqual(before);

      // A wrongly typed field on an otherwise valid namespace is dropped by the
      // seam rather than reaching a subscriber (see the validator cell); the
      // lease itself keeps working.
      const held = await lease.acquire(fence_namespace, 'owner');
      expect(held).toBeDefined();
    } finally {
      await cleanup();
    }
  }, 20000);

  it('reports an uncertain dispatch when the outcome write fails', async () => {
    const harness = await subscriberHarness();
    const { db, cleanup } = await memoryDb();
    const metrics = harness.subscriber;
    try {
      const lease = await createKnexNamespaceLease({ db });
      const held = (await lease.acquire(fence_namespace, 'owner'))!;
      const real = createAttemptJournal({
        db,
        authorizer: { authorizeAuditRead: async () => true },
        emit: harness.emit,
      });
      // The decision commits, the outcome write fails.
      const journal = {
        recordDecisionAndIntent: real.recordDecisionAndIntent.bind(real),
        recordRecovery: real.recordRecovery.bind(real),
        read: real.read.bind(real),
        recordOutcome: async () => {
          throw new Error('journal unavailable');
        },
      };
      const guard = createModelOperationGuard({
        journal: journal as never,
        recheck: async () => true,
        transport: (async () => new Response('ok', { status: 200 })) as never,
        emit: harness.emit,
      }).bind({
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified',
          conversationId: 'plugin/session',
          taskId: 'plugin/session',
          callId: 'plugin/session#uncertain',
        },
        fence: held,
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
      } as never);
      const response = await guard.fetch(
        'https://provider.example/v1/responses',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ model: 'gpt-review', input: [] }),
        },
      );
      await response.text();
      await expect(guard.finish('completed')).rejects.toThrow(
        /uncertain|journal/,
      );

      const terminal = metrics
        .snapshot()
        .counters.filter(
          series =>
            series.labels.kind === 'dispatch' &&
            series.labels.outcome !== 'sent',
        )
        .map(series => series.labels.outcome);
      // Durable truth: the subscriber sees unknown, never completed.
      expect(terminal).toContain('unknown');
      expect(terminal).not.toContain('completed');
    } finally {
      await cleanup();
    }
  }, 20000);

  it('emits a denial when the auth guard rejects an operation', async () => {
    const harness = await subscriberHarness();
    const metrics = harness.subscriber;
    const recorded: unknown[] = [];
    const { createAuthOperationGuard } = require('../providers/auth/guard');
    const { createAuthModuleRegistry } = require('../providers/auth/modules');
    const { jsonAuthModule } = require('../providers/auth/jsonModuleFixture');
    const guard = createAuthOperationGuard({
      transport: (async () => new Response('{}', { status: 200 })) as never,
      recheck: async () => true,
      journal: {
        recordDecisionAndIntent: async (_fence: unknown, event: unknown) => {
          recorded.push(event);
          return 'attempt-1';
        },
        recordOutcome: async () => undefined,
      },
      modules: createAuthModuleRegistry([
        { ...jsonAuthModule, id: 'anthropic' },
      ]),
      emit: harness.emit,
    }).bind({
      actor: 'user:default/alice',
      credentials: mockCredentials.user('user:default/alice'),
      provenance: {
        origin: 'verified',
        conversationId: 'plugin/session',
        taskId: 'plugin/session',
        callId: 'plugin/session#auth',
      },
      fence,
      definitionVersion: 'v1',
      configVersion: 'v1',
      provider: 'anthropic',
      operation: 'auth.token',
      destination: 'https://token.example/v1/oauth/token',
      // Nothing is trusted, so every attempt is denied before a send.
      authTokenDestinations: [],
      controller: new AbortController(),
    } as never);

    await expect(
      guard.fetch('https://token.example/v1/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ grant_type: 'refresh_token' }),
      }),
    ).rejects.toThrow();

    const snapshot = metrics.snapshot();
    expect(recorded.length).toBeGreaterThan(0);
    expect(snapshot.failures).toBe(1);
    expect(
      snapshot.counters.some(series => series.labels.kind === 'denial'),
    ).toBe(true);
  });

  it('reports every local denial boundary as one failure', async () => {
    const harness = await subscriberHarness();
    const { db, cleanup } = await memoryDb();
    const metrics = harness.subscriber;
    const credentialsMigration = require('../../migrations/2000_credentials');
    const {
      createCredentialStores,
    } = require('../credentials/createCredentialStores');
    const { createAuthOperations } = require('../providers/auth/operations');
    const { createAuthOperationGuard } = require('../providers/auth/guard');
    const modules = require('../providers/auth/modules');
    const { jsonAuthModule } = require('../providers/auth/jsonModuleFixture');
    /** The extracted anthropic auth module stands in as a local fixture. */
    const denyProbeModules = modules.createAuthModuleRegistry([jsonAuthModule]);
    try {
      await credentialsMigration.up(db);
      const lease = await createKnexNamespaceLease({ db });
      const held = (await lease.acquire(fence_namespace, 'owner'))!;
      const journal = createAttemptJournal({
        db,
        authorizer: { authorizeAuditRead: async () => true },
        emit: harness.emit,
      });
      const context = {
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified' as const,
          conversationId: 'plugin/session',
          taskId: 'plugin/session',
          callId: 'plugin/session#auth-missing',
        },
        fence: held,
        definitionVersion: 'v1',
        configVersion: 'v1',
      };
      const operations = createAuthOperations({
        guard: createAuthOperationGuard({
          transport: (async () => new Response('{}', { status: 200 })) as never,
          recheck: async () => true,
          journal,
          emit: harness.emit,
          modules: denyProbeModules,
        }),
        journal,
        stores: createCredentialStores({
          db,
          encryptionKey: new Uint8Array(32).fill(4),
          configCredentials: new Map(),
        }),
        emit: harness.emit,
        modules: denyProbeModules,
        tokenEndpoints: {
          anthropic: {
            url: 'https://token.example/v1/oauth/token',
            clientId: 'client-id',
          },
        },
      });

      // 1. Local auth denial: no stored credential.
      await expect(
        operations.refresh({
          context,
          providerId: 'anthropic',
          scope: { kind: 'user', id: 'user:default/alice' },
        }),
      ).rejects.toThrow(/re-authentication required/);

      let snapshot = metrics.snapshot();
      expect(snapshot.failures).toBe(1);
      expect(snapshot.journalDecisions.deny).toBe(1);
      expect(
        snapshot.counters.find(series => series.labels.kind === 'denial'),
      ).toMatchObject({
        count: 1,
        labels: { operation: 'auth.token', provider: 'anthropic' },
      });

      // 2. Model policy denial: the binding has no provider credentials.
      const requests = createGuardedModelOperations({
        guard: createModelOperationGuard({
          journal,
          recheck: async () => true,
          transport: (async () => new Response('ok')) as never,
        }),
        journal,
        emit: harness.emit,
        providers: builtinProviderRegistry,
        resolve: () => ({
          model: {} as never,
          operation: {
            ...context,
            provenance: {
              ...context.provenance,
              callId: 'plugin/session#no-credentials',
            },
            provider: 'openai',
            modelId: 'gpt-review',
            resolvedModel: 'gpt-review',
            operation: 'completeSimple',
            api: 'openai-responses',
            destination: 'https://provider.example/v1/responses',
            credentialScope: { kind: 'org' },
            credentialGeneration: 'gen-1',
            controller: new AbortController(),
          },
          authority: { kind: 'apiKey' },
        }),
      });
      const { openaiProvider } = require('@earendil-works/pi-ai');
      const model = {
        ...(openaiProvider ? openaiProvider().getModels()[0] : {}),
        id: 'gpt-review',
        name: 'gpt-review',
        provider: 'openai',
        api: 'openai-responses',
        baseUrl: 'https://provider.example/v1',
        contextWindow: 400_000,
        maxTokens: 128_000,
        input: ['text'],
        reasoning: false,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      };
      // The policy rejection settles as an error result, not a throw; what
      // matters is that the denial was journaled and observed exactly once.
      await requests.completeSimple(
        model as never,
        {
          messages: [{ role: 'user', content: 'hello' }],
        } as never,
      );

      snapshot = metrics.snapshot();
      // Two logical denials: one auth, one model policy. Each counted once.
      expect(snapshot.failures).toBe(2);
      expect(snapshot.journalDecisions.deny).toBe(2);
    } finally {
      await cleanup();
    }
  }, 20000);

  it('never forwards host callback text into an event reason', async () => {
    const { db, cleanup } = await memoryDb();
    const harness = await subscriberHarness();
    const metrics = harness.subscriber;
    const reasons: string[] = [];
    // Records the reason exactly as a subscriber receives it.
    const recorder = (event: AiObservabilityEvent) => {
      if (event.kind === 'denial') reasons.push(event.reason);
      harness.emit(event);
    };
    try {
      const lease = await createKnexNamespaceLease({ db });
      const held = (await lease.acquire(fence_namespace, 'owner'))!;
      const journal = createAttemptJournal({
        db,
        authorizer: { authorizeAuditRead: async () => true },
        emit: recorder,
      });
      const operation = {
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified',
          conversationId: 'plugin/session',
          taskId: 'plugin/session',
          callId: 'plugin/session#host-text',
        },
        fence: held,
        definitionVersion: 'v1',
        configVersion: 'v1',
        provider: 'openai',
        modelId: 'gpt-review',
        resolvedModel: 'gpt-review',
        operation: 'completeSimple',
        api: 'openai-responses',
        destination: 'https://provider.example/v1/responses',
        credentialScope: { kind: 'org' },
        credentialGeneration: 'gen-1',
        controller: new AbortController(),
      };
      const model = {
        id: 'gpt-review',
        name: 'gpt-review',
        provider: 'openai',
        api: 'openai-responses',
        baseUrl: 'https://provider.example/v1',
        contextWindow: 400_000,
        maxTokens: 128_000,
        input: ['text'],
        reasoning: false,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      };
      const requests = createGuardedModelOperations({
        guard: createModelOperationGuard({
          journal,
          recheck: async () => true,
          transport: (async () => new Response('ok')) as never,
        }),
        journal,
        emit: recorder,
        providers: builtinProviderRegistry,
        // A genuine, trusted binding: only the message is host-controlled.
        resolve: async () => {
          throw new GuardedResolutionError(
            { operation, model } as never,
            'Patient has a confidential diagnosis',
          );
        },
      });

      await requests.completeSimple(
        model as never,
        {
          messages: [{ role: 'user', content: 'hello' }],
        } as never,
      );

      const snapshot = metrics.snapshot();
      expect(snapshot.failures).toBe(1);
      expect(snapshot.journalDecisions.deny).toBe(1);
      // The subscriber sees the fixed code only; the host text never appears.
      expect(reasons).toEqual(['model resolution failed']);
      expect(JSON.stringify(snapshot)).not.toContain('confidential');
      expect(JSON.stringify(snapshot)).not.toContain('diagnosis');
      expect(
        snapshot.counters.find(series => series.labels.kind === 'denial'),
      ).toMatchObject({
        count: 1,
        labels: {
          operation: 'models.completeSimple',
          provider: 'openai',
        },
      });

      // The host's detail survives where it belongs: the durable journal.
      const rows = await db('ai_journal_events')
        .where({ decision: 'deny' })
        .select('reason');
      expect(
        rows.some((row: { reason: string }) =>
          row.reason.includes('confidential diagnosis'),
        ),
      ).toBe(true);
    } finally {
      await cleanup();
    }
  }, 20000);

  it('counts one logical denial and only real lease releases', async () => {
    const harness = await subscriberHarness();
    const { db, cleanup } = await memoryDb();
    const metrics = harness.subscriber;
    try {
      const lease = await createKnexNamespaceLease({ db, emit: harness.emit });
      const held = (await lease.acquire(fence_namespace, 'owner'))!;

      // A real denial through the real guard and journal.
      const journal = createAttemptJournal({
        db,
        authorizer: { authorizeAuditRead: async () => true },
        emit: harness.emit,
      });
      const guard = createModelOperationGuard({
        journal,
        recheck: async () => false,
        transport: (async () => new Response('unreachable')) as never,
        emit: harness.emit,
      }).bind({
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified',
          conversationId: 'plugin/session',
          taskId: 'plugin/session',
          callId: 'plugin/session#denied',
        },
        fence: held,
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
      } as never);
      await expect(
        guard.fetch('https://provider.example/v1/responses', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ model: 'gpt-review', input: [] }),
        }),
      ).rejects.toThrow();

      const snapshot = metrics.snapshot();
      // One denied request is one failure, not one event + one journal row.
      expect(snapshot.failures).toBe(1);
      expect(snapshot.journalDecisions).toEqual({ allow: 0, deny: 1 });
      expect(snapshot.activeLeases).toBe(1);

      // A release that matched nothing must not move the gauge.
      await lease.release(held);
      await lease.release(held);
      expect(metrics.snapshot().activeLeases).toBe(0);
    } finally {
      await cleanup();
    }
  }, 20000);

  it('emits the whole dispatch lifecycle with real durations', async () => {
    const harness = await subscriberHarness();
    const { db, cleanup } = await memoryDb();
    const metrics = harness.subscriber;
    const operation = (callId: string) =>
      ({
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified',
          conversationId: 'plugin/session',
          taskId: 'plugin/session',
          callId,
        },
        fence: {
          namespace: { pluginId: 'plugin', sessionId: 'session' },
          owner: 'owner',
          token: '1',
        },
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
      } as never);
    const request = () => ({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-review', input: [] }),
    });
    const outcomes = () =>
      metrics
        .snapshot()
        .counters.filter(series => series.labels.kind === 'dispatch')
        .map(series => series.labels.outcome);
    try {
      const lease = await createKnexNamespaceLease({ db });
      const live = (await lease.acquire(fence_namespace, 'owner'))!;
      const journal = createAttemptJournal({
        db,
        authorizer: { authorizeAuditRead: async () => true },
      });
      const guardFor = (
        transport: typeof fetch,
        callId: string,
      ): { run(): Promise<void> } => {
        const bound = createModelOperationGuard({
          journal,
          recheck: async () => true,
          transport,
          emit: harness.emit,
        }).bind({ ...(operation(callId) as object), fence: live } as never);
        return {
          async run() {
            const response = await bound.fetch(
              'https://provider.example/v1/responses',
              request(),
            );
            await response.text();
            await bound.finish('completed');
          },
        };
      };

      // Success: sent then completed, duration measured from the send.
      await guardFor(
        (async () => new Response('ok', { status: 200 })) as never,
        'plugin/session#ok',
      ).run();
      expect(outcomes()).toEqual(expect.arrayContaining(['sent', 'completed']));
      const completed = metrics
        .snapshot()
        .counters.find(series => series.labels.outcome === 'completed')!;
      expect(completed.count).toBe(1);
      // Duration is a value, never a label: avgMs cannot change a series key.
      expect(typeof completed.avgMs).toBe('number');
      expect(completed.labels).not.toHaveProperty('avgMs');
      expect(completed.labels).not.toHaveProperty('totalMs');

      // Provider rejected: sent then failed with the status.
      const failedGuard = createModelOperationGuard({
        journal,
        recheck: async () => true,
        transport: (async () => new Response('no', { status: 500 })) as never,
        emit: harness.emit,
      }).bind({
        ...(operation('plugin/session#fail') as object),
        fence,
      } as never);
      const failedResponse = await failedGuard.fetch(
        'https://provider.example/v1/responses',
        request(),
      );
      await failedResponse.text();
      await expect(failedGuard.finish('failed')).resolves.toBeUndefined();
      expect(outcomes()).toEqual(expect.arrayContaining(['failed']));
      expect(
        metrics
          .snapshot()
          .counters.some(series => series.labels.httpStatus === '500'),
      ).toBe(true);

      // Transport never answered: sent is absent, the attempt is unknown.
      const unknownGuard = createModelOperationGuard({
        journal,
        recheck: async () => true,
        transport: (async () => {
          throw new Error('socket hang up');
        }) as never,
        emit: harness.emit,
      }).bind({
        ...(operation('plugin/session#unknown') as object),
        fence,
      } as never);
      await expect(
        unknownGuard.fetch('https://provider.example/v1/responses', request()),
      ).rejects.toThrow();
      expect(outcomes()).toEqual(expect.arrayContaining(['unknown']));

      // A stream that ended without the caller settling cleanly is
      // stream-failed: the body was read, so it is not unknown.
      const broken = createModelOperationGuard({
        journal,
        recheck: async () => true,
        transport: (async () =>
          new Response('partial', { status: 200 })) as never,
        emit: harness.emit,
      }).bind({
        ...(operation('plugin/session#broken') as object),
        fence: live,
      } as never);
      await (
        await broken.fetch('https://provider.example/v1/responses', request())
      ).text();
      await expect(broken.finish('failed')).resolves.toBeUndefined();
      expect(outcomes()).toEqual(expect.arrayContaining(['stream-failed']));

      // Every dispatch series carries a measured duration, never a placeholder.
      for (const series of metrics
        .snapshot()
        .counters.filter(entry => entry.labels.kind === 'dispatch')) {
        expect(series.totalMs).toBeGreaterThanOrEqual(0);
        expect(series.avgMs).toBeGreaterThanOrEqual(0);
        expect(series.labels).not.toHaveProperty('reason');
      }
    } finally {
      await cleanup();
    }
  }, 20000);

  it('prunes through the seam and stays behavior-identical without a subscriber', async () => {
    const harness = await subscriberHarness();
    const withEvents = await memoryDb();
    const withoutEvents = await memoryDb();
    try {
      const metrics = harness.subscriber;
      const journalFor = (db: Knex, emit?: typeof harness.emit) =>
        createAttemptJournal({
          db,
          authorizer: { authorizeAuditRead: async () => true },
          ...(emit ? { emit } : {}),
        });
      const leaseA = await createKnexNamespaceLease({ db: withEvents.db });
      const leaseB = await createKnexNamespaceLease({ db: withoutEvents.db });
      const fenceA = (await leaseA.acquire(fence.namespace, fence.owner))!;
      const fenceB = (await leaseB.acquire(fence.namespace, fence.owner))!;
      const a = journalFor(withEvents.db, harness.emit);
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
        emit: harness.emit,
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
