/*
 * Copyright 2023 The Backstage Authors
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

import { Knex } from 'knex';
import splitToChunks from 'lodash/chunk';
import { v4 as uuid } from 'uuid';
import { ErrorLike, isError } from '@backstage/errors';
import { StitchingStrategy } from '../../../stitching/types';
import { setTimeout as sleep } from 'timers/promises';
import { DbFinalEntitiesRow, DbRefreshStateRow } from '../../tables';

const UPDATE_CHUNK_SIZE = 100; // Smaller chunks reduce contention
const DEADLOCK_RETRY_ATTEMPTS = 3;
const DEADLOCK_BASE_DELAY_MS = 25;

// PostgreSQL deadlock error code
const POSTGRES_DEADLOCK_SQLSTATE = '40P01';

/**
 * Checks if the given error is a deadlock error for the database engine in use.
 */
function isDeadlockError(
  knex: Knex | Knex.Transaction,
  e: unknown,
): e is ErrorLike {
  if (knex.client.config.client.includes('pg')) {
    // PostgreSQL deadlock detection
    return isError(e) && e.code === POSTGRES_DEADLOCK_SQLSTATE;
  }

  // Add more database engine checks here as needed
  return false;
}

/**
 * Marks a number of entities for stitching some time in the near
 * future.
 *
 * @remarks
 */
export async function markForStitching(options: {
  knex: Knex | Knex.Transaction;
  strategy: StitchingStrategy;
  entityRefs?: Iterable<string>;
  entityIds?: Iterable<string>;
}): Promise<void> {
  const entityRefs = sortSplit(options.entityRefs);
  const entityIds = sortSplit(options.entityIds);
  const knex = options.knex;
  const mode = options.strategy.mode;

  if (mode === 'immediate') {
    for (const chunk of entityRefs) {
      await knex
        .table<DbFinalEntitiesRow>('final_entities')
        .update({
          hash: 'force-stitching',
        })
        .whereIn(
          'entity_id',
          knex<DbRefreshStateRow>('refresh_state')
            .select('entity_id')
            .whereIn('entity_ref', chunk),
        );
      await retryOnDeadlock(async () => {
        await knex
          .table<DbRefreshStateRow>('refresh_state')
          .update({
            result_hash: 'force-stitching',
            next_update_at: knex.fn.now(),
          })
          .whereIn('entity_ref', chunk);
      }, knex);
    }

    for (const chunk of entityIds) {
      await knex
        .table<DbFinalEntitiesRow>('final_entities')
        .update({
          hash: 'force-stitching',
        })
        .whereIn('entity_id', chunk);
      await retryOnDeadlock(async () => {
        await knex
          .table<DbRefreshStateRow>('refresh_state')
          .update({
            result_hash: 'force-stitching',
            next_update_at: knex.fn.now(),
          })
          .whereIn('entity_id', chunk);
      }, knex);
    }
  } else if (mode === 'deferred') {
    // It's OK that this is shared across refresh state rows; it just needs to
    // be uniquely generated for every new stitch request.
    const ticket = uuid();

    // Update by primary key in deterministic order to avoid deadlocks
    for (const chunk of entityRefs) {
      await retryOnDeadlock(async () => {
        await knex<DbRefreshStateRow>('refresh_state')
          .update({
            next_stitch_at: knex.fn.now(),
            next_stitch_ticket: ticket,
          })
          .whereIn('entity_ref', chunk);
      }, knex);
    }

    for (const chunk of entityIds) {
      await retryOnDeadlock(async () => {
        await knex<DbRefreshStateRow>('refresh_state')
          .update({
            next_stitch_at: knex.fn.now(),
            next_stitch_ticket: ticket,
          })
          .whereIn('entity_id', chunk);
      }, knex);
    }
  } else {
    throw new Error(`Unknown stitching strategy mode ${mode}`);
  }
}

function sortSplit(input: Iterable<string> | undefined): string[][] {
  if (!input) {
    return [];
  }
  const array = Array.isArray(input) ? input.slice() : [...input];
  array.sort();
  return splitToChunks(array, UPDATE_CHUNK_SIZE);
}

async function retryOnDeadlock<T>(
  fn: () => Promise<T>,
  knex: Knex | Knex.Transaction,
  retries = DEADLOCK_RETRY_ATTEMPTS,
  baseMs = DEADLOCK_BASE_DELAY_MS,
): Promise<T> {
  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (e: unknown) {
      if (isDeadlockError(knex, e) && attempt < retries) {
        await sleep(baseMs * Math.pow(2, attempt));
        attempt++;
        continue;
      }
      throw e;
    }
  }
}
