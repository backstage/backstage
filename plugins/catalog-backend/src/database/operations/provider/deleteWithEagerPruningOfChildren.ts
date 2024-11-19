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
  DbRefreshStateQueuesRow,
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

  const orphans: string[] =
    // First find all nodes that can be reached downwards from the roots
    // (deletion targets), including the roots themselves, by traversing
    // down the refresh_state_references table. Note that this query
    // starts with a condition that source_key = our source key, and
    // target_entity_ref is one of the deletion targets. This has two
    // effects: it won't match attempts at deleting something that didn't
    // originate from us in the first place, and also won't match non-root
    // entities (source_key would be null for those).
    //
    //   KeyA - R1 - R2        Legend:
    //                 \       -----------------------------------------
    //                  R3     Key*    Source key
    //                 /       R*      Entity ref
    //   KeyA - R4 - R5        lines   Individual references; sources to
    //              /                  the left and targets to the right
    //   KeyB --- R6
    //
    // The scenario is that KeyA wants to delete R1.
    //
    // The query starts with the KeyA-R1 reference, and then traverses
    // down to also find R2 and R3. It uses union instead of union all,
    // because it wants to find the set of unique descendants even if
    // the tree has unexpected loops etc.
    await knex
      .withRecursive('descendants', ['entity_ref'], initial =>
        initial
          .select('target_entity_ref')
          .from('refresh_state_references')
          .where('source_key', '=', sourceKey)
          .whereIn('target_entity_ref', refs)
          .union(recursive =>
            recursive
              .select('refresh_state_references.target_entity_ref')
              .from('descendants')
              .join(
                'refresh_state_references',
                'descendants.entity_ref',
                'refresh_state_references.source_entity_ref',
              ),
          ),
      )
      // Then for each descendant, traverse all the way back upwards through
      // the refresh_state_references table to get an exhaustive list of all
      // references that are part of keeping that particular descendant
      // alive.
      //
      // Continuing the scenario from above, starting from R3, it goes
      // upwards to find every pair along every relation line.
      //
      //   Top branch:     R2-R3, R1-R2, KeyA-R1
      //   Middle branch:  R5-R3, R4-R5, KeyA-R4
      //   Bottom branch:  R6-R5, KeyB-R6
      //
      // Note that this all applied to the subject R3. The exact same thing
      // will be done starting from each other descendant (R2 and R1). They
      // only have one and two references to find, respectively.
      //
      // This query also uses union instead of union all, to get the set of
      // distinct relations even if the tree has unexpected loops etc.
      .withRecursive(
        'ancestors',
        ['source_key', 'source_entity_ref', 'target_entity_ref', 'subject'],
        initial =>
          initial
            .select(
              'refresh_state_references.source_key',
              'refresh_state_references.source_entity_ref',
              'refresh_state_references.target_entity_ref',
              'descendants.entity_ref',
            )
            .from('descendants')
            .join(
              'refresh_state_references',
              'refresh_state_references.target_entity_ref',
              'descendants.entity_ref',
            )
            .union(recursive =>
              recursive
                .select(
                  'refresh_state_references.source_key',
                  'refresh_state_references.source_entity_ref',
                  'refresh_state_references.target_entity_ref',
                  'ancestors.subject',
                )
                .from('ancestors')
                .join(
                  'refresh_state_references',
                  'refresh_state_references.target_entity_ref',
                  'ancestors.source_entity_ref',
                ),
            ),
      )
      // Finally, from that list of ancestor relations per descendant, pick
      // out the ones that are roots (have a source_key). Specifically, find
      // ones that seem to be be either (1) from another source, or (2)
      // aren't part of the deletion targets. Those are markers that tell us
      // that the corresponding descendant should be kept alive and NOT
      // subject to eager deletion, because there's "something else" (not
      // targeted for deletion) that has references down through the tree to
      // it.
      //
      // Continuing the scenario from above, for R3 we have
      //
      //   KeyA-R1, KeyA-R4, KeyB-R6
      //
      // This tells us that R3 should be kept alive for two reasons: it's
      // referenced by a node that isn't being deleted (R4), and also by
      // another source (KeyB). What about R1 and R2? They both have
      //
      //   KeyA-R1
      //
      // So those should be deleted, since they are definitely only being
      // kept alive by something that's about to be deleted.
      //
      // Final shape of the tree:
      //
      //                  R3
      //                 /
      //   KeyA - R4 - R5
      //              /
      //   KeyB --- R6
      .with('retained', ['entity_ref'], notPartOfDeletion =>
        notPartOfDeletion
          .select('subject')
          .from('ancestors')
          .whereNotNull('ancestors.source_key')
          .where(foreignKeyOrRef =>
            foreignKeyOrRef
              .where('ancestors.source_key', '!=', sourceKey)
              .orWhereNotIn('ancestors.target_entity_ref', refs),
          ),
      )
      // Return all descendants minus the retained ones
      .select('descendants.entity_ref AS entity_ref')
      .from('descendants')
      .leftOuterJoin(
        'retained',
        'retained.entity_ref',
        'descendants.entity_ref',
      )
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
      .update({ hash: 'force-stitching' })
      .whereIn('entity_id', ids);
    await knex
      .table<DbRefreshStateRow>('refresh_state')
      .update({ result_hash: 'force-stitching' })
      .whereIn('entity_id', ids);
    await knex
      .table<DbRefreshStateQueuesRow>('refresh_state_queues')
      .insert(ids.map(id => ({ entity_id: id, next_update_at: knex.fn.now() })))
      .onConflict(['entity_id'])
      .merge(['next_update_at']);
  }
}
