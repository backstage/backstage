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
import { StitchingStrategy } from '../../../stitching/types';
import { DbRefreshStateRow } from '../../tables';
import { markForStitching } from '../stitcher/markForStitching';

/**
 * Finds and deletes all orphaned entities, i.e. entities that do not have any
 * incoming references to them, and also eagerly deletes all of their children
 * that would otherwise become orphaned.
 *
 * An entity is considered orphaned if:
 * - source_type='entity' and the parent entity (source_key) no longer exists in refresh_state
 * - There is no reference in refresh_state_references (backwards compatibility)
 *
 * Note: Provider-sourced orphans (where the provider no longer exists) are handled
 * separately by the processing engine using the activeProviders list.
 */
export async function deleteOrphanedEntities(options: {
  knex: Knex.Transaction | Knex;
  strategy: StitchingStrategy;
}): Promise<number> {
  const { knex, strategy } = options;

  let total = 0;

  // Limit iterations for sanity
  for (let i = 0; i < 100; ++i) {
    // Find orphans using both new inline source columns and old refresh_state_references
    const candidates = await knex
      .with('orphans', ['entity_id', 'entity_ref'], orphans =>
        orphans
          .from('refresh_state as rs')
          .select('rs.entity_id', 'rs.entity_ref')
          // Check inline source columns first: entity-sourced entities whose parent is gone
          .where(builder =>
            builder
              .where('rs.source_type', '=', 'entity')
              .whereNotExists(parentExists =>
                parentExists
                  .from('refresh_state as parent')
                  .whereRaw('parent.entity_ref = rs.source_key'),
              ),
          )
          // Also check old refresh_state_references for backwards compatibility
          .orWhere(builder =>
            builder
              .whereNull('rs.source_type')
              .whereNotExists(refExists =>
                refExists
                  .from('refresh_state_references as rsr')
                  .whereRaw('rsr.target_entity_ref = rs.entity_ref'),
              ),
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
    await knex
      .table<DbRefreshStateRow>('refresh_state')
      .delete()
      .whereIn('entity_id', orphanIds);

    // Mark all of the things that the orphans had relations to for stitching
    await markForStitching({
      knex,
      strategy,
      entityIds: orphanRelationIds,
    });
  }

  return total;
}
