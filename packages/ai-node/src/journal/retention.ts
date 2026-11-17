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
import { JOURNAL_EVENTS_TABLE } from './knex';

/** Table holding durable uncertainty records for unresolved intents. */
export const JOURNAL_UNCERTAINTY_TABLE = 'ai_journal_uncertainty';

/**
 * Options for {@link pruneAiJournal}.
 *
 * @alpha
 */
export interface JournalRetentionOptions {
  /** How long journal events are retained, in milliseconds. */
  readonly retentionMs: number;
  /** Wall clock used to compute the cutoff; defaults to `new Date()`. */
  readonly now?: Date;
}

/**
 * Result of one retention pass.
 *
 * @alpha
 */
export interface JournalPruneResult {
  readonly prunedEvents: number;
  readonly uncertaintyRecords: number;
}

/**
 * Applies the configurable retention policy to the journal.
 *
 * @remarks
 *
 * Resolved attempts (an intent with an outcome, or a denial) and recovery
 * events older than the retention window are pruned. Unresolved send intents
 * are never deleted: once one is older than the window, a durable uncertainty
 * record is written once, documenting that the attempt's remote outcome can
 * never be established, and the intent itself is retained. Uncertainty
 * records are never deleted.
 *
 * This is a maintenance operation, not a fenced append: it runs from host
 * scheduling and deletes only events whose attempt is settled or whose
 * uncertainty is durably documented.
 *
 * @alpha
 */
export async function pruneAiJournal(
  db: Knex,
  options: JournalRetentionOptions,
): Promise<JournalPruneResult> {
  const now = options.now ?? new Date();
  if (!Number.isSafeInteger(options.retentionMs) || options.retentionMs <= 0) {
    throw new Error('Invalid retentionMs: expected a positive integer');
  }
  const cutoff = new Date(now.getTime() - options.retentionMs);

  return db.transaction(async trx => {
    // An allow-decision is unresolved when no outcome row references it.
    const unresolved: Array<{ id: string | number }> = await trx(
      JOURNAL_EVENTS_TABLE,
    )
      .where({ kind: 'decision', decision: 'allow' })
      .where('created_at', '<', cutoff)
      .whereNotIn(
        'id',
        trx(JOURNAL_EVENTS_TABLE)
          .where({ kind: 'outcome' })
          .select('attempt_id'),
      )
      .select('id');
    let uncertainty = 0;
    for (const row of unresolved) {
      const attemptId = String(row.id);
      const existing = await trx(JOURNAL_UNCERTAINTY_TABLE)
        .where({ attempt_id: attemptId })
        .first('attempt_id');
      if (existing) continue;
      await trx(JOURNAL_UNCERTAINTY_TABLE).insert({
        attempt_id: attemptId,
        note: 'Send intent has no recorded outcome past the retention window; the remote outcome is permanently unknown',
        recorded_at: trx.fn.now(),
      });
      uncertainty += 1;
    }

    // Prune only settled attempts: denials, and allows with an outcome. An
    // attempt is settled as a whole, so the outcome row goes with it.
    const settled: Array<{ id: string | number }> = await trx(
      JOURNAL_EVENTS_TABLE,
    )
      .where({ kind: 'decision' })
      .where('created_at', '<', cutoff)
      .where(builder =>
        builder
          .where('decision', 'deny')
          .orWhereIn(
            'id',
            trx(JOURNAL_EVENTS_TABLE)
              .where({ kind: 'outcome' })
              .select('attempt_id'),
          ),
      )
      .select('id');
    let pruned = 0;
    if (settled.length > 0) {
      const ids = settled.map(row => String(row.id));
      pruned += await trx(JOURNAL_EVENTS_TABLE)
        .where({ kind: 'outcome' })
        .whereIn('attempt_id', ids)
        .del();
      pruned += await trx(JOURNAL_EVENTS_TABLE).whereIn('id', ids).del();
    }
    pruned += await trx(JOURNAL_EVENTS_TABLE)
      .where({ kind: 'recovery' })
      .where('created_at', '<', cutoff)
      .del();

    return { prunedEvents: pruned, uncertaintyRecords: uncertainty };
  });
}
