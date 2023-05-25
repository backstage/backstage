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
import { StitchingStrategy } from '../../../stitching/types';
import { DbFinalEntitiesRow, DbRefreshStateRow } from '../../tables';

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
  // Splitting to chunks just to cover pathological cases that upset the db
  const entityRefs = split(options.entityRefs);
  const entityIds = split(options.entityIds);
  const knex = options.knex;

  if (options.strategy.mode === 'immediate') {
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
      await knex
        .table<DbRefreshStateRow>('refresh_state')
        .update({
          result_hash: 'force-stitching',
          next_update_at: knex.fn.now(),
        })
        .whereIn('entity_ref', chunk);
    }

    for (const chunk of entityIds) {
      await knex
        .table<DbFinalEntitiesRow>('final_entities')
        .update({
          hash: 'force-stitching',
        })
        .whereIn('entity_id', chunk);
      await knex
        .table<DbRefreshStateRow>('refresh_state')
        .update({
          result_hash: 'force-stitching',
          next_update_at: knex.fn.now(),
        })
        .whereIn('entity_id', chunk);
    }
  } else {
    // It's OK that this is shared across refresh state rows; it just needs to
    // be uniquely generated for every new stitch request.
    const ticket = uuid();

    for (const chunk of entityRefs) {
      await knex<DbRefreshStateRow>('refresh_state')
        .update({
          next_stitch_at: knex.fn.now(),
          next_stitch_ticket: ticket,
        })
        .whereIn('entity_ref', chunk);
    }

    for (const chunk of entityIds) {
      await knex<DbRefreshStateRow>('refresh_state')
        .update({
          next_stitch_at: knex.fn.now(),
          next_stitch_ticket: ticket,
        })
        .whereIn('entity_id', chunk);
    }
  }
}

function split(input: Iterable<string> | undefined): string[][] {
  if (!input) {
    return [];
  }
  return splitToChunks(Array.isArray(input) ? input : [...input], 200);
}
