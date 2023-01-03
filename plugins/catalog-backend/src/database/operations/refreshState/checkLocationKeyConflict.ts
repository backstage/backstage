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
import { DbRefreshStateRow } from '../../tables';

/**
 * Checks whether a refresh state exists for the given entity that has a
 * location key that does not match the provided location key.
 *
 * @returns The conflicting key if there is one.
 */
export async function checkLocationKeyConflict(options: {
  tx: Knex.Transaction;
  entityRef: string;
  locationKey?: string;
}): Promise<string | undefined> {
  const { tx, entityRef, locationKey } = options;

  const row = await tx<DbRefreshStateRow>('refresh_state')
    .select('location_key')
    .where('entity_ref', entityRef)
    .first();

  const conflictingKey = row?.location_key;

  // If there's no existing key we can't have a conflict
  if (!conflictingKey) {
    return undefined;
  }

  if (conflictingKey !== locationKey) {
    return conflictingKey;
  }
  return undefined;
}
