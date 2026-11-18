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

import { createMetricsSubscriber, type AiHealthSnapshot } from './metrics';
import { evaluateAiHealth } from './health';
import type { AiObservabilityEvent } from './types';

function snapshotOf(events: readonly AiObservabilityEvent[]): AiHealthSnapshot {
  const subscriber = createMetricsSubscriber();
  for (const event of events) {
    subscriber.emit(event);
  }
  return subscriber.snapshot();
}

describe('evaluateAiHealth', () => {
  it('reports ok with detailed signals on an empty snapshot', () => {
    const report = evaluateAiHealth(snapshotOf([]));
    expect(report.status).toBe('ok');
    expect(report.signals.map(signal => signal.name)).toEqual([
      'denialRate',
      'leaseContention',
      'dispatchLatencyMs',
      'journalGrowth',
    ]);
    // No decisions means no denial rate to speak of, and every value
    // sits at its floor.
    for (const signal of report.signals) {
      expect(signal.status).toBe('ok');
      expect(signal.value).toBe(0);
    }
  });

  it('derives each signal from the observed events', () => {
    const report = evaluateAiHealth(
      snapshotOf([
        {
          kind: 'journal',
          at: 1,
          action: 'decision',
          decision: 'allow',
          durationMs: 2,
        },
        {
          kind: 'journal',
          at: 2,
          action: 'decision',
          decision: 'deny',
          durationMs: 2,
        },
        {
          kind: 'journal',
          at: 3,
          action: 'decision',
          decision: 'allow',
          durationMs: 2,
        },
        {
          kind: 'dispatch',
          at: 4,
          operation: 'models.stream',
          outcome: 'sent',
          durationMs: 100,
        },
        {
          kind: 'dispatch',
          at: 5,
          operation: 'models.stream',
          outcome: 'completed',
          durationMs: 300,
        },
        {
          kind: 'lease',
          at: 6,
          pluginId: 'p',
          sessionId: 's',
          action: 'contention',
        },
      ]),
    );
    expect(report.status).toBe('ok');
    const byName = Object.fromEntries(
      report.signals.map(signal => [signal.name, signal]),
    );
    // 1 of 3 decisions denied.
    expect(byName.denialRate.value).toBeCloseTo(1 / 3);
    expect(byName.denialRate.detail).toContain('1 of 3');
    // Latency is terminal-only: the sent event (100 ms) is throughput,
    // the completed event (300 ms) is the attempt's terminal duration,
    // so one observation of 300 ms.
    expect(byName.dispatchLatencyMs.value).toBe(300);
    expect(byName.dispatchLatencyMs.detail).toContain('1 settled attempts');
    expect(byName.leaseContention.value).toBe(1);
    expect(byName.journalGrowth.value).toBe(3);
  });

  it('marks a signal degraded when it crosses its threshold and degrades the report', () => {
    const report = evaluateAiHealth(
      snapshotOf([
        {
          kind: 'journal',
          at: 1,
          action: 'decision',
          decision: 'deny',
          durationMs: 1,
        },
        {
          kind: 'journal',
          at: 2,
          action: 'decision',
          decision: 'deny',
          durationMs: 1,
        },
        {
          kind: 'dispatch',
          at: 3,
          operation: 'models.stream',
          outcome: 'sent',
          durationMs: 10,
        },
      ]),
      { denialRate: 0.5 },
    );
    expect(report.status).toBe('degraded');
    const denial = report.signals.find(signal => signal.name === 'denialRate');
    expect(denial?.status).toBe('degraded');
    expect(denial?.value).toBe(1);
    // Only the crossed signal is degraded.
    expect(
      report.signals.filter(signal => signal.status === 'degraded').length,
    ).toBe(1);
  });

  it('degrades on latency, contention, and growth at their thresholds', () => {
    const base: AiObservabilityEvent[] = [
      {
        kind: 'dispatch',
        at: 1,
        operation: 'models.stream',
        outcome: 'completed',
        durationMs: 60_000,
      },
      {
        kind: 'lease',
        at: 2,
        pluginId: 'p',
        sessionId: 's',
        action: 'contention',
      },
    ];
    const latency = evaluateAiHealth(snapshotOf(base));
    expect(
      latency.signals.find(s => s.name === 'dispatchLatencyMs')?.status,
    ).toBe('degraded');
    expect(
      latency.signals.find(s => s.name === 'leaseContention')?.status,
    ).toBe('ok');

    const growthEvents: AiObservabilityEvent[] = [];
    for (let i = 0; i < 26; i += 1) {
      growthEvents.push({
        kind: 'journal',
        at: i,
        action: 'decision',
        decision: 'allow',
        durationMs: 1,
      });
    }
    const growth = evaluateAiHealth(snapshotOf([...base, ...growthEvents]), {
      journalGrowth: 25,
      leaseContention: 0,
    });
    expect(growth.signals.find(s => s.name === 'journalGrowth')?.status).toBe(
      'degraded',
    );
    expect(growth.signals.find(s => s.name === 'leaseContention')?.status).toBe(
      'degraded',
    );
  });

  it('honors host thresholds over the defaults', () => {
    const report = evaluateAiHealth(snapshotOf([]), {
      denialRate: 0,
      leaseContention: 0,
      dispatchLatencyMs: 0,
      journalGrowth: 0,
    });
    // Zero floors: the empty snapshot's zero values sit AT the threshold,
    // not above it, so the report stays ok — thresholds are exclusive.
    expect(report.status).toBe('ok');
    const strict = evaluateAiHealth(
      snapshotOf([
        {
          kind: 'lease',
          at: 1,
          pluginId: 'p',
          sessionId: 's',
          action: 'contention',
        },
      ]),
      { leaseContention: 0 },
    );
    expect(strict.status).toBe('degraded');
  });

  it('dispatch latency is one terminal observation per attempt, not sent-plus-terminal', () => {
    // The reviewer's exact shape: a dispatch sent after 100 ms, then the
    // same attempt settling with a terminal duration of 1000 ms measured
    // from the sent timestamp. The sent timing is throughput; the latency
    // signal must report the terminal observation alone — not 550 (the
    // old mean over both events) and not 1100 (their sum).
    const report = evaluateAiHealth(
      snapshotOf([
        {
          kind: 'dispatch',
          at: 1,
          operation: 'models.stream',
          outcome: 'sent',
          durationMs: 100,
        },
        {
          kind: 'dispatch',
          at: 2,
          operation: 'models.stream',
          outcome: 'completed',
          durationMs: 1000,
        },
      ]),
      { dispatchLatencyMs: 800 },
    );
    const latency = report.signals.find(
      signal => signal.name === 'dispatchLatencyMs',
    );
    expect(latency?.value).toBe(1000);
    expect(latency?.status).toBe('degraded');
    expect(latency?.detail).toContain('1 settled attempts');
    // The old math reported 550 across 2 dispatches and stayed ok at an
    // 800 ms threshold; the corrected signal degrades.
    expect(report.status).toBe('degraded');
  });

  it('reset clears the terminal-dispatch count with the durations: a second window stands alone', () => {
    // The reviewer's shape: a first window with many settled attempts,
    // a reset, then a fresh window with one slow attempt. The second
    // window's mean must come from the second window's observations
    // alone — a stale count from the first window would divide the fresh
    // terminal duration down and suppress the alert.
    const subscriber = createMetricsSubscriber();
    for (let i = 0; i < 401; i += 1) {
      subscriber.emit({
        kind: 'dispatch',
        at: i,
        operation: 'models.stream',
        outcome: 'completed',
        durationMs: 10,
      });
    }
    subscriber.reset();
    const first = evaluateAiHealth(subscriber.snapshot(), {
      dispatchLatencyMs: 800,
    });
    expect(
      first.signals.find(s => s.name === 'dispatchLatencyMs')?.status,
    ).toBe('ok');

    subscriber.emit({
      kind: 'dispatch',
      at: 1000,
      operation: 'models.stream',
      outcome: 'sent',
      durationMs: 5,
    });
    subscriber.emit({
      kind: 'dispatch',
      at: 1001,
      operation: 'models.stream',
      outcome: 'completed',
      durationMs: 1000,
    });
    const second = evaluateAiHealth(subscriber.snapshot(), {
      dispatchLatencyMs: 800,
    });
    const latency = second.signals.find(
      signal => signal.name === 'dispatchLatencyMs',
    );
    // One settled attempt of 1000 ms in the second window: exactly 1000,
    // not 1000/402 from a stale count.
    expect(latency?.value).toBe(1000);
    expect(latency?.status).toBe('degraded');
    expect(latency?.detail).toContain('1 settled attempts');
  });

  it('a journal event without durationMs does not poison the durations', () => {
    // A journal event lacking durationMs (the type allows it at runtime)
    // must leave durations.journal unset, not NaN: a NaN would serialize
    // as null in the snapshot and skew every derived latency signal.
    const subscriber = createMetricsSubscriber();
    subscriber.emit({
      kind: 'journal',
      at: 1,
      action: 'decision',
      decision: 'allow',
    } as Partial<AiObservabilityEvent> as AiObservabilityEvent);
    subscriber.emit({
      kind: 'journal',
      at: 2,
      action: 'decision',
      decision: 'deny',
      durationMs: 5,
    });
    const snapshot = subscriber.snapshot();
    expect(snapshot.durations.journal).toBe(5);
    expect(JSON.stringify(snapshot)).not.toContain('null');
    expect(JSON.stringify(snapshot)).not.toContain('NaN');
  });

  it('is fail-open: a pure function that never throws on any snapshot', () => {
    // Weird but shape-valid snapshots (overflow series, missing durations)
    // evaluate without throwing; evaluation can never gate dispatch.
    const snapshot: AiHealthSnapshot = {
      counters: [{ labels: { source: 'lease' }, count: 5 }],
      durations: {},
      activeLeases: 3,
      terminalDispatches: 0,
      failures: 1,
      journalDecisions: { allow: 0, deny: 0 },
      events: 6,
    };
    expect(() => evaluateAiHealth(snapshot)).not.toThrow();
    expect(evaluateAiHealth(snapshot).status).toBe('ok');
  });
});
