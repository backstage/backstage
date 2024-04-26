/*
 * Copyright 2023 The Backstage Authors
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
  await knex.schema.createTable('ratings', table => {
    table.comment('Ratings table');
    table
      .string('entity_ref')
      .notNullable()
      .comment('The ref of the entity being rated');
    table
      .string('user_ref')
      .notNullable()
      .comment('The user applying the rating');
    table.string('rating').notNullable().comment('The rating value');
    table
      .timestamp('timestamp')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('When the rating was recorded');
  });

  await knex.schema.createTable('responses', table => {
    table.comment('Responses table');
    table
      .string('entity_ref')
      .notNullable()
      .comment('The ref of the applicable entity');
    table.string('user_ref').notNullable().comment('The user responding');
    table.text('response').comment('The serialized response');
    table.text('comments').comment('Additional user comments');
    table
      .boolean('consent')
      .defaultTo(true)
      .notNullable()
      .comment('Whether user (if recorded) consents to being contacted');
    table
      .timestamp('timestamp')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('When the response was recorded');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('ratings');
  await knex.schema.dropTable('responses');
};
