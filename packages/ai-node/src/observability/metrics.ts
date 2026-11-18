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

import type { AiEventEmitter, AiObservabilityEvent } from './types';

/**
 * A counter series: one label combination and its count.
 *
 * @alpha
 */
export type MetricSeries = Readonly<{
  labels: Readonly<Record<string, string>>;
  count: number;
  /** Total observed duration for series that carry durations. */
  totalMs?: number;
  /** Mean observed duration; a value, never a label. */
  avgMs?: number;
}>;

/**
 * The health view of the metrics subscriber.
 *
 * @alpha
 */
export type AiHealthSnapshot = Readonly<{
  /** Counters keyed by `kind` and the labels that describe them. */
  counters: readonly MetricSeries[];
  /** Sum of observed durations, by event kind. */
  durations: Readonly<Record<string, number>>;
  /** Leases this process currently believes it holds, by namespace. */
  activeLeases: number;
  /**
   * Terminal dispatch observations since the last reset: one per logical
   * attempt that settled (completed, failed, cancelled, unknown, or
   * stream-failed). The mean terminal duration for the latency signal is
   * `durations.dispatchTerminal / terminalDispatches`.
   */
  terminalDispatches: number;
  /**
   * Logical failures since start: one per denied request and one per dispatch
   * that did not complete. A denial is counted once, from the operation's own
   * event, not again from the journal row that records it.
   */
  failures: number;
  /** Journal decisions, reported separately so they never inflate failures. */
  journalDecisions: Readonly<{ allow: number; deny: number }>;
  /** Total events observed. */
  events: number;
}>;

/**
 * The one subscriber this deliverable ships: an in-process metrics and health
 * implementation.
 *
 * @remarks
 *
 * It is a subscriber, not instrumentation: modules emit through
 * {@link AiEventEmitter} and this object only aggregates. It never labels a
 * series with a reason string (unbounded cardinality) and never stores payloads,
 * so a leaked secret is unrepresentable here.
 *
 * @alpha
 */
export interface AiMetricsSubscriber extends AiEventEmitter {
  snapshot(): AiHealthSnapshot;
  reset(): void;
}

/**
 * Hard ceiling on distinct series. Labels are already restricted by the
 * validator, but a long-lived process can still see many provider/model
 * combinations across config changes; beyond this, new combinations collapse
 * into one overflow bucket so memory stays bounded.
 */
const MAX_SERIES = 256;

function seriesKey(kind: string, labels: Record<string, string>): string {
  const entries = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b));
  return [kind, ...entries.map(([key, value]) => `${key}=${value}`)].join('|');
}

/**
 * Creates the metrics/health subscriber.
 *
 * @alpha
 */
