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
import { DbRefreshStateRow } from '../../tables';

/**
 * Attempts to update an existing refresh state row, returning true if it was
 * updated and false if there was no entity with a matching ref and location key.
 *
 * Updating the entity will also cause it to be scheduled for immediate processing.
 */
export async function updateUnprocessedEntity(options: {
  tx: Knex.Transaction;
  entity: Entity;
  hash: string;
  locationKey?: string;
}): Promise<boolean> {
  const { tx, entity, hash, locationKey } = options;

  const entityRef = stringifyEntityRef(entity);
  const serializedEntity = JSON.stringify(entity);

  const refreshResult = await tx<DbRefreshStateRow>('refresh_state')
    .update({
      unprocessed_entity: serializedEntity,
      unprocessed_hash: hash,
      location_key: locationKey,
      last_discovery_at: tx.fn.now(),
      // We only get to this point if a processed entity actually had any changes, or
      // if an entity provider requested this mutation, meaning that we can safely
      // bump the deferred entities to the front of the queue for immediate processing.
      next_update_at: tx.fn.now(),
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

  return refreshResult === 1;
}
