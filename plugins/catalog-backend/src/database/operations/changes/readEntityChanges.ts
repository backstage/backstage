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

import { FilterPredicate } from '@backstage/filter-predicates';
import { Knex } from 'knex';
import { applyEntityFilterToQuery } from '../../../service/request/applyEntityFilterToQuery';
import { DbFinalEntitiesRow } from '../../tables';
import {
  applyEntityChangeScope,
  EntityChangeScopeEntry,
  isExactEntityChangeScope,
} from './scope';

export type EntityChangeRow = {
  entityRef: string;
  /** True if the row is a tombstone. */
  deleted: boolean;
};

export type ReadEntityChangesResult = {
  rows: EntityChangeRow[];
  /**
   * The position to continue from. It covers every row that was scanned,
   * including rows that were filtered out, so a reader can't get stuck on rows
   * that it isn't allowed to see.
   */
  nextGeneration: string;
};

/**
 * Reads the highest published generation, or zero if there is none yet.
 *
 * @remarks
 *
 * Generations are allocated in commit order, so every generation at or below
 * the returned value has committed and is visible to later reads.
 */
export async function getMaxGeneration(knex: Knex): Promise<string> {
  const row = await knex<DbFinalEntitiesRow>('final_entities')
    .select({ generation: generationAsText(knex, 'MAX(generation)') })
    .first();
  return row?.generation ?? '0';
}

/**
 * Reads a generation expression as text, since MySQL and SQLite otherwise
 * return numbers that lose precision above 2^53.
 */
export function generationAsText(
  knex: Knex,
  expression: string,
  alias?: string,
): Knex.Raw {
  const client = knex.client.config.client;
  let type = 'TEXT';
  if (client === 'pg') {
    type = 'text';
  } else if (client.includes('mysql')) {
    type = 'CHAR';
  }
  return alias
    ? knex.raw(`CAST(${expression} AS ${type}) AS ??`, [alias])
    : knex.raw(`CAST(${expression} AS ${type})`);
}

/**
 * The most rows that one read scans before filtering, when a scope or
 * permission filter could make matches sparse.
 */
const DEFAULT_WINDOW_SIZE = 5000;

type ChangeRow = {
  entityRef: string;
  generation: string;
  deleted: number | string | boolean;
};

/**
 * Reads the refs whose generation is above the given position, in generation
 * order.
 *
 * @remarks
 *
 * A page never splits a generation, so it can hold more rows than the limit.
 * When a permission filter is given, live rows are filtered through the search
 * table. Tombstones have no search rows, so they are all returned along with
 * the body they replaced, for the caller to filter in memory.
 *
 * With a scope or a filter, matches can be sparse, so a read first picks a
 * window of at most `windowSize` generations from the index, without
 * filtering, and only looks for matches within it. That bounds the work of
 * each read; a window with no matches still moves the position past it. A
 * scope that names exact refs is instead read through the ref index.
 */
export async function readEntityChanges(
  knex: Knex,
  options: {
    afterGeneration: string;
    limit: number;
    scope?: EntityChangeScopeEntry[];
    filter?: FilterPredicate;
    windowSize?: number;
  },
): Promise<ReadEntityChangesResult> {
  const { afterGeneration, limit, scope, filter } = options;
  const windowSize = Math.max(options.windowSize ?? DEFAULT_WINDOW_SIZE, limit);

  // Capturing the maximum first bounds the scan, and lets a short page skip
  // straight to it: anything at or below it has committed, so rows that this
  // read doesn't return there have been filtered out.
  const maxGeneration = await getMaxGeneration(knex);
  if (BigInt(maxGeneration) <= BigInt(afterGeneration)) {
    return { rows: [], nextGeneration: afterGeneration };
  }

  const select = (range: { upTo: string } | { exactly: string }) => {
    let query = knex<DbFinalEntitiesRow>('final_entities')
      .select({
        entityRef: 'final_entities.entity_ref',
        generation: generationAsText(knex, 'final_entities.generation'),
        generationOrder: 'final_entities.generation',
        deleted: knex.raw(
          'CASE WHEN final_entities.final_entity IS NULL THEN 1 ELSE 0 END',
        ),
      })
      .modify(qb => {
        if ('upTo' in range) {
          qb.where('final_entities.generation', '>', afterGeneration).where(
            'final_entities.generation',
            '<=',
            range.upTo,
          );
        } else {
          qb.where('final_entities.generation', '=', range.exactly);
        }
      });

    query = applyEntityChangeScope(query, scope);

    if (filter) {
      // Only live rows can pass the filter, since tombstones have no search
      // rows. Readers whose access depends on conditions are therefore not
      // told about deletions.
      query = query.where(live =>
        applyEntityFilterToQuery({
          filter,
          targetQuery: live,
          onEntityIdField: 'final_entities.entity_id',
          knex,
        }),
      );
    }

    return query;
  };

  let rows: ChangeRow[];
  let full: boolean;
  let windowEnd = maxGeneration;

  if (isExactEntityChangeScope(scope)) {
    // Each ref has at most one row, so read them all through the ref index
    // without ordering in SQL, and page in memory
    rows = ((await select({ upTo: maxGeneration })) as ChangeRow[]).sort(
      (a, b) => compareGenerations(a.generation, b.generation),
    );
    full = rows.length > limit;
    if (full) {
      const last = rows[limit - 1].generation;
      let end = limit;
      while (end < rows.length && rows[end].generation === last) {
        ++end;
      }
      rows = rows.slice(0, end);
    }
  } else {
    if (scope?.length || filter) {
      // The generation that ends a window of windowSize rows, read from the
      // index alone. If there are fewer rows, the window ends at the maximum.
      const edge = await knex<DbFinalEntitiesRow>('final_entities')
        .select({ generation: generationAsText(knex, 'generation') })
        .where('generation', '>', afterGeneration)
        .where('generation', '<=', maxGeneration)
        .orderBy('generation', 'asc')
        .offset(windowSize - 1)
        .limit(1)
        .first();
      if (edge) {
        windowEnd = String(edge.generation);
      }
    }

    if (knex.client.config.client === 'pg') {
      const result = await knex.raw(
        '? ORDER BY "generationOrder" FETCH FIRST ? ROWS WITH TIES',
        [select({ upTo: windowEnd }), limit],
      );
      rows = result.rows;
      full = rows.length >= limit;
    } else {
      // Without WITH TIES, read one extra row. If it shares the last
      // generation, read the rest of that generation separately. Rows that
      // share a generation commit together, so all of them are visible.
      rows = await select({ upTo: windowEnd })
        .orderBy('final_entities.generation', 'asc')
        .limit(limit + 1);
      full = rows.length > limit;
      if (full) {
        const last = String(rows[limit - 1].generation);
        if (String(rows[limit].generation) === last) {
          // Keep the rows already read, even if some were republished since,
          // and add the rest of the generation
          rows = rows.slice(0, limit);
          const seen = new Set(rows.map(row => row.entityRef));
          for (const row of (await select({ exactly: last })) as ChangeRow[]) {
            if (!seen.has(row.entityRef)) {
              rows.push(row);
            }
          }
        } else {
          rows = rows.slice(0, limit);
        }
      }
    }
  }

  return {
    rows: rows.map(row => ({
      entityRef: row.entityRef,
      deleted: Boolean(Number(row.deleted)),
    })),
    nextGeneration: full ? String(rows[rows.length - 1].generation) : windowEnd,
  };
}

function compareGenerations(a: string, b: string): number {
  const difference = BigInt(a) - BigInt(b);
  if (difference === 0n) {
    return 0;
  }
  return difference < 0n ? -1 : 1;
}
