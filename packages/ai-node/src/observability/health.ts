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

import type { AiHealthSnapshot, MetricSeries } from './metrics';

/**
 * One derived health signal: a named measurement against a threshold.
 *
 * @alpha
 */
export type AiHealthSignal = Readonly<{
  /** Which measurement this is. */
  readonly name:
    | 'denialRate'
    | 'leaseContention'
    | 'dispatchLatencyMs'
    | 'journalGrowth';
  /** `degraded` when the value crossed the threshold, else `ok`. */
  readonly status: 'ok' | 'degraded';
  /** The measured value. */
  readonly value: number;
  /** The threshold the value was compared against. */
  readonly threshold: number;
  /** Plain-language finding, e.g. for a health endpoint body. */
  readonly detail: string;
}>;

/**
 * A health report derived from a metrics snapshot.
 *
 * @alpha
 */
export type AiHealthReport = Readonly<{
  /** `degraded` when any signal is degraded. */
  readonly status: 'ok' | 'degraded';
  readonly signals: readonly AiHealthSignal[];
  /** The snapshot the report was derived from. */
  readonly snapshot: AiHealthSnapshot;
}>;

/**
 * Thresholds for {@link evaluateAiHealth}. Every field is optional; the
 * defaults are conservative starting points for a host to tune, not
 * judgments about what a healthy installation looks like.
 *
 * @alpha
 */
export type AiHealthThresholds = Readonly<{
  /**
   * Share of journaled decisions that denied, `0 <= rate < 1`. A high rate
   * usually means misconfiguration (missing credentials, unlisted models,
   * stale permissions), not provider trouble. Default 0.5.
   */
  readonly denialRate?: number;
  /**
   * Lease contention events observed since the last reset. Contention means
   * replicas or overlapping opens are fighting over sessions. Default 25.
   */
  readonly leaseContention?: number;
  /**
   * Mean dispatch duration in milliseconds across sent operations. Default
   * 30000, roughly the ceiling of a healthy streaming dispatch.
   */
  readonly dispatchLatencyMs?: number;
  /**
   * Journal decisions observed since the last reset: the subscriber's view
   * of journal write volume. Growth itself is not a fault; the signal exists
   * so a host can notice runaway volume. Default 1000000.
   */
  readonly journalGrowth?: number;
}>;

const DEFAULT_DENIAL_RATE = 0.5;
const DEFAULT_LEASE_CONTENTION = 25;
const DEFAULT_DISPATCH_LATENCY_MS = 30_000;
const DEFAULT_JOURNAL_GROWTH = 1_000_000;

function seriesCount(
  series: readonly MetricSeries[],
  label: string,
  value: string,
): number {
  // Series are keyed by event kind and labels, but the public series type
  // carries only the labels; `action: 'contention'` is a lease-only label
  // value, so it identifies the contention series without the kind.
  let total = 0;
  for (const entry of series) {
    if (entry.labels[label] === value) {
      total += entry.count;
    }
  }
  return total;
}

/**
 * Derives health signals from a metrics snapshot.
 *
 * @remarks
 *
 * Fail-open by construction: this is a pure function over a snapshot the
 * subscriber already holds, it never runs on the dispatch path, and
 * evaluating health can never gate or fail a dispatch. A host surfaces the
 * report wherever it wants (a health endpoint, an alert); the worst a
 * degraded report does is inform. Values are measured since the
 * subscriber's last reset — hosts wanting windowed health reset the
 * subscriber on their own cadence.
 *
 * @alpha
 */
export function evaluateAiHealth(
  snapshot: AiHealthSnapshot,
  thresholds: AiHealthThresholds = {},
): AiHealthReport {
  const denialThreshold = thresholds.denialRate ?? DEFAULT_DENIAL_RATE;
  const contentionThreshold =
    thresholds.leaseContention ?? DEFAULT_LEASE_CONTENTION;
  const latencyThreshold =
    thresholds.dispatchLatencyMs ?? DEFAULT_DISPATCH_LATENCY_MS;
  const growthThreshold = thresholds.journalGrowth ?? DEFAULT_JOURNAL_GROWTH;

  const decisions =
    snapshot.journalDecisions.allow + snapshot.journalDecisions.deny;
  const denialRate =
    decisions === 0 ? 0 : snapshot.journalDecisions.deny / decisions;

  const terminalDispatches = snapshot.terminalDispatches;
  const dispatchLatencyMs =
    terminalDispatches === 0
      ? 0
      : (snapshot.durations.dispatchTerminal ?? 0) / terminalDispatches;

  const contention = seriesCount(snapshot.counters, 'action', 'contention');

  const signal = (
    name: AiHealthSignal['name'],
    value: number,
    threshold: number,
    detail: string,
  ): AiHealthSignal => ({
    name,
    value,
    threshold,
    status: value > threshold ? 'degraded' : 'ok',
    detail,
  });

  const signals: readonly AiHealthSignal[] = [
    signal(
      'denialRate',
      denialRate,
      denialThreshold,
      `${snapshot.journalDecisions.deny} of ${decisions} journaled decisions denied`,
    ),
    signal(
      'leaseContention',
      contention,
      contentionThreshold,
      `${contention} lease contention events since the last reset`,
    ),
    signal(
      'dispatchLatencyMs',
      dispatchLatencyMs,
      latencyThreshold,
      `mean terminal dispatch latency ${Math.round(
        dispatchLatencyMs,
      )} ms across ${terminalDispatches} settled attempts`,
    ),
    signal(
      'journalGrowth',
      decisions,
      growthThreshold,
      `${decisions} journal decisions observed since the last reset`,
    ),
  ];

  return {
    status: signals.some(entry => entry.status === 'degraded')
      ? 'degraded'
      : 'ok',
    signals,
    snapshot,
  };
}
