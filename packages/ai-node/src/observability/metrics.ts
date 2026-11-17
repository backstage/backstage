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

/** A counter series: one label combination and its count. */
export type MetricSeries = Readonly<{
  labels: Readonly<Record<string, string>>;
  count: number;
  /** Total observed duration for series that carry durations. */
  totalMs?: number;
}>;

/**
 * The health view of the metrics subscriber.
 *
 * @internal
 */
export type AiHealthSnapshot = Readonly<{
  /** Counters keyed by `kind` and the labels that describe them. */
  counters: readonly MetricSeries[];
  /** Sum of observed durations, by event kind. */
  durations: Readonly<Record<string, number>>;
  /** Leases this process currently believes it holds. */
  activeLeases: number;
  /** Denials and failed dispatches since start. */
  failures: number;
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
 * @internal
 */
export interface AiMetricsSubscriber extends AiEventEmitter {
  snapshot(): AiHealthSnapshot;
  reset(): void;
}

function seriesKey(kind: string, labels: Record<string, string>): string {
  const entries = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b));
  return [kind, ...entries.map(([key, value]) => `${key}=${value}`)].join('|');
}

/**
 * Creates the metrics/health subscriber.
 *
 * @internal
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
  let activeLeases = 0;
  let failures = 0;
  let events = 0;

  const count = (
    kind: string,
    labels: Record<string, string>,
    durationMs?: number,
  ) => {
    const key = seriesKey(kind, labels);
    const existing = series.get(key);
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
          if (event.action === 'acquire') activeLeases += 1;
          if (event.action === 'release' || event.action === 'lost') {
            activeLeases = Math.max(0, activeLeases - 1);
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
          if (event.decision === 'deny') failures += 1;
          durations.journal = (durations.journal ?? 0) + event.durationMs;
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
            labels: {
              kind: entry.kind,
              ...entry.labels,
              ...(entry.timed
                ? {
                    avgMs: String(
                      Math.round((entry.totalMs / entry.count) * 100) / 100,
                    ),
                  }
                : {}),
            },
            count: entry.count,
            ...(entry.timed ? { totalMs: entry.totalMs } : {}),
          }))
          .sort((a, b) =>
            JSON.stringify(a.labels) < JSON.stringify(b.labels) ? -1 : 1,
          ),
        durations: { ...durations },
        activeLeases,
        failures,
        events,
      };
    },
    reset() {
      series.clear();
      for (const key of Object.keys(durations)) {
        delete durations[key];
      }
      activeLeases = 0;
      failures = 0;
      events = 0;
    },
  };
}
