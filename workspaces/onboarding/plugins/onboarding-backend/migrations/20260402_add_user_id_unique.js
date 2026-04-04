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
 * Adds a UNIQUE constraint on user_id so that the ON CONFLICT clause in
 * upsertProgress() works correctly. Without this, duplicate rows per user
 * could be inserted.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('onboarding_progress', table => {
    table.dropIndex(['user_id'], 'onboarding_progress_user_id_idx');
    table.unique(['user_id'], {
      indexName: 'onboarding_progress_user_id_unique',
    });
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('onboarding_progress', table => {
    table.dropUnique(['user_id'], 'onboarding_progress_user_id_unique');
    table.index(['user_id'], 'onboarding_progress_user_id_idx');
  });
};
