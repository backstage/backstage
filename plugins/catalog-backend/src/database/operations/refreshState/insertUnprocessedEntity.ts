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
import { DbRefreshStateRow, DbRefreshStateSourceType } from '../../tables';
import { v4 as uuid } from 'uuid';
import {
  LoggerService,
  isDatabaseConflictError,
} from '@backstage/backend-plugin-api';

/**
 * Attempts to insert a new refresh state row for the given entity, returning
 * true if successful and false if there was a conflict.
 */
export async function insertUnprocessedEntity(options: {
  tx: Knex | Knex.Transaction;
  entity: Entity;
  hash: string;
  locationKey?: string;
  sourceType?: DbRefreshStateSourceType;
  sourceKey?: string;
  logger: LoggerService;
}): Promise<boolean> {
  const { tx, entity, hash, logger, locationKey, sourceType, sourceKey } =
    options;

  const entityRef = stringifyEntityRef(entity);
  const serializedEntity = JSON.stringify(entity);

  try {
    let query = tx<DbRefreshStateRow>('refresh_state').insert({
      entity_id: uuid(),
      entity_ref: entityRef,
      unprocessed_entity: serializedEntity,
      unprocessed_hash: hash,
      errors: '',
      location_key: locationKey,
      source_type: sourceType,
      source_key: sourceKey,
      created_at: tx.fn.now(),
      next_update_at: tx.fn.now(),
      last_discovery_at: tx.fn.now(),
    });

    // TODO(Rugvip): only tested towards MySQL, Postgres and SQLite.
    // We have to do this because the only way to detect if there was a conflict with
    // SQLite is to catch the error, while Postgres needs to ignore the conflict to not
    // break the ongoing transaction.
    // The unique constraint is now on (source_type, source_key, entity_ref).
    if (tx.client.config.client.includes('pg')) {
      query = query
        .onConflict(['source_type', 'source_key', 'entity_ref'])
        .ignore() as any; // type here does not match runtime
    }

    // Postgres gives as an object with rowCount, SQLite gives us an array
    const result: { rowCount?: number; length?: number } = await query;
    return result.rowCount === 1 || result.length === 1;
  } catch (error) {
    // SQLite, or MySQL reached this rather than the rowCount check above
    if (!isDatabaseConflictError(error)) {
      throw error;
    } else {
      logger.debug(`Unable to insert a new refresh state row, ${error}`);
      return false;
    }
  }
}
