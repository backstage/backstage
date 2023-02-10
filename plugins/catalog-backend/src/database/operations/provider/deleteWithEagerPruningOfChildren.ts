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
import { DbRefreshStateReferencesRow, DbRefreshStateRow } from '../../tables';

/**
 * Given a number of entity refs originally created by a given entity provider
 * (source key), remove those entities from the refresh state, and at the same
 * time recursively remove every child that is a direct or indirect result of
 * processing those entities, if they would have otherwise become orphaned by
 * the removal of their parents.
 */
export async function deleteWithEagerPruningOfChildren(options: {
  tx: Knex.Transaction;
  entityRefs: string[];
  sourceKey: string;
}): Promise<number> {
  const { tx, entityRefs, sourceKey } = options;

  // Split up the operation by (large) chunks, so that we do not hit database
  // limits for the number of permitted bindings on a precompiled statement
  let removedCount = 0;
  for (const refs of lodash.chunk(entityRefs, 1000)) {
    /*
    WITH RECURSIVE
      -- All the nodes that can be reached downwards from our root
      descendants(entity_ref) AS (
        SELECT target_entity_ref
        FROM refresh_state_references
        WHERE source_key = "R1" AND target_entity_ref IN [...refs]
        UNION
        SELECT target_entity_ref
        FROM descendants
        JOIN refresh_state_references ON source_entity_ref = descendants.entity_ref
      ),
      -- All the individual relations that can be reached upwards from each descendant
      ancestors(source_key, source_entity_ref, target_entity_ref, subject) AS (
        SELECT source_key, source_entity_ref, target_entity_ref, descendants.entity_ref
        FROM descendants
        JOIN refresh_state_references ON refresh_state_references.target_entity_ref = descendants.entity_ref
        UNION
        SELECT
          refresh_state_references.source_key,
          refresh_state_references.source_entity_ref,
          refresh_state_references.target_entity_ref,
          ancestors.subject
        FROM ancestors
        JOIN refresh_state_references ON refresh_state_references.target_entity_ref = ancestors.source_entity_ref
      )
    -- Start out with all of the descendants
    SELECT descendants.entity_ref
    FROM descendants
    -- Exclude those who seem to have a root relation somewhere upwards that's not part of our own deletion
    WHERE NOT EXISTS (
      SELECT * FROM ancestors
      WHERE ancestors.subject = descendants.entity_ref
      AND ancestors.source_key IS NOT NULL
      AND (ancestors.source_key != "R1" OR ancestors.target_entity_ref NOT IN [...refs])
    )
    */
    removedCount += await tx<DbRefreshStateRow>('refresh_state')
      .whereIn('entity_ref', function orphanedEntityRefs(orphans) {
        return (
          orphans
            // All the nodes that can be reached downwards from our root
            .withRecursive(
              'descendants',
              ['entity_ref'],
              function descendants(outer) {
                return outer
                  .select({ entity_ref: 'target_entity_ref' })
                  .from('refresh_state_references')
                  .where('source_key', '=', sourceKey)
                  .whereIn('target_entity_ref', refs)
                  .union(function recursive(inner) {
                    return inner
                      .select({
                        entity_ref:
                          'refresh_state_references.target_entity_ref',
                      })
                      .from('descendants')
                      .join('refresh_state_references', {
                        'descendants.entity_ref':
                          'refresh_state_references.source_entity_ref',
                      });
                  });
              },
            )
            // All the relations that can be reached upwards from each descendant
            .withRecursive(
              'ancestors',
              [
                'source_key',
                'source_entity_ref',
                'target_entity_ref',
                'subject',
              ],
              function ancestors(outer) {
                return outer
                  .select({
                    source_key: 'refresh_state_references.source_key',
                    source_entity_ref:
                      'refresh_state_references.source_entity_ref',
                    target_entity_ref:
                      'refresh_state_references.target_entity_ref',
                    subject: 'descendants.entity_ref',
                  })
                  .from('descendants')
                  .join('refresh_state_references', {
                    'refresh_state_references.target_entity_ref':
                      'descendants.entity_ref',
                  })
                  .union(function recursive(inner) {
                    return inner
                      .select({
                        source_key: 'refresh_state_references.source_key',
                        source_entity_ref:
                          'refresh_state_references.source_entity_ref',
                        target_entity_ref:
                          'refresh_state_references.target_entity_ref',
                        subject: 'ancestors.subject',
                      })
                      .from('ancestors')
                      .join('refresh_state_references', {
                        'refresh_state_references.target_entity_ref':
                          'ancestors.source_entity_ref',
                      });
                  });
              },
            )
            // Start out with all of the descendants
            .select('descendants.entity_ref')
            .from('descendants')
            // Exclude those who seem to have a root relation somewhere upwards that's not part of our own deletion
            .whereNotExists(function otherAncestors(outer) {
              outer
                .from('ancestors')
                .where(
                  'ancestors.subject',
                  '=',
                  tx.ref('descendants.entity_ref'),
                )
                .whereNotNull('ancestors.source_key')
                .andWhere(function differentRoot(inner) {
                  inner
                    .where('ancestors.source_key', '!=', sourceKey)
                    .orWhereNotIn('ancestors.target_entity_ref', refs);
                });
            })
        );
      })
      .delete();

    // Delete the references that originate only from this entity provider. Note
    // that there may be more than one entity provider making a "claim" for a
    // given root entity, if they emit with the same location key.
    await tx<DbRefreshStateReferencesRow>('refresh_state_references')
      .where('source_key', '=', sourceKey)
      .whereIn('target_entity_ref', refs)
      .delete();
  }

  return removedCount;
}
