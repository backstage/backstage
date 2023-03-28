/*
 * Copyright 2022 The Backstage Authors
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
 */
exports.up = async function up(knex) {
  /**
   * Table: deliveries
   *
   * For each delivery of data from a provider, a delivery is created to keep
   * track of the work and outcomes. Each delivery has a number of delivery
   * entries, see delivery_entries.
   *
   * There are several types of action that can be performed as part of a
   * delivery. Once the delivery is complete and persisted, an action-specific
   * finishing process will run on the delivery. For example, a full replacement
   * action will remove all previous entities from this particular provider and
   * replace them with the contents of the delivery.
   */
  await knex.schema.createTable('deliveries', table => {
    table.comment('Data deliveries from providers');
    table.bigIncrements('id').unsigned().comment('Primary ID');

    table
      .string('source_key')
      .notNullable()
      .comment('The source key (typically entity provider name)');
    table
      .string('action')
      .notNullable()
      .comment('The type of action to perform with the delivered data');
    table
      .dateTime('started_at') // TODO: timezone or change to epoch-millis or similar
      .notNullable()
      .comment('When the delivery started');
    table
      .dateTime('ended_at') // TODO: timezone or change to epoch-millis or similar
      .nullable()
      .comment('When the delivery ended');

    table.index('source_key', 'deliveries_source_key_idx');
  });

  /**
   * Table: delivery_entries
   *
   * The individual parts of a given delivery. The contents of these rows are
   * dependent on the action type of the delivery that they belong to. For
   * example, some actions will have entries that are expected to refer to blobs
   * of entity data, while other actions will have e.g. an entity ref in the
   * value column.
   */
  // await knex.schema.createTable('delivery_entries', table => {
  //   table.comment('Individual parts of a delivery');
  //   table.bigIncrements('id').unsigned().comment('Primary ID');

  //   table.bigInteger('delivery_id').unsigned().notNullable();
  //   table.string('action').notNullable();
  //   table.string('entity_ref').nullable();

  //   table.index('delivery_id', 'delivery_entries_delivery_id_idx');

  //   table
  //     .foreign(['delivery_id'], 'delivery_entries_delivery_id_fk')
  //     .references(['id'])
  //     .inTable('deliveries')
  //     .onDelete('CASCADE');

  //   table
  //     .foreign(['blob_etag'], 'delivery_entries_blob_etag_fk')
  //     .references(['etag'])
  //     .inTable('blobs');
  // });

  /**
   * Table: provider_state
   *
   * The current state of entities from a given provider. This table is used to
   * keep track of all delivered data over time, no matter if it passes all
   * processing steps and gets promoted to a final entity or not.
   */
  await knex.schema.createTable('provider_state', table => {
    table.comment('TODO');

    table.bigIncrements('id').unsigned();
    table.string('source_key').notNullable();
    table.string('entity_ref').notNullable();
    table.string('location_key').nullable();
    table.boolean('deleted').notNullable();
    table.bigInteger('latest_delivery_id').unsigned().notNullable();

    table.text('unprocessed_entity', 'longtext').notNullable();
    table.string('unprocessed_entity_hash').notNullable();

    table.unique(['source_key', 'entity_ref'], {
      indexName: 'provider_state_unique_idx',
    });
  });

  /**
   * Table: ingestion_log
   *
   * TODO
   */
  await knex.schema.createTable('ingestion_log', table => {
    table.comment('TODO');

    table.bigIncrements('id').unsigned();

    // Labels
    table.bigInteger('delivery_id').unsigned().nullable();
    table.bigInteger('provider_state_id').unsigned().nullable();
    table.string('source_key').nullable();
    table.string('entity_ref').nullable();
    table.string('location_ref').nullable();

    // Contents
    table.dateTime('added_at').notNullable();
    table.string('type').notNullable();
    table.integer('severity').unsigned().notNullable();
    table.string('message').notNullable();
    table.text('data', 'longtext').nullable();

    table
      .foreign(['delivery_id'], 'processing_log_delivery_id_fk')
      .references(['id'])
      .inTable('deliveries')
      .onDelete('CASCADE');

    table
      .foreign(['provider_state_id'], 'processing_log_provider_state_id_fk')
      .references(['id'])
      .inTable('provider_state')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('delivery_entries', table => {
    table.dropForeign([], 'delivery_entries_delivery_id_fk');
    table.dropForeign([], 'delivery_entries_blob_etag_fk');
    table.dropIndex([], 'delivery_entries_delivery_id_idx');
  });
  await knex.schema.dropTable('delivery_entries');

  await knex.schema.alterTable('deliveries', table => {
    table.dropIndex([], 'deliveries_source_key_idx');
  });
  await knex.schema.dropTable('deliveries');

  await knex.schema.dropTable('blobs');
};
