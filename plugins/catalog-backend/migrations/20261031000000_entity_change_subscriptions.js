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

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  if (!(await knex.schema.hasTable('entity_change_subscriptions'))) {
    await knex.schema.createTable('entity_change_subscriptions', table => {
      table.comment('Persistent subscriptions to entity changes');
      table
        .string('subscription_id')
        .primary()
        .comment('Unique ID of the subscription');
      table
        .text('owner')
        .notNullable()
        .comment('The principal that created the subscription');
      table
        .dateTime('created_at')
        .notNullable()
        .defaultTo(knex.fn.now())
        .comment('When the subscription was created');
      table
        .dateTime('active_at')
        .notNullable()
        .defaultTo(knex.fn.now())
        .comment('When a client last used the subscription');
      table
        .string('state')
        .notNullable()
        .comment('Either idle, or waiting for a batch to be acknowledged');
      table
        .string('ack_id')
        .nullable()
        .comment('The ID that acknowledges the batch that was last sent');
      table
        .dateTime('ack_timeout_at')
        .nullable()
        .comment('When the batch that was last sent may be sent again');
      table
        .bigInteger('last_sent_generation')
        .notNullable()
        .comment('The position after the batch that was last sent');
      table
        .bigInteger('last_acknowledged_generation')
        .notNullable()
        .comment('The position after the last acknowledged batch');
      table
        .text('scope')
        .nullable()
        .comment('JSON array of scope entries, or null for everything');
    });
  }
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('entity_change_subscriptions');
};
