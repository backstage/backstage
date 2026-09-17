/*
 * Copyright 2024 The Backstage Authors
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
  // The event bus only supports PostgresSQL
  if (knex.client.config.client === 'pg') {
    await knex.schema.createTable('event_bus_events', table => {
      table.comment('Events published to the events bus');
      table
        .bigIncrements('id')
        .primary()
        .comment('The unique ID of this event');
      table
        .text('created_by')
        .notNullable()
        .comment('The principal that published the event');
      table
        .dateTime('created_at')
        .defaultTo(knex.fn.now())
        .notNullable()
        .comment('The time that the event was created');
      table.text('topic').notNullable().comment('The topic of the event');
      table
        .text('data_json')
        .notNullable()
        .comment('The payload data of this event');
      table
        .specificType('notified_subscribers', 'text ARRAY')
        .comment(
          'The IDs of the subscribers that have already consumed this event',
        );

      table.index('topic', 'event_bus_events_topic_idx');
    });

    await knex.schema.createTable('event_bus_subscriptions', table => {
      table.comment('Subscriptions to the event bus');
      table
        .string('id')
        .primary()
        .notNullable()
        .comment('The unique ID of this particular subscription');
      table
        .text('created_by')
        .notNullable()
        .comment('The principal that created the subscription');
      table
        .dateTime('created_at')
        .defaultTo(knex.fn.now())
        .notNullable()
        .comment('The time that the subscription was created');
      table
        .dateTime('updated_at')
        .defaultTo(knex.fn.now())
        .notNullable()
        .comment('The time that the subscription was last updated');
      table
        .bigInteger('read_until')
        .notNullable()
        .comment(
          'The sequence counter until which the subscription has read events',
        );
      table
        .specificType('topics', 'text ARRAY')
        .comment('The topics that this subscriber is interested in');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  if (knex.client.config.client === 'pg') {
    await knex.schema.dropTable('event_bus_subscriptions');
    await knex.schema.dropTable('event_bus_events');
  }
};
