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
  let removedCount = 0;

  const rootId = () =>
    tx.raw(
      tx.client.config.client.includes('mysql')
        ? 'CAST(NULL as UNSIGNED INT)'
        : 'CAST(NULL as INT)',
      [],
    );

  // Split up the operation by (large) chunks, so that we do not hit database
  // limits for the number of permitted bindings on a precompiled statement
  for (const refs of lodash.chunk(entityRefs, 1000)) {
    /*
    WITH RECURSIVE
      -- All the nodes that can be reached downwards from our root
      descendants(root_id, entity_ref) AS (
        SELECT id, target_entity_ref
        FROM refresh_state_references
        WHERE source_key = "R1" AND target_entity_ref = "A"
        UNION
        SELECT descendants.root_id, target_entity_ref
        FROM descendants
        JOIN refresh_state_references ON source_entity_ref = descendants.entity_ref
      ),
      -- All the nodes that can be reached upwards from the descendants
      ancestors(root_id, via_entity_ref, to_entity_ref) AS (
        SELECT CAST(NULL as INT), entity_ref, entity_ref
        FROM descendants
        UNION
        SELECT
          CASE WHEN source_key IS NOT NULL THEN id ELSE NULL END,
          source_entity_ref,
          ancestors.to_entity_ref
        FROM ancestors
        JOIN refresh_state_references ON target_entity_ref = ancestors.via_entity_ref
      )
    -- Start out with all of the descendants
    SELECT descendants.entity_ref
    FROM descendants
    -- Expand with all ancestors that point to those, but aren't the current root
    LEFT OUTER JOIN ancestors
      ON ancestors.to_entity_ref = descendants.entity_ref
      AND ancestors.root_id IS NOT NULL
      AND ancestors.root_id != descendants.root_id
    -- Exclude all lines that had such a foreign ancestor
    WHERE ancestors.root_id IS NULL;
    */
    removedCount += await tx<DbRefreshStateRow>('refresh_state')
      .whereIn('entity_ref', function orphanedEntityRefs(orphans) {
        return (
          orphans
            // All the nodes that can be reached downwards from our root
            .withRecursive('descendants', function descendants(outer) {
              return outer
                .select({ root_id: 'id', entity_ref: 'target_entity_ref' })
                .from('refresh_state_references')
                .where('source_key', sourceKey)
                .whereIn('target_entity_ref', refs)
                .union(function recursive(inner) {
                  return inner
                    .select({
                      root_id: 'descendants.root_id',
                      entity_ref: 'refresh_state_references.target_entity_ref',
                    })
                    .from('descendants')
                    .join('refresh_state_references', {
                      'descendants.entity_ref':
                        'refresh_state_references.source_entity_ref',
                    });
                });
            })
            // All the nodes that can be reached upwards from the descendants
            .withRecursive('ancestors', function ancestors(outer) {
              return outer
                .select({
                  root_id: rootId(),
                  via_entity_ref: 'entity_ref',
                  to_entity_ref: 'entity_ref',
                })
                .from('descendants')
                .union(function recursive(inner) {
                  return inner
                    .select({
                      root_id: tx.raw(
                        'CASE WHEN source_key IS NOT NULL THEN id ELSE NULL END',
                        [],
                      ),
                      via_entity_ref: 'source_entity_ref',
                      to_entity_ref: 'ancestors.to_entity_ref',
                    })
                    .from('ancestors')
                    .join('refresh_state_references', {
                      target_entity_ref: 'ancestors.via_entity_ref',
                    });
                });
            })
            // Start out with all of the descendants
            .select('descendants.entity_ref')
            .from('descendants')
            // Expand with all ancestors that point to those, but aren't the current root
            .leftOuterJoin('ancestors', function keepaliveRoots() {
              this.on('ancestors.to_entity_ref', '=', 'descendants.entity_ref');
              this.andOnNotNull('ancestors.root_id');
              this.andOn('ancestors.root_id', '!=', 'descendants.root_id');
            })
            .whereNull('ancestors.root_id')
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
