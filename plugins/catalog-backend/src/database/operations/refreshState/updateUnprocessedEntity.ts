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
 * Attempts to update an existing refresh state row, also reporting whether a
 * weak entity without a location key was claimed by a strong source.
 *
 * Updating the entity will also cause it to be scheduled for immediate processing.
 */
export async function updateUnprocessedEntity(options: {
  tx: Knex | Knex.Transaction;
  entity: Entity;
  hash: string;
  locationKey?: string;
}): Promise<{ updated: boolean; claimed: boolean }> {
  const { tx, entity, hash, locationKey } = options;

  const entityRef = stringifyEntityRef(entity);
  const serializedEntity = JSON.stringify(entity);

  const update = {
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
    const claimed = await tx<DbRefreshStateRow>('refresh_state')
      .update(update)
      .where('entity_ref', entityRef)
      .whereNull('location_key');
    if (claimed === 1) {
      return { updated: true, claimed: true };
    }

    const updated = await tx<DbRefreshStateRow>('refresh_state')
      .update(update)
      .where('entity_ref', entityRef)
      .where('location_key', locationKey);
    return { updated: updated === 1, claimed: false };
  }

  const updated = await tx<DbRefreshStateRow>('refresh_state')
    .update(update)
    .where('entity_ref', entityRef)
    .whereNull('location_key');
  return { updated: updated === 1, claimed: false };
}
