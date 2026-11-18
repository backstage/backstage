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
import type { SchedulerService } from '@backstage/backend-plugin-api';
import type { AiEventSink } from '../observability/types';
import { pruneAiJournal, type JournalPruneResult } from './retention';

/**
 * Minimal logger surface the prune schedule needs; `LoggerService`
 * satisfies it.
 *
 * @alpha
 */
export interface AiPruneRunnerLogger {
  info(message: string): void;
  warn(message: string): void;
}

/**
 * Options for {@link scheduleAiJournalPrune}.
 *
 * @alpha
 */
export interface AiJournalPruneScheduleOptions {
  /** The backend scheduler service that owns the recurring task. */
  readonly scheduler: Pick<SchedulerService, 'scheduleTask'>;
  readonly db: Knex;
  /** Journal retention window, applied exactly as the retention contract defines. */
  readonly retentionMs: number;
  /** Time between scheduled passes. One pass also runs immediately on start. */
  readonly frequency: { readonly milliseconds: number };
  /** Warns about failed passes; a failing pass never stops the schedule. */
  readonly logger?: AiPruneRunnerLogger;
  /** Observability sink for prune outcomes; no-op when absent. */
  readonly emit?: AiEventSink;
  /** Wall clock for tests; defaults to a fresh `Date` per pass. */
  readonly now?: () => Date;
  /**
   * Aborting stops the schedule. The in-flight pass, if any, settles on
   * its own — it never rejects — and no further pass starts.
   */
  readonly signal: AbortSignal;
}

/**
 * Schedules the journal retention prune on the backend scheduler service.
 *
 * @remarks
 *
 * This adds scheduling only, no retention semantics: every pass is exactly
 * the journal prune under the given window, which never deletes an
 * unresolved intent without its durable uncertainty record and never deletes
 * an uncertainty record. A failed pass is logged and retried at the next
 * interval — pruning is maintenance, and a failing pass must never block or
 * fail anything else (fail-open). Passes never overlap: the schedule's task
 * and the immediate start pass share one serialization. Aborting the signal
 * stops the schedule; the task run is bounded at 80% of the frequency, the
 * same headroom the catalog's maintenance tasks leave, so a slow pass never
 * collides with the next.
 *
 * @alpha
 */
export async function scheduleAiJournalPrune(
  options: AiJournalPruneScheduleOptions,
): Promise<void> {
  const { db, retentionMs, frequency, emit, signal } = options;
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
  let inFlight: Promise<JournalPruneResult> | undefined;

  const pass = (): Promise<JournalPruneResult> => {
    const run = (inFlight ?? Promise.resolve())
      .catch(() => undefined)
      .then(async () => {
        if (signal.aborted) {
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

  // One pass at start so a restarted host prunes promptly; the recurring
  // schedule then owns the cadence. Both share the serialization above.
  void pass();
  await options.scheduler.scheduleTask({
    id: 'ai_journal_prune',
    frequency: { milliseconds: frequency.milliseconds },
    timeout: { milliseconds: frequency.milliseconds * 0.8 },
    fn: async () => {
      await pass();
    },
    signal,
  });
}
