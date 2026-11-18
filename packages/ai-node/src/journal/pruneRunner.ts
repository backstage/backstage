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

import type { Knex } from 'knex';
import type { AiEventSink } from '../observability/types';
import { pruneAiJournal, type JournalPruneResult } from './retention';

/**
 * Minimal logger surface the runner needs; `LoggerService` satisfies it.
 *
 * @alpha
 */
export interface AiPruneRunnerLogger {
  info(message: string): void;
  warn(message: string): void;
}

/**
 * Options for {@link startAiJournalPruneRunner}.
 *
 * @alpha
 */
export interface AiJournalPruneRunnerOptions {
  readonly db: Knex;
  /** Journal retention window, applied exactly as the retention contract defines. */
  readonly retentionMs: number;
  /** Time between passes. One pass also runs immediately on start. */
  readonly intervalMs: number;
  /** Warns about failed passes; a failing pass never stops the runner. */
  readonly logger?: AiPruneRunnerLogger;
  /** Observability sink for prune outcomes; no-op when absent. */
  readonly emit?: AiEventSink;
  /** Wall clock for tests; defaults to a fresh `Date` per pass. */
  readonly now?: () => Date;
}

/**
 * A running journal prune schedule.
 *
 * @alpha
 */
export interface AiJournalPruneRunner {
  /**
   * Runs one pass now and resolves with its result; never overlaps a
   * scheduled pass. A pass skipped because the runner was stopped, or
   * failed and warned, resolves with zeros that carry no information:
   * `prunedEvents: 0` and `uncertaintyRecords: 0` mean "not measured",
   * never "the journal holds none".
   */
  pruneNow(): Promise<JournalPruneResult>;
  /** Stops the schedule and resolves once the in-flight pass (if any) settled. */
  stop(): Promise<void>;
}

/**
 * Schedules the journal retention prune on a host-started interval.
 *
 * @remarks
 *
 * This adds scheduling only, no retention semantics: every pass is exactly
 * the journal prune under the given window, which never deletes an
 * unresolved intent without its durable uncertainty record and never deletes
 * an uncertainty record. A failed pass is logged and retried at the next
 * interval — pruning is maintenance, and a failing pass must never block or
 * fail anything else (fail-open). Passes never overlap; `pruneNow()` joins
 * the same serialization. `stop()` clears the timer and awaits the in-flight
 * pass, so shutdown loses no pruning work but also waits for none that has
 * not started.
 *
 * @alpha
 */
export function startAiJournalPruneRunner(
  options: AiJournalPruneRunnerOptions,
): AiJournalPruneRunner {
  const { db, retentionMs, intervalMs, emit } = options;
  const logger = options.logger;
  const now = options.now ?? (() => new Date());
  // A throwing logger is a broken observation channel, not a broken
  // prune: every logger call is isolated so maintenance stays fail-open
  // regardless of logger behavior, and a rejected `void pass()` can never
  // surface as an unhandled rejection. A logger whose warn is async
  // structurally satisfies the sync callback type, so a returned thenable
  // gets a rejection handler attached (without awaiting), the same way
  // the observability sink consumes its publish results.
  const warn = (message: string) => {
    try {
      const result: unknown = logger?.warn(message);
      if (
        result !== null &&
        (typeof result === 'object' || typeof result === 'function') &&
        typeof (result as PromiseLike<void>).then === 'function'
      ) {
        void Promise.resolve(result).catch(() => undefined);
      }
    } catch {
      /* The pass failure it reports stands on its own. */
    }
  };
  let timer: NodeJS.Timeout | undefined;
  let stopped = false;
  let inFlight: Promise<JournalPruneResult> | undefined;

  const pass = (): Promise<JournalPruneResult> => {
    const run = (inFlight ?? Promise.resolve())
      .catch(() => undefined)
      .then(async () => {
        if (stopped) {
          return { prunedEvents: 0, uncertaintyRecords: 0 };
        }
        return pruneAiJournal(db, {
          retentionMs,
          emit,
          now: now(),
        });
      })
      .catch(error => {
        warn(
          `AI journal prune pass failed; retrying at the next interval: ${error}`,
        );
        return { prunedEvents: 0, uncertaintyRecords: 0 };
      })
      .finally(() => {
        if (inFlight === run) inFlight = undefined;
      });
    inFlight = run;
    return run;
  };

  // One pass at start so a restarted host prunes promptly, then the
  // interval. Unref'd: the schedule must not hold the process open; a host
  // that wants it alive keeps its own process alive.
  void pass();
  timer = setInterval(() => {
    if (!stopped) void pass();
  }, intervalMs);
  timer.unref?.();

  return {
    pruneNow: () => pass(),
    stop: async () => {
      stopped = true;
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
      await inFlight?.catch(() => undefined);
    },
  };
}
