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
import { bigintText, dbNow } from '../storage/dialect-kit';
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
 * Settled attempts (a denial, or a send intent with a settled outcome) and
 * non-evidentiary recovery events older than the retention window are pruned.
 * Uncertain evidence is never deleted: a send intent with no outcome, or with
 * an explicitly recorded `unknown` outcome, and `unknown-dispatch` recovery
 * events are retained and documented once in a durable uncertainty record.
 * Uncertainty records themselves are never deleted.
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
  const sqlite = db.client.config.client === 'better-sqlite3';

  return db.transaction(async trx => {
    // A settling outcome is one that establishes the remote result. An
    // explicitly recorded `unknown` outcome does not settle anything: it is
    // durable uncertainty, treated exactly like a missing outcome.
    const settlingOutcomes = trx(JOURNAL_EVENTS_TABLE)
      .where({ kind: 'outcome' })
      .whereNot('status', 'unknown')
      .select('attempt_id');

    const olderThanCutoff = (column: string) =>
      sqlite
        ? trx.raw('julianday(??) < julianday(?)', [
            column,
            cutoff.toISOString(),
          ])
        : trx.raw('?? < ?', [column, cutoff]);

    // Uncertain send intents past the window: no outcome, or only an unknown
    // outcome. Never deleted; documented once.
    const uncertain: Array<{ id: string }> = await trx(JOURNAL_EVENTS_TABLE)
      .where({ kind: 'decision', decision: 'allow' })
      .whereRaw(olderThanCutoff('created_at'))
      .whereNotIn('id', settlingOutcomes)
      .select(bigintText(trx, 'id'));

    let uncertainty = 0;
    for (const row of uncertain) {
      const existing = await trx(JOURNAL_UNCERTAINTY_TABLE)
        .where({ attempt_id: row.id })
        .first('attempt_id');
      if (existing) continue;
      await trx(JOURNAL_UNCERTAINTY_TABLE).insert({
        attempt_id: row.id,
        note: 'Send intent has no settled outcome past the retention window; the remote outcome is permanently unknown',
        recorded_at: dbNow(trx),
      });
      uncertainty += 1;
    }

    // Prune only settled attempts: denials, and allows with a settled
    // outcome. An attempt is settled as a whole, so its outcome row goes
    // with it. Explicit unknown outcomes and their intents are retained.
    const settled: Array<{ id: string }> = await trx(JOURNAL_EVENTS_TABLE)
      .where({ kind: 'decision' })
      .whereRaw(olderThanCutoff('created_at'))
      .where(builder =>
        builder.where('decision', 'deny').orWhereIn('id', settlingOutcomes),
      )
      .select(bigintText(trx, 'id'));

    let pruned = 0;
    if (settled.length > 0) {
      const ids = settled.map(row => row.id);
      pruned += await trx(JOURNAL_EVENTS_TABLE)
        .where({ kind: 'outcome' })
        .whereIn('attempt_id', ids)
        .del();
      pruned += await trx(JOURNAL_EVENTS_TABLE).whereIn('id', ids).del();
    }

    // Recovery events are prunable by age, except unknown-dispatch events,
    // which are the durable evidence that an attempt's remote outcome can
    // never be established.
    pruned += await trx(JOURNAL_EVENTS_TABLE)
      .where({ kind: 'recovery' })
      .whereRaw(olderThanCutoff('created_at'))
      .whereNot('recovery_kind', 'unknown-dispatch')
      .del();

    return { prunedEvents: pruned, uncertaintyRecords: uncertainty };
  });
}
