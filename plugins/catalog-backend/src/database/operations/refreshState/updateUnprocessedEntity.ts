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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { DbRefreshStateQueuesRow, DbRefreshStateRow } from '../../tables';

/**
 * Attempts to update an existing refresh state row, returning true if it was
 * updated and false if there was no entity with a matching ref and location key.
 *
 * Updating the entity will also cause it to be scheduled for immediate processing.
 */
export async function updateUnprocessedEntity(options: {
  knex: Knex | Knex.Transaction;
  entity: Entity;
  hash: string;
  locationKey?: string;
}): Promise<boolean> {
  const { knex, entity, hash, locationKey } = options;

  const entityRef = stringifyEntityRef(entity);
  const serializedEntity = JSON.stringify(entity);
  const configClient = knex.client.config.client;

  const query = knex<DbRefreshStateRow>('refresh_state')
    .update({
      unprocessed_entity: serializedEntity,
      unprocessed_hash: hash,
      location_key: locationKey,
      last_discovery_at: knex.fn.now(),
    })
    .where('entity_ref', entityRef)
    .andWhere(inner => {
      if (!locationKey) {
        return inner.whereNull('location_key');
      }
      return inner
        .where('location_key', locationKey)
        .orWhereNull('location_key');
    });

  let entityId: string;
  if (configClient.includes('sqlite3') || configClient.includes('mysql')) {
    const locateResult = await knex<DbRefreshStateRow>('refresh_state')
      .select('entity_id')
      .where('entity_ref', entityRef)
      .first();
    if (!locateResult) {
      return false;
    }
    const refreshResult = await query;
    if (refreshResult !== 1) {
      return false;
    }
    entityId = locateResult.entity_id;
  } else {
    const refreshResult = await query.returning('entity_id');
    if (refreshResult.length !== 1) {
      return false;
    }
    entityId = refreshResult[0]?.entity_id;
  }

  // We only get to this point if a processed entity actually had any changes, or
  // if an entity provider requested this mutation, meaning that we can safely
  // bump the deferred entities to the front of the queue for immediate processing.
  await knex<DbRefreshStateQueuesRow>('refresh_state_queues')
    .insert({
      entity_id: entityId,
      next_update_at: knex.fn.now(),
    })
    .onConflict(['entity_id'])
    .merge(['next_update_at']);

  return true;
}
