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
import { DbFinalEntitiesRow, DbRefreshStateRow } from '../../tables';

/**
 * Finds and deletes all orphaned entities, i.e. entities that do not have any
 * incoming references to them, and also eagerly deletes all of their children
 * that would otherwise become orphaned.
 */
export async function deleteOrphanedEntities(options: {
  tx: Knex.Transaction | Knex;
}): Promise<number> {
  const { tx } = options;

  let total = 0;

  // Limit iterations for sanity
  for (let i = 0; i < 100; ++i) {
    const candidates = await tx
      .with('orphans', orphans =>
        orphans
          .from<DbRefreshStateRow>('refresh_state')
          .select('entity_id', 'entity_ref')
          .whereNotIn('entity_ref', keep =>
            keep.distinct('target_entity_ref').from('refresh_state_references'),
          ),
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
    await tx
      .table<DbRefreshStateRow>('refresh_state')
      .delete()
      .whereIn('entity_id', orphanIds);

    // Mark all of things that the orphans had relations to for processing and
    // stitching
    await tx
      .table<DbFinalEntitiesRow>('final_entities')
      .update({
        hash: 'orphan-relation-deleted',
      })
      .whereIn('entity_id', orphanRelationIds);
    await tx
      .table<DbRefreshStateRow>('refresh_state')
      .update({
        result_hash: 'orphan-relation-deleted',
        next_update_at: tx.fn.now(),
      })
      .whereIn('entity_id', orphanRelationIds);
  }

  return total;
}
