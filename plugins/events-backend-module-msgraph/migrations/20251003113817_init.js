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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('module_msgraph__subscriptions', table => {
    table.comment('Tracks Microsoft Graph webhook subscriptions');

    table
      .string('id')
      .notNullable()
      .comment('Subscription ID provided by Microsoft Graph');

    table
      .string('resource')
      .notNullable()
      .comment('The resource path being monitored by the subscription');

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('When the subscription was created');

    table
      .timestamp('expires_at')
      .notNullable()
      .comment('When the subscription will expire');

    table
      .string('token_hash')
      .notNullable()
      .comment(
        'The validation token hash to verify ownership of the notification URL',
      );

    table
      .string('token_salt')
      .notNullable()
      .comment(
        'The salt used to hash the validation token for the notification URL',
      );
  });

  await knex.schema.alterTable('module_msgraph__subscriptions', t => {
    t.primary(['id']);
    t.unique(['resource'], {
      indexName: 'module_msgraph__subscriptions_resource_index',
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('module_msgraph__subscriptions');
};
