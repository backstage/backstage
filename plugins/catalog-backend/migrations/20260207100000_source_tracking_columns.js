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
 * Adds source tracking columns to refresh_state table.
 * These columns allow tracking whether an entity came from a provider or a parent entity,
 * enabling multiple sources to contribute views of the same entity_ref.
 *
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('refresh_state', table => {
    // 'provider' or 'entity' - indicates whether the source is an entity provider or a parent entity
    table.string('source_type', 16).nullable();
    // The provider name (if source_type='provider') or parent entity_ref (if source_type='entity')
    table.text('source_key').nullable();
    // Timestamp for tie-breaking when multiple sources emit the same entity_ref
    table.dateTime('created_at').nullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('refresh_state', table => {
    table.dropColumn('source_type');
    table.dropColumn('source_key');
    table.dropColumn('created_at');
  });
};
