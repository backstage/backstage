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

exports.up = async function (knex) {
  await knex.schema.createTable('checklists', table => {
    table.string('group').index();
    table.string('title').notNullable();
    table.string('checklist_uid').primary().unique();
    table.string('formSchema', 1000).notNullable();
    table.string('forRoles').notNullable();
    table.string('checklistHash').notNullable();
    table.string('groupHash').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('checklistResponse', table => {
    table.string('user').notNullable().index();
    table.string('checklist_uid').notNullable();
    table
      .foreign('checklist_uid')
      .references('checklist_uid')
      .inTable('checklists');
    table.string('userResponse');
    table.boolean('isDone').notNullable();
    table.integer('progressStatus').notNullable();
    table.string('checklistHash').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {};
