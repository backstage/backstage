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
import { DbRefreshStateRow } from '../../tables';
import { retryOnDeadlock } from '../../util';
import { markForStitching } from '../stitcher/markForStitching';

/**
 * Finds and deletes all orphaned entities, i.e. entities that do not have any
 * incoming references to them, and also eagerly deletes all of their children
 * that would otherwise become orphaned.
 */
export async function deleteOrphanedEntities(options: {
  knex: Knex.Transaction | Knex;
}): Promise<number> {
  const { knex } = options;

  const runIteration = async (tx: Knex.Transaction | Knex) => {
    // Keep orphan discovery and relation lookup in one statement so that they
    // observe the same database snapshot.
    const findOrphanRefs = (orphanRefs: Knex.QueryBuilder) =>
      orphanRefs
        .from('refresh_state')
        .select('refresh_state.entity_ref')
        .leftOuterJoin(
          'refresh_state_references',
          'refresh_state_references.target_entity_ref',
          'refresh_state.entity_ref',
        )
        .whereNull('refresh_state_references.target_entity_ref');

    const candidateQuery = tx.client.config.client.includes('pg')
      ? tx.withMaterialized('orphan_refs', ['entity_ref'], findOrphanRefs)
      : tx.with('orphan_refs', ['entity_ref'], findOrphanRefs);

    const candidates = await candidateQuery
      .select({
        entityId: 'orphan.entity_id',
        relationSourceId: 'relation_source.entity_id',
      })
      .from('orphan_refs')
      .join(
        'refresh_state as orphan',
        'orphan.entity_ref',
        'orphan_refs.entity_ref',
      )
      .leftOuterJoin(
        'relations',
        'relations.target_entity_ref',
        'orphan_refs.entity_ref',
      )
      .leftOuterJoin(
        'refresh_state as relation_source',
        'relation_source.entity_ref',
        'relations.source_entity_ref',
      );

    if (!candidates.length) {
      return { deleted: 0, done: true };
    }

    const orphanIds: string[] = uniq(candidates.map(r => r.entityId));
    const orphanRelationIds: string[] = uniq(
      candidates.map(r => r.relationSourceId).filter(Boolean),
    );

    // Recheck the orphan status in the deletion statement. An entity may have
    // gained a reference since the candidate query completed.
    const deleted = await tx
      .table<DbRefreshStateRow>('refresh_state')
      .delete()
      .whereIn('entity_id', orphanIds)
      .whereNotExists(references =>
        references
          .select(tx.raw('1'))
          .from('refresh_state_references')
          .whereRaw('?? = ??', [
            'refresh_state_references.target_entity_ref',
            'refresh_state.entity_ref',
          ]),
      );

    // Mark all of the things that the orphans had relations to for stitching
    await markForStitching({
      knex: tx,
      entityIds: orphanRelationIds,
    });

    return { deleted, done: false };
  };

  let total = 0;

  // Limit iterations for sanity
  for (let i = 0; i < 100; ++i) {
    const result = knex.isTransaction
      ? await runIteration(knex)
      : await retryOnDeadlock(() => knex.transaction(runIteration), knex);

    total += result.deleted;
    if (result.done) {
      break;
    }
  }

  return total;
}
