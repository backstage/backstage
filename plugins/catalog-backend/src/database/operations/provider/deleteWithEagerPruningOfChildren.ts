/*
 * Copyright 2022 The Backstage Authors
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
import lodash from 'lodash';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
} from '../../tables';

/**
 * Given a number of entity refs originally created by a given entity provider
 * (source key), remove those entities from the refresh state, and at the same
 * time recursively remove every child that is a direct or indirect result of
 * processing those entities, if they would have otherwise become orphaned by
 * the removal of their parents.
 */
export async function deleteWithEagerPruningOfChildren(options: {
  knex: Knex | Knex.Transaction;
  entityRefs: string[];
  sourceKey: string;
}): Promise<number> {
  const { knex, entityRefs, sourceKey } = options;

  // Split up the operation by (large) chunks, so that we do not hit database
  // limits for the number of permitted bindings on a precompiled statement
  let removedCount = 0;
  for (const refs of lodash.chunk(entityRefs, 1000)) {
    const { orphanEntityRefs } =
      await findDescendantsThatWouldHaveBeenOrphanedByDeletion({
        knex: options.knex,
        refs,
        sourceKey,
      });

    // Chunk again - these can be many more than the outer chunk size
    for (const refsToDelete of lodash.chunk(orphanEntityRefs, 1000)) {
      await markEntitiesAffectedByDeletionForStitching({
        knex: options.knex,
        entityRefs: refsToDelete,
      });
      await knex
        .delete()
        .from('refresh_state')
        .whereIn('entity_ref', refsToDelete);
    }

    // Delete the references that originate only from this entity provider. Note
    // that there may be more than one entity provider making a "claim" for a
    // given root entity, if they emit with the same location key.
    await knex<DbRefreshStateReferencesRow>('refresh_state_references')
      .where('source_key', '=', sourceKey)
      .whereIn('target_entity_ref', refs)
      .delete();

    removedCount += orphanEntityRefs.length;
  }

  return removedCount;
}

async function findDescendantsThatWouldHaveBeenOrphanedByDeletion(options: {
  knex: Knex | Knex.Transaction;
  refs: string[];
  sourceKey: string;
}): Promise<{ orphanEntityRefs: string[] }> {
  const { knex, refs, sourceKey } = options;

  // This function uses a hybrid approach:
  // 1. Uses inline source columns (source_type, source_key) in refresh_state for new data
  // 2. Falls back to refresh_state_references for backwards compatibility
  //
  // The algorithm finds all descendants of the deletion targets and determines which
  // would become orphans after deletion.

  const orphans: string[] = await knex
    // First find all nodes that can be reached downwards from the roots
    // (deletion targets), including the roots themselves.
    // We traverse using both inline source columns and refresh_state_references.
    .withRecursive('descendants', ['entity_ref'], initial =>
      initial
        // Start with entities from this provider in the deletion targets
        .select('entity_ref')
        .from('refresh_state')
        .where('source_type', '=', 'provider')
        .where('source_key', '=', sourceKey)
        .whereIn('entity_ref', refs)
        // Also include from refresh_state_references for backwards compatibility
        .union(backcompat =>
          backcompat
            .select('target_entity_ref')
            .from('refresh_state_references')
            .where('source_key', '=', sourceKey)
            .whereIn('target_entity_ref', refs),
        )
        // Then recursively find children
        .union(recursive =>
          recursive
            // Children via inline source columns
            .select('refresh_state.entity_ref')
            .from('descendants')
            .join('refresh_state', function joinChild(join) {
              join
                .on('refresh_state.source_type', '=', knex.raw('?', ['entity']))
                .andOn(
                  'refresh_state.source_key',
                  '=',
                  'descendants.entity_ref',
                );
            }),
        )
        .union(recursive =>
          recursive
            // Children via refresh_state_references
            .select('refresh_state_references.target_entity_ref')
            .from('descendants')
            .join(
              'refresh_state_references',
              'descendants.entity_ref',
              'refresh_state_references.source_entity_ref',
            ),
        ),
    )
    // For each descendant, check if it has other sources keeping it alive
    // An entity is retained if it has a source that is NOT being deleted
    .with('retained', ['entity_ref'], notPartOfDeletion =>
      notPartOfDeletion
        // Check inline source columns: entity has a provider source that's not being deleted
        .select('descendants.entity_ref')
        .from('descendants')
        .join(
          'refresh_state',
          'refresh_state.entity_ref',
          'descendants.entity_ref',
        )
        .where('refresh_state.source_type', '=', 'provider')
        .where(builder =>
          builder
            .where('refresh_state.source_key', '!=', sourceKey)
            .orWhereNotIn('refresh_state.entity_ref', refs),
        )
        // Check inline source columns: entity has an entity parent that's not a descendant
        .union(parentNotDescendant =>
          parentNotDescendant
            .select('descendants.entity_ref')
            .from('descendants')
            .join(
              'refresh_state',
              'refresh_state.entity_ref',
              'descendants.entity_ref',
            )
            .where('refresh_state.source_type', '=', 'entity')
            .whereNotIn(
              'refresh_state.source_key',
              function inDescendants(builder) {
                builder.select('entity_ref').from('descendants');
              },
            ),
        )
        // Also check refresh_state_references for backwards compatibility
        .union(refNotPartOfDeletion =>
          refNotPartOfDeletion
            .select('descendants.entity_ref')
            .from('descendants')
            .join(
              'refresh_state_references',
              'refresh_state_references.target_entity_ref',
              'descendants.entity_ref',
            )
            .whereNotNull('refresh_state_references.source_key')
            .where(builder =>
              builder
                .where('refresh_state_references.source_key', '!=', sourceKey)
                .orWhereNotIn(
                  'refresh_state_references.target_entity_ref',
                  refs,
                ),
            ),
        ),
    )
    // Return all descendants minus the retained ones
    .select('descendants.entity_ref AS entity_ref')
    .from('descendants')
    .leftOuterJoin('retained', 'retained.entity_ref', 'descendants.entity_ref')
    .whereNull('retained.entity_ref')
    .then(rows => rows.map(row => row.entity_ref));

  return { orphanEntityRefs: orphans };
}

async function markEntitiesAffectedByDeletionForStitching(options: {
  knex: Knex | Knex.Transaction;
  entityRefs: string[];
}) {
  const { knex, entityRefs } = options;

  // We want to re-stitch anything that has a relation pointing to the
  // soon-to-be-deleted entity. In many circumstances we also re-stitch children
  // in the refresh_state_references graph because their orphan state might
  // change, but not here - this code by its very definition is meant to not
  // leave any orphans behind, so we can simplify away that.
  const affectedIds = await knex
    .select('refresh_state.entity_id AS entity_id')
    .from('relations')
    .join(
      'refresh_state',
      'relations.source_entity_ref',
      'refresh_state.entity_ref',
    )
    .whereIn('relations.target_entity_ref', entityRefs)
    .then(rows => rows.map(row => row.entity_id));

  for (const ids of lodash.chunk(affectedIds, 1000)) {
    await knex
      .table<DbFinalEntitiesRow>('final_entities')
      .update({
        hash: 'force-stitching',
      })
      .whereIn('entity_id', ids);
    await knex
      .table<DbRefreshStateRow>('refresh_state')
      .update({
        result_hash: 'force-stitching',
        next_update_at: knex.fn.now(),
      })
      .whereIn('entity_id', ids);
  }
}
