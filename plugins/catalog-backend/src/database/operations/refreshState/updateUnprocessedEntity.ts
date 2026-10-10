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
 * Attempts to update an existing refresh state row, returning an object with:
 * - `updated`: true if the row was updated, false if there was no entity with
 *   a matching ref and location key.
 * - `claimedFromNullLocationKey`: true if the update transitioned the entity's location_key
 *   from null to a non-null value (i.e., the entity was claimed by a specific
 *   location for the first time).
 *
 * Updating the entity will also cause it to be scheduled for immediate processing.
 */
export async function updateUnprocessedEntity(options: {
  tx: Knex | Knex.Transaction;
  entity: Entity;
  entityRef?: string;
  hash: string;
  locationKey?: string;
}): Promise<{
  updated: boolean;
  claimedFromNullLocationKey: boolean;
}> {
  const { tx, entity, hash, locationKey } = options;
  const entityRef = options.entityRef ?? stringifyEntityRef(entity);
  const serializedEntity = JSON.stringify(entity);

  const values = {
    unprocessed_entity: serializedEntity,
    unprocessed_hash: hash,
    location_key: locationKey,
    last_discovery_at: tx.fn.now(),
    // We only get to this point if a processed entity actually had any changes, or
    // if an entity provider requested this mutation, meaning that we can safely
    // bump the deferred entities to the front of the queue for immediate processing.
    next_update_at: tx.fn.now(),
  };

  if (locationKey) {
    // If the entity is being claimed by a specific location, we first try to update
    // an existing row with a null location_key. This allows us to "claim" the entity
    // for the first time, and avoid a race condition where two locations might try
    // to claim the same entity at the same time.
    const claimed = await tx<DbRefreshStateRow>('refresh_state')
      .update(values)
      .where({
        entity_ref: entityRef,
      })
      .whereNull('location_key');

    if (claimed === 1) {
      // We successfully claimed the entity from a null location_key, so we return early
      return {
        updated: true,
        claimedFromNullLocationKey: true,
      };
    }
  }

  // If we didn't claim the entity from a null location_key, we try to update an existing row
  // with a matching location_key, or a null location_key. This allows us to update
  // the entity if it was previously claimed by a specific location, or if it was
  // never claimed at all.
  const refreshResult = await tx<DbRefreshStateRow>('refresh_state')
    .update(values)
    .where('entity_ref', entityRef)
    .andWhere(inner => {
      if (!locationKey) {
        return inner.whereNull('location_key');
      }
      return inner
        .where('location_key', locationKey)
        .orWhereNull('location_key');
    });

  return {
    updated: refreshResult === 1,
    claimedFromNullLocationKey: false,
  };
}
