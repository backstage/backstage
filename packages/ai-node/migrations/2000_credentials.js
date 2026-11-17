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

// Personal provider credentials. Table names must match
// src/credentials/EncryptedUserCredentialStore.ts.
exports.up = async function up(knex) {
  await knex.schema.createTable('ai_credential_user_secrets', table => {
    table.text('scope').notNullable();
    table.text('provider_id').notNullable();
    table.text('credential_type').notNullable();
    table.text('algorithm').notNullable();
    table.integer('key_version').notNullable();
    table.text('nonce').notNullable();
    table.text('ciphertext').notNullable();
    table.text('tag').notNullable();
    table.timestamp('updated_at', { useTz: true }).notNullable();
    table.primary(['scope', 'provider_id']);
  });

  await knex.schema.createTable('ai_credential_locks', table => {
    table.text('scope').notNullable();
    table.text('provider_id').notNullable();
    table.text('owner_id').nullable();
    table.bigInteger('expires_at').nullable();
    table.primary(['scope', 'provider_id']);
    table.index(['scope', 'owner_id'], 'ai_credential_locks_scope_owner_idx');
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('ai_credential_locks');
  await knex.schema.dropTableIfExists('ai_credential_user_secrets');
};
