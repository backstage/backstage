/*
 * Copyright 2026 The Backstage Authors
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

// @ts-check

const { createHash } = require('node:crypto');

/** @param {{ type: string; target: string }} row */
function computeEntityRef(row) {
  const hash = createHash('sha1')
    .update(`${row.type}:${row.target}`)
    .digest('hex');
  return `location:default/generated-${hash}`;
}

/**
 * @param { import("knex").Knex } knex
 * @param { Array<{ id: string; entity_ref: string }> } pairs
 */
async function backfillPostgres(knex, pairs) {
  // Bulk update using unnest to avoid N individual UPDATE statements
  for (let i = 0; i < pairs.length; i += 5000) {
    const batch = pairs.slice(i, i + 5000);
    const ids = batch.map(p => p.id);
    const refs = batch.map(p => p.entity_ref);
    await knex.raw(
      `UPDATE locations SET entity_ref = t.entity_ref
       FROM (SELECT unnest(?::uuid[]) AS id, unnest(?::text[]) AS entity_ref) AS t
       WHERE locations.id = t.id`,
      [ids, refs],
    );
  }
}

/**
 * @param { import("knex").Knex } knex
 * @param { Array<{ id: string; entity_ref: string }> } pairs
 */
async function backfillBatched(knex, pairs) {
  for (let i = 0; i < pairs.length; i += 500) {
    const batch = pairs.slice(i, i + 500);
    for (const { id, entity_ref } of batch) {
      await knex('locations').where({ id }).update({ entity_ref });
    }
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('locations', table => {
    table.string('entity_ref').nullable();
  });

  const rows = await knex('locations').select('id', 'type', 'target');
  if (!rows.length) {
    return;
  }

  const pairs = rows.map(row => ({
    id: row.id,
    entity_ref: computeEntityRef(row),
  }));

  const client = knex.client.config.client;
  if (client.includes('pg')) {
    await backfillPostgres(knex, pairs);
  } else {
    await backfillBatched(knex, pairs);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('locations', table => {
    table.dropColumn('entity_ref');
  });
};
