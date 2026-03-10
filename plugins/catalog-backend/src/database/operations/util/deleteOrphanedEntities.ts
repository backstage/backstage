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
import uniq from 'lodash/uniq';
import { Queue } from '@backstage/backend-plugin-api/alpha';
import {
  DeferredStitchQueuePayload,
  STITCHER_QUEUE_NAME,
  StitchingStrategy,
} from '../../../stitching/types';
import { DbFinalEntitiesRow, DbRefreshStateRow } from '../../tables';
import { retryOnDeadlock } from '../../util';

/**
 * Finds and deletes all orphaned entities, i.e. entities that do not have any
 * incoming references to them, and also eagerly deletes all of their children
 * that would otherwise become orphaned.
 */
export async function deleteOrphanedEntities(options: {
  knex: Knex.Transaction | Knex;
  strategy: StitchingStrategy;
  queue?: Queue<DeferredStitchQueuePayload>;
}): Promise<number> {
  const { knex, strategy, queue } = options;

  let total = 0;

  // Limit iterations for sanity
  for (let i = 0; i < 100; ++i) {
    const candidates = await knex
      .with('orphans', ['entity_id', 'entity_ref'], orphans =>
        orphans
          .from('refresh_state')
          .select('refresh_state.entity_id', 'refresh_state.entity_ref')
          .leftOuterJoin(
            'refresh_state_references',
            'refresh_state_references.target_entity_ref',
            'refresh_state.entity_ref',
          )
          .whereNull('refresh_state_references.target_entity_ref'),
      )
      .select({
        entityId: 'orphans.entity_id',
        relationSourceId: 'refresh_state.entity_id',
      })
      .from('orphans')
      .leftOuterJoin(
        'relations',
        'relations.target_entity_ref',
        'orphans.entity_ref',
      )
      .leftOuterJoin(
        'refresh_state',
        'refresh_state.entity_ref',
        'relations.source_entity_ref',
      );

    if (!candidates.length) {
      break;
    }

    const orphanIds: string[] = uniq(candidates.map(r => r.entityId));
    const orphanRelationIds: string[] = uniq(
      candidates.map(r => r.relationSourceId).filter(Boolean),
    );

    total += orphanIds.length;

    // Delete the orphans themselves
    await knex
      .table<DbRefreshStateRow>('refresh_state')
      .delete()
      .whereIn('entity_id', orphanIds);

    // Queue all of the things that the orphans had relations to for stitching
    if (orphanRelationIds.length > 0) {
      if (strategy.mode === 'deferred') {
        if (!queue) {
          throw new Error(
            `A ${STITCHER_QUEUE_NAME} queue is required for deferred orphan cleanup`,
          );
        }

        const rows = await knex<DbRefreshStateRow>('refresh_state')
          .select('entity_ref')
          .whereIn('entity_id', orphanRelationIds);
        const stitchRequestedAt = new Date().toISOString();

        for (const entityRef of rows.map(row => row.entity_ref).sort()) {
          await queue.add({
            entityRef,
            stitchRequestedAt,
          });
        }
      } else {
        await markEntityIdsForImmediateStitching(knex, orphanRelationIds);
      }
    }
  }

  return total;
}

async function markEntityIdsForImmediateStitching(
  knex: Knex.Transaction | Knex,
  entityIds: string[],
): Promise<void> {
  await knex<DbFinalEntitiesRow>('final_entities')
    .update({ hash: 'force-stitching' })
    .whereIn('entity_id', entityIds);

  await retryOnDeadlock(async () => {
    await knex<DbRefreshStateRow>('refresh_state')
      .update({
        result_hash: 'force-stitching',
        next_update_at: knex.fn.now(),
      })
      .whereIn('entity_id', entityIds);
  }, knex);
}
