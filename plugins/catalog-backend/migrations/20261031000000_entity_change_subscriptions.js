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

// Dropping a column makes Knex rebuild the table on SQLite, and it can only
// disable foreign key checks for that outside of a transaction. Inside one,
// dropping the old final_entities table would cascade into search.
exports.config = { transaction: false };

/** @param {import('knex').Knex} knex */
const isPg = knex => knex.client.config.client === 'pg';

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  await knex.transaction(async tx => {
    if (isPg(knex)) {
      await tx.raw("SET LOCAL lock_timeout = '5s'");
    }

    // The last published body of a tombstone, so that permission conditions
    // can still be evaluated for its deletion. Null for live rows.
    if (!(await tx.schema.hasColumn('final_entities', 'last_final_entity'))) {
      await tx.schema.alterTable('final_entities', table => {
        table.text('last_final_entity', 'longtext').nullable();
      });
    }

    if (!(await tx.schema.hasTable('entity_change_subscriptions'))) {
      await tx.schema.createTable('entity_change_subscriptions', table => {
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
          .defaultTo(tx.fn.now())
          .comment('When the subscription was created');
        table
          .dateTime('active_at')
          .notNullable()
          .defaultTo(tx.fn.now())
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
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('entity_change_subscriptions');

  if (await knex.schema.hasColumn('final_entities', 'last_final_entity')) {
    await knex.schema.alterTable('final_entities', table => {
      table.dropColumn('last_final_entity');
    });
  }
};
