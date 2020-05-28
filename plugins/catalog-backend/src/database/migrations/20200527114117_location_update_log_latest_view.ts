/*
 * Copyright 2020 Spotify AB
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
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  // Need to first order by date of creation
  const query = knex
    .select()
    .from('location_update_log')
    .orderBy('location_update_log.created_at', 'desc');

  // And only then to do the grouping to get the latest per location
  const groupedQuery = knex(query).groupBy('location_id').select();

  await knex.schema.raw(
    `CREATE VIEW location_update_log_latest AS ${groupedQuery.toString()};`,
  );
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.raw(`DROP VIEW location_update_log_latest;`);
}
