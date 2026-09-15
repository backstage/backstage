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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('active_entities', table => {
    table.comment(
      'A running tally of every entity ref currently tracked by an incremental ingestion provider, maintained by @backstage/plugin-catalog-backend-module-incremental-ingestion',
    );

    table
      .increments('id')
      .comment('Primary key to distinguish unique lines from each other');

    table
      .string('source_key', 255)
      .notNullable()
      .comment('The name of the incremental entity provider');

    table
      .string('entity_ref', 255)
      .notNullable()
      .comment('The entity reference tracked by the provider');
  });

  await knex.schema.alterTable('active_entities', table => {
    table.unique(
      ['source_key', 'entity_ref'],
      'active_entities_source_key_entity_ref_unique',
    );
    table.index('entity_ref', 'active_entities_entity_ref_idx');
  });

  // Backfill from `refresh_state_references`, which is owned by
  // `@backstage/plugin-catalog-backend`, so that upgrading existing
  // installs doesn't lose track of what's already active. Only backfill
  // for providers that have ever run an incremental ingestion.
  const hasRefreshStateReferences = await knex.schema.hasTable(
    'refresh_state_references',
  );
  if (hasRefreshStateReferences) {
    const { sql: selectSql, bindings: selectBindings } = knex(
      'refresh_state_references',
    )
      .select({
        source_key: 'source_key',
        entity_ref: 'target_entity_ref',
      })
      .whereIn('source_key', knex('ingestions').distinct('provider_name'))
      .toSQL();

    await knex.raw(`insert into ?? (??, ??) ${selectSql}`, [
      'active_entities',
      'source_key',
      'entity_ref',
      ...selectBindings,
    ]);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('active_entities');
};
