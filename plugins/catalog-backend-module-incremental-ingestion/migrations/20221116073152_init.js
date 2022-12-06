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
   * Sets up the ingestions table
   */
  await knex.schema.createTable('ingestions', table => {
    table.comment('Tracks ingestion streams for very large data sets');

    table
      .uuid('id')
      .notNullable()
      .comment('Auto-generated ID of the ingestion');

    table
      .string('provider_name')
      .notNullable()
      .comment('each provider gets its own identifiable name');

    table
      .string('status')
      .notNullable()
      .comment(
        'One of "interstitial" | "bursting" | "backing off" | "resting" | "complete"',
      );

    table
      .string('next_action')
      .notNullable()
      .comment("what will this, 'ingest', 'rest', 'backoff', 'nothing (done)'");

    table
      .timestamp('next_action_at')
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('the moment in time at which point ingestion can begin again');

    table
      .string('last_error')
      .comment('records any error that occurred in the previous burst attempt');

    table
      .integer('attempts')
      .notNullable()
      .defaultTo(0)
      .comment('how many attempts have been made to burst without success');

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('when did this ingestion actually begin');

    table
      .timestamp('ingestion_completed_at')
      .comment('when did the ingestion actually end');

    table
      .timestamp('rest_completed_at')
      .comment('when did the rest period actually end');

    table
      .string('completion_ticket')
      .notNullable()
      .comment(
        'indicates whether the ticket is still open or stamped complete',
      );
  });

  await knex.schema.alterTable('ingestions', t => {
    t.primary(['id']);
    t.index('provider_name', 'ingestion_provider_name_idx');
    t.unique(['provider_name', 'completion_ticket'], {
      indexName: 'ingestion_composite_index',
      deferrable: 'deferred',
    });
  });

  /**
   * Sets up the ingestion_marks table
   */
  await knex.schema.createTable('ingestion_marks', table => {
    table.comment('tracks each step of an iterative ingestion');

    table
      .uuid('id')
      .notNullable()
      .comment('Auto-generated ID of the ingestion mark');

    table
      .uuid('ingestion_id')
      .notNullable()
      .references('id')
      .inTable('ingestions')
      .onDelete('CASCADE')
      .comment('The id of the ingestion in which this mark took place');

    table
      .json('cursor')
      .comment(
        'the current data associated with this iteration wherever it is in this moment in time',
      );

    table
      .integer('sequence')
      .notNullable()
      .defaultTo(0)
      .comment('what is the order of this mark');

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable('ingestion_marks', t => {
    t.primary(['id']);
    t.index('ingestion_id', 'ingestion_mark_ingestion_id_idx');
  });

  /**
   * Set up the ingestion_mark_entities table
   */
  await knex.schema.createTable('ingestion_mark_entities', table => {
    table.comment(
      'tracks the entities recorded in each step of an iterative ingestion',
    );

    table
      .uuid('id')
      .notNullable()
      .comment('Auto-generated ID of the marked entity');

    table
      .uuid('ingestion_mark_id')
      .notNullable()
      .references('id')
      .inTable('ingestion_marks')
      .onDelete('CASCADE')
      .comment(
        'Every time a mark happens during an ingestion, there are a list of entities marked.',
      );

    table
      .string('ref')
      .notNullable()
      .comment('the entity reference of the marked entity');
  });

  await knex.schema.alterTable('ingestion_mark_entities', t => {
    t.primary(['id']);
    t.index('ingestion_mark_id', 'ingestion_mark_entity_ingestion_mark_id_idx');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('ingestion_mark_entities');
  await knex.schema.dropTable('ingestion_marks');
  await knex.schema.dropTable('ingestions');
};
