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

exports.up = async function (knex) {
  await knex.raw(`
CREATE VIEW ingestion.current_entities as SELECT
  FORMAT('%s:%s/%s',
    LOWER(final_entity::json #>> '{kind}'),
    LOWER(final_entity::json #>> '{metadata, namespace}'),
    LOWER(final_entity::json #>> '{metadata, name}')) as ref,
  final_entity::json #>> '{metadata, annotations, hp.com/provider-name}' as provider_name,
  final_entity FROM public.final_entities;
`);

  const schema = () => knex.schema.withSchema('ingestion');

  await schema().createTable('ingestions', table => {
    table.comment('Tracks ingestion streams for very large data sets');

    table.uuid('id', { primary: true }).notNullable().comment('Auto-generated ID of the ingestion');

    table.string('provider_name').notNullable().comment('each provider gets its own identifiable name');

    table
      .string('status')
      .notNullable()
      .comment('One of "interstitial" | "bursting" | "backing off" | "resting" | "complete"');

    table.string('next_action').notNullable().comment("what will this, 'ingest', 'rest', 'backoff', 'nothing (done)'");

    table
      .timestamp('next_action_at')
      .defaultTo(knex.fn.now())
      .comment('the moment in time at which point ingestion can begin again');

    table.string('last_error').comment('records any error that occured in the previous burst attempt');

    table.integer('attempts').defaultTo(0).comment('how many attempts have been made to burst without success');

    table.timestamp('created_at').defaultTo(knex.fn.now()).comment('when did this ingestion actually begin');

    table.timestamp('ingestion_completed_at').comment('when did the ingestion actually end');

    table.timestamp('rest_completed_at').comment('when did the rest period actually end');
  });

  await schema().createTable('ingestion_marks', table => {
    table.comment('tracks each step of an iterative ingestion');

    table.uuid('id', { primary: true }).notNullable().comment('Auto-generated ID of the ingestion mark');

    table.uuid('ingestion_id').notNullable().comment('The id of the ingestion in which this mark took place');

    // table
    //   .foreign('ingestion_id').references('ingestions.id');

    table
      .json('cursor')
      .comment('the current data associated with this iteration wherever it is in this moment in time');

    table.integer('sequence').defaultTo(0).comment('what is the order of this mark');

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await schema().createTable('ingestion_mark_entities', table => {
    table.comment('tracks the entities recorded in each step of an iterative ingestion');

    table.uuid('id', { primary: true }).notNullable().comment('Auto-generated ID of the marked entity');

    table
      .uuid('ingestion_mark_id')
      .notNullable()
      .comment('Every time a mark happens during an ingestion, there are a list of entities marked.');

    // table
    //   .foreign('ingestion_mark_id').references('ingestion_marks.id');

    table.string('ref').notNullable().comment('the entity reference of the marked entity');
  });
};

exports.down = async function (knex) {
  const schema = () => knex.schema.withSchema('ingestion');

  await schema().dropView('current_entities');

  await schema().dropTable('ingestion_mark_entities');

  await schema().dropTable('ingestion_marks');

  await schema().dropTable('ingestions');
};