export function createMetricsSubscriber(): AiMetricsSubscriber {
  const series = new Map<
    string,
    {
      kind: string;
      labels: Record<string, string>;
      count: number;
      totalMs: number;
      timed: boolean;
    }
  >();
  const durations: Record<string, number> = {};
  // identity -> the generation currently holding it. A stale holder's
  // release/lost carries an older generation and cannot evict a newer hold.
  const heldLeases = new Map<string, string | undefined>();
  let failures = 0;
  let events = 0;
  let terminalDispatches = 0;
  const journalDecisions = { allow: 0, deny: 0 };

  /** Lease identity: the gauge counts holds, not acquire events. */
  const leaseId = (event: { pluginId: string; sessionId: string }) =>
    `${event.pluginId}\u0000${event.sessionId}`;

  const count = (
    kind: string,
    labels: Record<string, string>,
    durationMs?: number,
  ) => {
    const key = seriesKey(kind, labels);
    let existing = series.get(key);
    if (existing === undefined && series.size >= MAX_SERIES) {
      const overflowKey = seriesKey('overflow', { source: kind });
      existing = series.get(overflowKey);
      if (existing === undefined) {
        series.set(overflowKey, {
          kind: 'overflow',
          labels: { source: kind },
          count: 1,
          totalMs: durationMs ?? 0,
          timed: durationMs !== undefined,
        });
        return;
      }
    }
    if (existing === undefined) {
      series.set(key, {
        kind,
        labels,
        count: 1,
        totalMs: durationMs ?? 0,
        timed: durationMs !== undefined,
      });
      return;
    }
    existing.count += 1;
    if (durationMs !== undefined) {
      existing.totalMs += durationMs;
      existing.timed = true;
    }
  };

  return {
    emit(input: AiObservabilityEvent) {
      const event = input;
      events += 1;
      switch (event.kind) {
        case 'denial':
          failures += 1;
          count('denial', {
            operation: event.operation,
            ...(event.provider ? { provider: event.provider } : {}),
          });
          break;
        case 'dispatch':
          if (event.outcome !== 'sent' && event.outcome !== 'completed') {
            failures += 1;
          }
          if (event.durationMs !== undefined) {
            durations.dispatch = (durations.dispatch ?? 0) + event.durationMs;
          }
          // One latency observation per logical attempt, terminal only:
          // the terminal duration measures sentAt-or-startedAt to
          // settlement, while `sent` measures start to first response and
          // is a throughput observation, not a latency one. Both event
          // kinds keep their cumulative sum in durations.dispatch.
          if (event.outcome !== 'sent' && event.durationMs !== undefined) {
            terminalDispatches += 1;
            durations.dispatchTerminal =
              (durations.dispatchTerminal ?? 0) + event.durationMs;
          }
          count(
            'dispatch',
            {
              operation: event.operation,
              outcome: event.outcome,
              ...(event.httpStatus !== undefined
                ? { httpStatus: String(event.httpStatus) }
                : {}),
            },
            event.durationMs,
          );
          break;
        case 'lease':
          if (event.action === 'acquire') {
            heldLeases.set(leaseId(event), event.generation);
          }
          if (event.action === 'renew' && !heldLeases.has(leaseId(event))) {
            heldLeases.set(leaseId(event), event.generation);
          }
          if (event.action === 'release' || event.action === 'lost') {
            const id = leaseId(event);
            const held = heldLeases.get(id);
            // Only the generation that holds the identity may end it.
            if (event.generation === undefined || held === event.generation) {
              heldLeases.delete(id);
            }
          }
          if (event.durationMs !== undefined) {
            durations.lease = (durations.lease ?? 0) + event.durationMs;
          }
          count(
            'lease',
            {
              action: event.action,
              ...(event.pluginId ? { pluginId: event.pluginId } : {}),
            },
            event.durationMs,
          );
          break;
        case 'journal':
          if (event.decision === 'deny') journalDecisions.deny += 1;
          if (event.decision === 'allow') journalDecisions.allow += 1;
          if (event.durationMs !== undefined) {
            durations.journal = (durations.journal ?? 0) + event.durationMs;
          }
          count(
            'journal',
            {
              action: event.action,
              ...(event.decision ? { decision: event.decision } : {}),
            },
            event.durationMs,
          );
          break;
        default:
          break;
      }
    },
    snapshot(): AiHealthSnapshot {
      return {
        counters: [...series.values()]
          .map(entry => ({
            labels: { kind: entry.kind, ...entry.labels },
            count: entry.count,
            ...(entry.timed
              ? {
                  totalMs: entry.totalMs,
                  avgMs: Math.round((entry.totalMs / entry.count) * 100) / 100,
                }
              : {}),
          }))
          .sort((a, b) =>
            JSON.stringify(a.labels) < JSON.stringify(b.labels) ? -1 : 1,
          ),
        durations: { ...durations },
        activeLeases: heldLeases.size,
        terminalDispatches,
        failures,
        journalDecisions: { ...journalDecisions },
        events,
      };
    },
    reset() {
      series.clear();
      for (const key of Object.keys(durations)) {
        delete durations[key];
      }
      heldLeases.clear();
      journalDecisions.allow = 0;
      journalDecisions.deny = 0;
      terminalDispatches = 0;
      failures = 0;
      events = 0;
    },
  };
}
