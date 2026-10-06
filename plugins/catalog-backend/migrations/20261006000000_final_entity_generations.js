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

const indexName = 'final_entities_generation_idx';

/** @param {import('knex').Knex} knex */
async function hasSecondaryIndex(knex) {
  if (knex.client.config.client.includes('sqlite')) {
    return Boolean(
      await knex('sqlite_master')
        .where({ type: 'index', name: indexName })
        .first(),
    );
  }
  return Boolean(
    await knex('information_schema.statistics')
      .whereRaw('table_schema = DATABASE()')
      .where({ table_name: 'final_entities', index_name: indexName })
      .first(),
  );
}

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  const isPg = knex.client.config.client.includes('pg');
  // Release the short DDL locks before scanning the heap for the index.
  await knex.transaction(async tx => {
    if (isPg) await tx.raw("SET LOCAL lock_timeout = '5s'");
    if (!(await tx.schema.hasColumn('final_entities', 'generation'))) {
      await tx.schema.alterTable('final_entities', table => {
        table.bigInteger('generation').nullable();
      });
    }
    if (!(await tx.schema.hasTable('catalog_generation_counter'))) {
      await tx.schema.createTable('catalog_generation_counter', table => {
        table.integer('id').primary();
        table.bigInteger('generation').notNullable();
        table.check('id = 1');
        table.check('generation >= 0');
      });
    }
    await tx('catalog_generation_counter')
      .insert({ id: 1, generation: 0 })
      .onConflict('id')
      .ignore();
    if (isPg) {
      const { rows } = await tx.raw('SELECT current_schema() AS schema');
      const schema = rows[0].schema;
      // Resolve the relation in the plugin's schema, even if a future caller
      // invokes the function with a different search_path. No elevated rights.
      await tx.raw(
        `CREATE OR REPLACE FUNCTION ??() RETURNS bigint LANGUAGE SQL AS $$
           UPDATE ?? SET generation = generation + 1 WHERE id = 1
           RETURNING generation
         $$`,
        [
          `${schema}.catalog_next_generation`,
          `${schema}.catalog_generation_counter`,
        ],
      );
    }
  });

  if (isPg) {
    const { rows } = await knex.raw(
      `SELECT i.indisvalid FROM pg_class c
           JOIN pg_namespace n ON n.oid = c.relnamespace
           JOIN pg_index i ON i.indexrelid = c.oid
           WHERE n.nspname = current_schema() AND c.relname = ?`,
      [indexName],
    );
    if (rows[0]?.indisvalid) return;
    if (rows.length) {
      await knex.raw('DROP INDEX CONCURRENTLY ??', [indexName]);
    }
    // A partial index avoids storing legacy rows, but PostgreSQL must still
    // scan the heap. Large installations can prebuild this exact index out
    // of band. No temporary session settings: transaction poolers do not pin
    // a server across these autocommit statements.
    await knex.raw(
      'CREATE INDEX CONCURRENTLY ?? ON final_entities (generation) INCLUDE (entity_ref) WHERE generation IS NOT NULL',
      [indexName],
    );
  } else if (!(await hasSecondaryIndex(knex))) {
    if (knex.client.config.client.includes('sqlite')) {
      await knex.raw(
        'CREATE INDEX ?? ON final_entities (generation, entity_ref) WHERE generation IS NOT NULL',
        [indexName],
      );
    } else {
      await knex.schema.alterTable('final_entities', table => {
        table.index(['generation', 'entity_ref'], indexName);
      });
    }
  }
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  if (knex.client.config.client.includes('pg')) {
    await knex.raw('DROP FUNCTION IF EXISTS catalog_next_generation()');
    await knex.raw('DROP INDEX CONCURRENTLY IF EXISTS ??', [indexName]);
  } else if (await hasSecondaryIndex(knex)) {
    await knex.schema.alterTable('final_entities', table =>
      table.dropIndex([], indexName),
    );
  }
  if (await knex.schema.hasColumn('final_entities', 'generation')) {
    await knex.schema.alterTable('final_entities', table =>
      table.dropColumn('generation'),
    );
  }
  await knex.schema.dropTableIfExists('catalog_generation_counter');
};

exports.config = { transaction: false };
