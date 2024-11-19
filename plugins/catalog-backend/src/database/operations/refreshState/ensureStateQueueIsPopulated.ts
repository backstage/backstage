/*
 * Copyright 2024 The Backstage Authors
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

/**
 * Populate the `refresh_state_queues` table with data.
 *
 * @remarks
 *
 * The `refresh_state_queues` table is `UNLOGGED`, which means it's not durable,
 * on some databases. Fill it with data such that every refresh state row has a
 * corresponding queue entry. If we don't do this, some entities will never get
 * processed.
 *
 * To not cause a thundering herd problem of stitching everything at once after
 * startup, we ensure that all entities are evenly spread out over the
 * processing interval.
 */
export async function ensureStateQueueIsPopulated(
  knex: Knex | Knex.Transaction,
  refreshIntervalSeconds: number,
): Promise<void> {
  if (!(await knex.schema.hasTable('refresh_state_queues'))) {
    return;
  }

  let interval: string;
  const seconds = Math.max(0, Math.floor(refreshIntervalSeconds)); // some engines don't like fractional units

  if (knex.client.config.client.includes('sqlite3')) {
    interval = `datetime(unixepoch() + floor(${seconds} * abs(cast(random() as real) / -9223372036854775808)), 'unixepoch')`;
  } else if (knex.client.config.client.includes('mysql')) {
    interval = `now() + interval floor(rand() * ${seconds}) second`;
  } else {
    interval = `now() + random() * interval '${seconds} seconds'`;
  }

  await knex.raw(`
    INSERT INTO refresh_state_queues (entity_id, next_update_at)
    SELECT entity_id, ${interval}
    FROM refresh_state
    WHERE entity_id NOT IN (SELECT entity_id FROM refresh_state_queues);
  `);
}
